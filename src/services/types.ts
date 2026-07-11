
export interface DbUser {
  id: string;
  name: string;
  email: string;
  centreId: string;
  centreName: string;
  centreIds?: string[]; // For Multi-centre directors
  plan: 'free' | 'educator' | 'centre';
  role: 'Admin' | 'Director' | 'Educator' | 'Parent' | 'DirectorGeneral';
  onboardingCompleted?: boolean;
}

export interface DbCentre {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  capacity: number;
  occupancy: number; // Current occupancy percentage
  revenue: number; // Monthly revenue
  complianceScore: number; // 0-100
}

export type Centre = DbCentre;

export interface DbChild {
  id: string;
  centreId: string;
  name: string;
  birthday?: string;
  roomId?: string;
  medicalCondition?: string;
  severity?: 'High' | 'Medium' | 'Low';
  allergies?: string[];
  medication?: string;
  actionPlanDate?: string;
  immunizationExpiry?: string;
  parentId?: string;
}

export interface DbWaitlist {
  id: string;
  centreId: string;
  childName: string;
  birthday: string;
  requestedStartDate: string;
  status: 'active' | 'enrolled' | 'cancelled';
  createdAt: string;
}

export interface DbRoom {
  id: string;
  centreId: string;
  name: string;
  ageGroup: string;
  capacity: number;
}

export interface DbIncident {
  id: string;
  centreId: string;
  childId: string;
  childName: string;
  date: string;
  time: string;
  location: string;
  description: string;
  actionTaken: string;
  parentNotified: boolean;
  parentSignature?: string;
  staffSignature: string;
  createdAt: string;
}

export interface DbRoster {
  id: string;
  centreId: string;
  weekStarting: string;
  data: any; // Record<staffId, Record<day, {start, end, room}>>
}

export interface DbStaff {
  id: string;
  centreId: string;
  name: string;
  role: string;
  wwcc: string;
  wwccExpiry?: string;
  firstAid: string;
  firstAidExpiry?: string;
  cpr: string;
  cprExpiry?: string;
  employeeId?: string;
  pin?: string;
}

export interface DbObservation {
  id: string;
  centreId: string;
  childId: string;
  childName: string;
  educatorId: string;
  educatorName: string;
  title: string;
  data: any;
  date: string;
  status: 'draft' | 'published';
  createdAt: string;
}

export interface DbDocument {
  id: string;
  centreId: string;
  type: 'philosophy' | 'qip' | 'risk_assessment' | 'policy' | 'newsletter' | 'program' | 'reflection' | 'report' | 'goal' | 'menu' | 'transition_statement' | 'cultural_audit' | 'risk' | 'school_readiness';
  title: string;
  data: any;
  createdAt: string;
}

export interface DbDailyLog {
  id: string;
  centreId: string;
  date: string;
  type: 'sleep_check' | 'head_count' | 'medication' | 'incident' | 'visitor' | 'attendance' | 'staff_attendance' | 'nutrition' | 'toileting' | 'sunscreen' | 'staff_status' | 'excursion' | 'excursion_update' | 'sustainability' | 'medication_update';
  data: any;
  createdAt: string;
}

export interface DbMessage {
  id: string;
  centreId: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  content: string;
  createdAt: string;
  read: boolean;
}

