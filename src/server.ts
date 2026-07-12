import express from "express";
import { createServer as createViteServer } from "vite";
import Stripe from "stripe";
import { Resend } from "resend";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import http from "http";
import { Server } from "socket.io";
import bcrypt from "bcryptjs";
import path from "path";
import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import helmet from "helmet";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      nodeProfilingIntegration(),
    ],
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
  });
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_not_configured", {
  apiVersion: "2023-10-16" as any,
});

const resend = new Resend(process.env.RESEND_API_KEY || "re_not_configured");
const geminiApiKey = process.env.GEMINI_API_KEY;
const gemini = geminiApiKey ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;

const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://not-configured.supabase.co";
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || "not-configured";
const supabaseConfigured = Boolean(
  process.env.VITE_SUPABASE_URL &&
  (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY)
);
const supabase = createClient(
  supabaseUrl,
  supabaseKey
);

const aiRateLimits = new Map<string, { count: number; resetAt: number }>();
const AI_RATE_LIMIT = Number(process.env.AI_RATE_LIMIT || 20);
const AI_RATE_WINDOW_MS = 5 * 60 * 1000;

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });
  const PORT = Number(process.env.PORT || 8080);

  if (process.env.SENTRY_DSN) {
    Sentry.setupExpressErrorHandler(app);
  }

  // helmet removed for debugging rendering issues
  /*
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://*.stripe.com", "https://*.firebaseapp.com", "https://*.googleapis.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        imgSrc: ["'self'", "data:", "https://*.picsum.photos", "https://*.supabase.co", "https://*.googleusercontent.com", "https://*.firebaseapp.com"],
        connectSrc: ["'self'", "https://*.supabase.co", "https://*.stripe.com", "https://*.sentry.io", "https://*.googleapis.com", "https://*.firebaseapp.com", "wss://*.run.app"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        frameSrc: ["'self'", "https://*.stripe.com", "https://*.firebaseapp.com"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    crossOriginEmbedderPolicy: false,
  }));
  */

  app.use(cors());

  // Socket.io connection handling
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("join-room", (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  // Helper to send notifications
  const sendNotification = (roomId: string, notification: any) => {
    io.to(roomId).emit("notification", notification);
  };

  // Auth middleware: validates bearer token and attaches user to req
  const requireAuth = async (req: any, res: any, next: any) => {
    if (!supabaseConfigured) return res.status(503).json({ error: "Authentication not configured." });
    const token = req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.slice(7) : undefined;
    if (!token) return res.status(401).json({ error: "Authentication required." });
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) return res.status(401).json({ error: "Invalid or expired session." });
    req.user = data.user;
    next();
  };

  // Webhook route must use raw body parser
  app.post(
    "/api/webhook",
    express.raw({ type: "application/json" }),
    async (req, res) => {
      if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET || !supabaseConfigured) {
        return res.status(503).json({ error: "Stripe webhook and Supabase are not configured." });
      }

      const sig = req.headers["stripe-signature"];
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

      let event;

      try {
        if (!endpointSecret) throw new Error("Missing STRIPE_WEBHOOK_SECRET");
        event = stripe.webhooks.constructEvent(req.body, sig as string, endpointSecret);
      } catch (err: any) {
        console.error("Webhook Error:", err.message);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }

      // Handle the event
      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id;
        
        // Retrieve line items to determine the plan
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
        const priceId = lineItems.data[0]?.price?.id;
        
        let plan = "free";
        if (priceId === process.env.STRIPE_PRICE_EDUCATOR) {
            plan = "educator";
        } else if (priceId === process.env.STRIPE_PRICE_CENTRE) {
            plan = "centre";
        }

        if (userId) {
            console.log(`Upgrading user ${userId} to plan ${plan}`);
            
            // 1. Update profiles table
            const { error: profileError } = await supabase
                .from("profiles")
                .update({ plan: plan })
                .eq("id", userId);
                
            if (profileError) {
                console.error("Error updating profile plan:", profileError);
            }

            // 2. Update auth user metadata (so we don't strictly rely on profiles table)
            const { error: authError } = await supabase.auth.admin.updateUserById(
                userId,
                { user_metadata: { plan: plan } }
            );
            
            if (authError) {
                console.error("Error updating auth metadata:", authError);
            }
        }
      }

      res.send();
    }
  );

  // API routes
  app.use(express.json({ limit: "15mb" }));

  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      mode: supabaseConfigured ? "cloud" : "demo",
      integrations: {
        supabase: supabaseConfigured,
        stripe: Boolean(process.env.STRIPE_SECRET_KEY),
        email: Boolean(process.env.RESEND_API_KEY),
        gemini: Boolean(process.env.GEMINI_API_KEY),
      },
    });
  });

  app.post("/api/gemini", async (req, res) => {
    if (!gemini) {
      return res.status(503).json({ error: "Gemini is not configured." });
    }

    if (process.env.NODE_ENV === "production" && !supabaseConfigured) {
      return res.status(503).json({ error: "Cloud authentication must be configured before AI can be enabled." });
    }

    const bearerToken = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.slice(7)
      : undefined;
    let requesterId = req.ip || "unknown";
    if (supabaseConfigured) {
      if (!bearerToken) return res.status(401).json({ error: "Sign in to use AI features." });
      const { data, error } = await supabase.auth.getUser(bearerToken);
      if (error || !data.user) return res.status(401).json({ error: "Your session is invalid or expired." });
      requesterId = data.user.id;
    }

    const now = Date.now();
    const currentLimit = aiRateLimits.get(requesterId);
    const nextLimit = !currentLimit || currentLimit.resetAt <= now
      ? { count: 1, resetAt: now + AI_RATE_WINDOW_MS }
      : { ...currentLimit, count: currentLimit.count + 1 };
    aiRateLimits.set(requesterId, nextLimit);
    res.setHeader("X-RateLimit-Limit", AI_RATE_LIMIT);
    res.setHeader("X-RateLimit-Remaining", Math.max(0, AI_RATE_LIMIT - nextLimit.count));
    res.setHeader("Cache-Control", "no-store");
    if (nextLimit.count > AI_RATE_LIMIT) {
      return res.status(429).json({ error: "AI request limit reached. Please wait a few minutes and try again." });
    }

    const { prompt, responseMimeType, image, useSearch } = req.body || {};
    if (typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({ error: "A prompt is required." });
    }
    if (prompt.length > 12_000) {
      return res.status(413).json({ error: "The AI prompt is too large." });
    }
    if (responseMimeType && responseMimeType !== "application/json") {
      return res.status(400).json({ error: "Unsupported AI response format." });
    }
    if (image?.data && (!/^image\/(png|jpeg|webp)$/.test(image.mimeType || "") || image.data.length > 14_000_000)) {
      return res.status(413).json({ error: "Images must be PNG, JPEG, or WebP and under 10 MB." });
    }

    try {
      const contents = image?.data && image?.mimeType
        ? { parts: [{ inlineData: { data: image.data, mimeType: image.mimeType } }, { text: prompt }] }
        : prompt;
      const response = await gemini.models.generateContent({
        model: image ? "gemini-2.5-flash-image" : (process.env.GEMINI_MODEL || "gemini-2.5-flash"),
        contents,
        config: {
          ...(responseMimeType ? { responseMimeType } : {}),
          ...(useSearch ? { tools: [{ googleSearch: {} }] } : {}),
          systemInstruction: "You are an expert Early Childhood Educator assistant in Australia. Align educational guidance with EYLF V2.0 and clearly distinguish operational guidance from legal or medical advice.",
        },
      });
      const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData)?.inlineData;
      res.json({ text: response.text || "", image: imagePart?.data ? { data: imagePart.data, mimeType: imagePart.mimeType || "image/png" } : null });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(502).json({ error: "AI generation failed." });
    }
  });

  app.post("/api/create-checkout-session", async (req, res) => {
    try {
      const { plan, userId, email } = req.body;

      if (!process.env.STRIPE_SECRET_KEY) {
          return res.status(500).json({ error: "Stripe is not configured on the server." });
      }

      let priceId = "";
      if (plan === "educator") {
        priceId = process.env.STRIPE_PRICE_EDUCATOR || "";
      } else if (plan === "centre") {
        priceId = process.env.STRIPE_PRICE_CENTRE || "";
      }

      if (!priceId) {
        return res.status(400).json({ error: "Invalid plan or missing price ID" });
      }

      // Use the APP_URL environment variable provided by the platform
      const domain = process.env.APP_URL || `http://localhost:${PORT}`;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${domain}/?payment_success=true&plan=${plan}`,
        cancel_url: `${domain}/`,
        client_reference_id: userId,
        customer_email: email,
      });

      res.json({ url: session.url });
    } catch (error: any) {
      console.error("Stripe Checkout Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // --- EMAIL SENDING ENDPOINT ---
  app.post("/api/send-email", requireAuth, async (req: any, res) => {
    try {
      const { to, subject, html, text } = req.body;

      if (!process.env.RESEND_API_KEY) {
        return res.status(500).json({ error: "Email service is not configured." });
      }

      const { data, error } = await resend.emails.send({
        from: "EarlyYearsOS <notifications@earlyyearsos.com>",
        to: [to],
        subject: subject,
        html: html,
        text: text || "Please view this email in an HTML-compatible client.",
      });

      if (error) {
        throw error;
      }

      res.json({ success: true, data });
    } catch (error: any) {
      console.error("Email Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // --- DATA EXPORT ENDPOINT ---
  app.get("/api/export-centre-data", requireAuth, async (req: any, res) => {
    try {
      if (!supabaseConfigured) {
        return res.status(503).json({ error: "Supabase is not configured." });
      }

      const { centreId } = req.query;

      if (!centreId) {
        return res.status(400).json({ error: "Missing centreId" });
      }

      // Verify the user belongs to this centre
      const { data: membership } = await supabase
        .from("centre_members")
        .select("id")
        .eq("centre_id", centreId)
        .eq("user_id", req.user.id)
        .single();
      if (!membership) return res.status(403).json({ error: "You do not have access to this centre." });

      // Fetch all data related to this centre
      const [children, staff, observations, documents, logs] = await Promise.all([
        supabase.from("children").select("*").eq("centre_id", centreId),
        supabase.from("staff").select("*").eq("centre_id", centreId),
        supabase.from("observations").select("*").eq("centre_id", centreId),
        supabase.from("documents").select("*").eq("centre_id", centreId),
        supabase.from("daily_logs").select("*").eq("centre_id", centreId),
      ]);

      const exportData = {
        centreId,
        exportedAt: new Date().toISOString(),
        children: children.data || [],
        staff: staff.data || [],
        observations: observations.data || [],
        documents: documents.data || [],
        logs: logs.data || [],
      };

      res.setHeader("Content-Type", "application/json");
      res.setHeader("Content-Disposition", `attachment; filename=centre-export-${centreId}.json`);
      res.json(exportData);
    } catch (error: any) {
      console.error("Export Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // --- STAFF PIN HASHING ENDPOINTS ---
  app.post("/api/staff/hash-pin", requireAuth, async (req: any, res) => {
    try {
      const { pin } = req.body;
      if (!pin) return res.status(400).json({ error: "PIN is required" });
      
      const salt = await bcrypt.genSalt(10);
      const hashedPin = await bcrypt.hash(pin, salt);
      
      res.json({ hashedPin });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/staff/verify-pin", requireAuth, async (req: any, res) => {
    try {
      const { pin, hashedPin } = req.body;
      if (!pin || !hashedPin) return res.status(400).json({ error: "PIN and hashedPin are required" });
      
      const isMatch = await bcrypt.compare(pin, hashedPin);
      res.json({ success: isMatch });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // --- NOTIFICATION ENDPOINT ---
  app.post("/api/notify", requireAuth, async (req: any, res) => {
    try {
      const { roomId, notification } = req.body;
      if (!roomId || !notification) return res.status(400).json({ error: "roomId and notification are required" });
      
      sendNotification(roomId, notification);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // --- SYSTEM AUDIT LOG ENDPOINT ---
  app.post("/api/audit/log", requireAuth, async (req: any, res) => {
    try {
      if (!supabaseConfigured) {
        return res.status(503).json({ error: "Supabase is not configured." });
      }

      const { userId, action, resource, details, centreId } = req.body;
      
      if (!userId || !action || !resource) {
        return res.status(400).json({ error: "Missing required audit fields" });
      }

      const { error } = await supabase.from("audit_logs").insert({
        user_id: userId,
        action,
        resource,
        details,
        centre_id: centreId,
        ip_address: req.ip,
        user_agent: req.headers["user-agent"],
        timestamp: new Date().toISOString()
      });

      if (error) throw error;

      res.json({ success: true });
    } catch (error: any) {
      console.error("Audit Log Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // --- COMPLIANCE CHECK LOGIC ---
  const runComplianceCheck = async () => {
    if (!supabaseConfigured) {
      console.log("Skipping scheduled compliance check: Supabase is not configured.");
      return;
    }

    console.log("Running scheduled compliance check...");
    try {
      // 1. Fetch all centres
      const { data: centres, error: centreError } = await supabase.from("centres").select("id, name");
      if (centreError) throw centreError;

      for (const centre of centres || []) {
        const alerts: any[] = [];
        const now = new Date();

        // 2. Fetch staff
        const { data: staff, error: staffError } = await supabase.from("staff").select("*").eq("centre_id", centre.id);
        if (!staffError && staff) {
          staff.forEach((s: any) => {
            checkExpiry(alerts, s, 'WWCC', s.wwcc_expiry, 'staff_qualification');
            checkExpiry(alerts, s, 'First Aid', s.first_aid_expiry, 'staff_qualification');
            checkExpiry(alerts, s, 'CPR', s.cpr_expiry, 'staff_qualification');
          });
        }

        // 3. Fetch children
        const { data: children, error: childError } = await supabase.from("children").select("*").eq("centre_id", centre.id);
        if (!childError && children) {
          children.forEach((c: any) => {
            checkExpiry(alerts, c, 'Immunization', c.immunization_expiry, 'child_immunization');
          });
        }

        // 4. Send notifications for alerts at 30/60 days or expired
        const pendingAlerts = alerts.filter(a => a.daysRemaining === 30 || a.daysRemaining === 60 || a.daysRemaining <= 0);
        for (const alert of pendingAlerts) {
          const message = alert.daysRemaining <= 0 
            ? `CRITICAL: ${alert.qualificationType} for ${alert.subjectName} has EXPIRED on ${alert.expiryDate}.`
            : `REMINDER: ${alert.qualificationType} for ${alert.subjectName} expires in ${alert.daysRemaining} days (${alert.expiryDate}).`;

          sendNotification(centre.id, {
            title: 'Compliance Alert',
            content: message,
            type: 'incident',
            subjectId: alert.subjectId,
            subjectType: alert.type,
            timestamp: new Date().toISOString()
          });

          // If Resend is configured, we could also send an email here
          if (process.env.RESEND_API_KEY && alert.daysRemaining <= 30) {
            // In a real app, we'd fetch the staff/parent email here
            // For now, we'll just log it or send to a test address if provided
            console.log(`Would send email to ${alert.subjectName} about ${alert.qualificationType} expiry.`);
          }
        }
      }
    } catch (error) {
      console.error("Compliance Check Error:", error);
    }
  };

  const checkExpiry = (alerts: any[], subject: any, qualType: string, expiryDate: string | undefined, type: string) => {
    if (!expiryDate) return;
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 60) {
      alerts.push({
        type,
        subjectId: subject.id,
        subjectName: subject.name,
        qualificationType: qualType,
        expiryDate,
        daysRemaining: diffDays
      });
    }
  };

  // Run compliance check every 24 hours (simulated as every hour for demo if needed, but 24h is standard)
  // For the sake of the demo, let's run it once the server is listening and then every 24 hours
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve("dist");
    const fs = await import("fs");
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath, { index: "index.html" }));
      app.use((req, res, next) => {
        if (req.method === "GET" && !req.path.startsWith("/api/")) {
          res.sendFile(path.resolve(distPath, "index.html"));
        } else {
          next();
        }
      });
    } else {
      console.warn("dist/ folder not found — running Vite in middleware mode as fallback");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    }
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    // Run compliance check once the server is listening
    runComplianceCheck();
    setInterval(runComplianceCheck, 24 * 60 * 60 * 1000);
  });
}

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

startServer();
