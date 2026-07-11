import { io, Socket } from "socket.io-client";

class NotificationService {
  private socket: Socket | null = null;
  private listeners: ((notification: any) => void)[] = [];

  connect(roomId: string) {
    if (this.socket) return;

    // Use the APP_URL provided by the platform or current window origin
    const serverUrl = window.location.origin;
    this.socket = io(serverUrl);

    this.socket.on("connect", () => {
      console.log("Connected to notification server");
      this.socket?.emit("join-room", roomId);
    });

    this.socket.on("notification", (notification: any) => {
      console.log("Received notification:", notification);
      this.listeners.forEach(listener => listener(notification));
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from notification server");
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  onNotification(callback: (notification: any) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  async sendNotification(roomId: string, notification: any) {
    try {
      const response = await fetch("/api/notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomId, notification }),
      });
      return await response.json();
    } catch (error) {
      console.error("Error sending notification:", error);
      throw error;
    }
  }
}

export const notificationService = new NotificationService();

export async function sendEmailNotification(to: string, subject: string, html: string): Promise<boolean> {
  try {
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, subject, html }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export const emailTemplates = {
  incidentReport: (childName: string, date: string, description: string, centreName: string) => ({
    subject: `[${centreName}] Incident Report — ${childName}`,
    html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#0f172a">Incident Report</h2>
      <p><strong>Child:</strong> ${childName}</p>
      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Details:</strong> ${description}</p>
      <hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0"/>
      <p style="color:#64748b;font-size:12px">This is an automated notification from ${centreName} via EarlyYearsOS.</p>
    </div>`
  }),

  dailySummary: (childName: string, date: string, items: { label: string; value: string }[], centreName: string) => ({
    subject: `[${centreName}] Daily Summary for ${childName} — ${date}`,
    html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#0f172a">${childName}'s Day</h2>
      <p style="color:#64748b">${date}</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">
        ${items.map(i => `<tr><td style="padding:8px;border-bottom:1px solid #e2e8f0;font-weight:600;color:#334155">${i.label}</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;color:#475569">${i.value}</td></tr>`).join('')}
      </table>
      <hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0"/>
      <p style="color:#64748b;font-size:12px">Sent from ${centreName} via EarlyYearsOS.</p>
    </div>`
  }),

  observationPublished: (childName: string, title: string, educatorName: string, centreName: string) => ({
    subject: `[${centreName}] New Observation — ${childName}`,
    html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#0f172a">New Learning Observation</h2>
      <p><strong>${title}</strong></p>
      <p>A new observation for <strong>${childName}</strong> has been published by ${educatorName}.</p>
      <p style="margin-top:16px"><a href="#" style="background:#4f46e5;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600">View in EarlyYearsOS</a></p>
      <hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0"/>
      <p style="color:#64748b;font-size:12px">Sent from ${centreName} via EarlyYearsOS.</p>
    </div>`
  }),
};