export interface DbNotification {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: 'learning_story' | 'incident' | 'medication' | 'general';
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface DbCommunityPost {
  id: string;
  centreId: string;
  authorId: string;
  authorName: string;
  category: 'playdate' | 'marketplace' | 'event' | 'general';
  title: string;
  content: string;
  mediaUrl?: string;
  createdAt: string;
  comments?: { id: string; authorName: string; content: string; createdAt: string }[];
}

export interface DbProfessionalMapping {
  id: string;
  centreId: string;
  staffId: string;
  sourceId: string; // ID of the observation or reflection
  sourceType: 'observation' | 'reflection';
  sourceTitle: string;
  standardIds: string[]; // e.g., ["1.1", "2.3"]
  reflections: string;
  createdAt: string;
}

export interface DbSustainabilityAudit {
  id: string;
  centreId: string;
  category: 'waste' | 'energy' | 'water' | 'biodiversity';
  metric: string; // e.g., "bins_emptied", "lights_off", "taps_checked"
  value: number;
  unit: string;
  recordedBy: string; // staff or child name
  isChildLed: boolean;
  notes?: string;
  createdAt: string;
}

export interface DbSustainabilityGoal {
  id: string;
  centreId: string;
  category: 'waste' | 'energy' | 'water' | 'biodiversity';
  title: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  status: 'active' | 'achieved' | 'missed';
}

export interface DbCurriculumBoard {
  id: string;
  centreId: string;
  roomId: string;
  roomName: string;
  weekStarting: string;
  data: any; // Record<day, Record<category, {title, desc}>>
  createdAt: string;
}

export interface DbLandingPageConfig {
  id: string;
  centreId: string;
  heroTitle: string;
  heroSubtitle: string;
  primaryColor: string;
  showCurriculum: boolean;
  featuredRooms: string[];
  slug: string;
  isActive: boolean;
  updatedAt: string;
}

export interface DbInvoice {
  id: string;
  centreId: string;
  parentId: string;
  parentName: string;
  childId?: string;
  childName?: string;
  amount: number;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  items: { description: string; amount: number }[];
  createdAt: string;
}

export interface DbEnquiry {
  id: string;
  centreId: string;
  parentName: string;
  childName: string;
  childDob: string;
  email: string;
  phone: string;
  status: 'new' | 'tour_booked' | 'waitlisted' | 'enrolled' | 'closed';
  notes?: string;
  createdAt: string;
}

export interface DbPaymentMethod {
  id: string;
  userId: string;
  type: 'card' | 'bank';
  last4: string;
  brand?: string;
  isDefault: boolean;
  createdAt: string;
}

export interface DbInventoryItem {
  id: string;
  centreId: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  unit: string;
  lastRestocked?: string;
  updatedAt: string;
}

export interface DbMenu {
  id: string;
  centreId: string;
  name: string;
  weekNumber: 1 | 2 | 3 | 4;
  data: {
    [day: string]: {
      morningTea: string;
      lunch: string;
      afternoonTea: string;
      lateSnack?: string;
    }
  };
  createdAt: string;
}

export interface DbShoppingList {
  id: string;
  centreId: string;
  menuId: string;
  items: { name: string; quantity: string; category: string; checked?: boolean }[];
  createdAt: string;
}

export interface DbSleepSession {
  id: string;
  centreId: string;
  childId: string;
  childName: string;
  startTime: string;
  endTime?: string;
  lastCheckTime: string;
  status: 'sleeping' | 'awake';
  checks: { time: string; status: string; educatorId: string }[];
  createdAt: string;
}

export interface DbEmergencyDrill {
  id: string;
  centreId: string;
  type: 'evacuation' | 'lockdown' | 'external_threat';
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  staffInvolved: string[];
  childrenInvolved: number;
  location: string;
  notes: string;
  success: boolean;
  createdAt: string;
}

export interface DbEmergencyRollCall {
  id: string;
  centreId: string;
  drillId?: string;
  timestamp: string;
  totalChildren: number;
  presentChildren: string[]; // child IDs
  missingChildren: string[]; // child IDs
  status: 'in_progress' | 'completed';
  createdAt: string;
}

export interface DbPolicy {
  id: string;
  centreId: string;
  title: string;
  category: string;
  version: string;
  status: 'active' | 'draft' | 'archived';
  lastReviewed: string;
  nextReviewDate: string;
  fileUrl?: string;
  description: string;
  createdAt: string;
}

export interface DbPolicySignOff {
  id: string;
  policyId: string;
  staffId: string;
  staffName: string;
  signedAt: string;
  version: string;
}

export interface DbHealthRecord {
  id: string;
  childId: string;
  childName: string;
  centreId: string;
  immunizationStatus: 'up_to_date' | 'pending' | 'expired';
  airStatementExpiry: string;
  medicalActionPlanType: 'asthma' | 'anaphylaxis' | 'allergy' | 'none';
  medicalActionPlanExpiry: string;
  lastReminderSent?: string;
  notes?: string;
  createdAt: string;
}

export interface DbMaintenanceRequest {
  id: string;
  centreId: string;
  title: string;
  description: string;
  location: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  reportedBy: string;
  reportedByName: string;
  assignedTo?: string;
  assignedToName?: string;
  dueDate?: string;
  completedAt?: string;
  notes?: string;
  createdAt: string;
}

export interface DbPDPortfolioEntry {
  id: string;
  staffId: string;
  staffName: string;
  centreId: string;
  title: string;
  provider?: string;
  date: string;
  hours: number;
  category: 'workshop' | 'webinar' | 'reading' | 'mentoring' | 'other';
  nqsStandards: string[];
  reflection: string;
  impactOnPractice: string;
  evidenceUrls: string[];
  status: 'draft' | 'completed' | 'reviewed';
  feedback?: string;
  createdAt: string;
}

export interface DbStaffFloat {
  id: string;
  staffId: string;
  staffName: string;
  fromCentreId: string;
  toCentreId: string;
  startDate: string;
  endDate?: string;
  reason: string;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface DbInventoryTransfer {
  id: string;
  itemId: string;
  itemName: string;
  fromCentreId: string;
  toCentreId: string;
  quantity: number;
  unit: string;
  status: 'pending' | 'shipped' | 'received' | 'cancelled';
  requestedBy: string;
  createdAt: string;
}

export interface DbEvent {
  id: string;
  centreId: string;
  title: string;
  description: string;
  date: string;
  startTime?: string;
  endTime?: string;
  category: 'excursion' | 'incursion' | 'holiday' | 'family_day' | 'other';
  location?: string;
  createdAt: string;
}

export interface DbCollector {
  id: string;
  centreId: string;
  childId: string;
  name: string;
  relationship: string;
  phone: string;
  photoUrl?: string;
  pin: string; // Hashed PIN
  permissions: string[]; // e.g. ['pickup', 'emergency_contact']
  isAuthorized: boolean;
  createdAt: string;
}

export interface DbStaffTraining {
  id: string;
  staffId: string;
  title: string;
  provider: string;
  completionDate: string;
  expiryDate?: string;
  hours: number;
  certificateUrl?: string;
  status: 'completed' | 'planned' | 'expired';
}

export interface DbAsset {
  id: string;
  centreId: string;
  name: string;
  category: 'Equipment' | 'Furniture' | 'Appliance' | 'Playground' | 'Safety';
  location: string;
  purchaseDate?: string;
  lastInspected?: string;
  nextInspection?: string;
  status: 'Functional' | 'Needs Repair' | 'Broken' | 'Under Maintenance';
}

export interface DbMaintenanceLog {
  id: string;
  assetId: string;
  centreId: string;
  date: string;
  type: 'Routine Check' | 'Repair' | 'Sanitization' | 'Safety Audit';
  description: string;
  performedBy: string;
  cost?: number;
  status: 'Completed' | 'Pending';
}

export interface DbExpense {
  id: string;
  centreId: string;
  date: string;
  category: 'Supplies' | 'Maintenance' | 'Staffing' | 'Utilities' | 'Marketing' | 'Other';
  amount: number;
  description: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  receiptUrl?: string;
}

export interface DbResource {
  id: string;
  centreId: string;
  name: string;
  type: 'Room' | 'Equipment';
  description?: string;
  capacity?: number; // For rooms
  status: 'Available' | 'Unavailable' | 'Maintenance';
}

export interface DbResourceBooking {
  id: string;
  centreId: string;
  resourceId: string;
  resourceName: string;
  staffId: string;
  staffName: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  createdAt: string;
}

export interface DbWellbeingMood {
  id: string;
  centreId: string;
  mood: 'great' | 'okay' | 'stressed' | 'overwhelmed';
  date: string;
  createdAt: string;
}

export interface DbRequiredTraining {
  id: string;
  centreId: string;
  title: string;
  description: string;
  dueDate: string;
  category: string;
  createdAt: string;
}

export interface DbStaffTrainingProgress {
  id: string;
  staffId: string;
  trainingId: string;
  status: 'pending' | 'completed';
  completedAt?: string;
  createdAt: string;
}

export interface DbCommunication {
  id: string;
  centreId: string;
  childId?: string;
  parentId?: string;
  type: 'email' | 'message' | 'incident' | 'invoice';
  subject: string;
  content: string;
  status: string;
  createdAt: string;
  metadata?: any;
}

export interface DbInclusionProfile {
  id: string;
  centreId: string;
  childId: string;
  diagnosis?: string;
  supportNeeds: string;
  fundingStatus: 'not_applied' | 'pending' | 'approved' | 'declined';
  fundingExpiry?: string;
  lastReviewDate: string;
  createdAt: string;
}

export interface DbSIP {
  id: string;
  centreId: string;
  childId: string;
  title: string;
  goals: string[];
  strategies: string[];
  reviewDate: string;
  status: 'active' | 'draft' | 'archived';
  createdAt: string;
}

export interface DbSpecialistVisit {
  id: string;
  centreId: string;
  childId: string;
  specialistName: string;
  specialistType: 'speech_pathologist' | 'occupational_therapist' | 'physiotherapist' | 'psychologist' | 'other';
  visitDate: string;
  purpose: string;
  outcomes: string;
  nextSteps: string;
  createdAt: string;
}

export interface DbChildVoice {
  id: string;
  centreId: string;
  childId: string;
  type: 'proud_moment' | 'reflection' | 'interest';
  mediaType: 'audio' | 'photo' | 'text';
  content: string;
  prompt?: string;
  date: string;
  createdAt: string;
}

import { AppView, NQSArea } from '../types';

export { AppView, NQSArea };
