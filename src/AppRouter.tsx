
import React, { lazy, Suspense } from 'react';
import { AppView, NQSArea, DbUser } from './services/types';
import { Loader2 } from 'lucide-react';

// Lazy loaded components
const Dashboard = lazy(() => import('./components/Dashboard').then(m => ({ default: m.Dashboard })));
const NQSOverview = lazy(() => import('./components/NQSOverview').then(m => ({ default: m.NQSOverview })));
const GoalPlanner = lazy(() => import('./components/GoalPlanner').then(m => ({ default: m.GoalPlanner })));
const ExpertChat = lazy(() => import('./components/ExpertChat').then(m => ({ default: m.ExpertChat })));
const MediaStudio = lazy(() => import('./components/MediaStudio').then(m => ({ default: m.MediaStudio })));
const ObservationWriter = lazy(() => import('./components/ObservationWriter').then(m => ({ default: m.ObservationWriter })));
const NewsletterGen = lazy(() => import('./components/NewsletterGen').then(m => ({ default: m.NewsletterGen })));
const RiskAssessment = lazy(() => import('./components/RiskAssessment').then(m => ({ default: m.RiskAssessment })));
const ActivityPlanner = lazy(() => import('./components/ActivityPlanner').then(m => ({ default: m.ActivityPlanner })));
const ActivityLibrary = lazy(() => import('./components/ActivityLibrary').then(m => ({ default: m.ActivityLibrary })));
const MontessoriCurriculum = lazy(() => import('./components/MontessoriCurriculum').then(m => ({ default: m.MontessoriCurriculum })));
const TermsOfService = lazy(() => import('./components/TermsOfService').then(m => ({ default: m.TermsOfService })));
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy').then(m => ({ default: m.PrivacyPolicy })));
const DevelopmentReport = lazy(() => import('./components/DevelopmentReport').then(m => ({ default: m.DevelopmentReport })));
const CriticalReflection = lazy(() => import('./components/CriticalReflection').then(m => ({ default: m.CriticalReflection })));
const PhilosophyBuilder = lazy(() => import('./components/PhilosophyBuilder').then(m => ({ default: m.PhilosophyBuilder })));
const PlanningCycle = lazy(() => import('./components/PlanningCycle').then(m => ({ default: m.PlanningCycle })));
const EYLFReference = lazy(() => import('./components/EYLFReference').then(m => ({ default: m.EYLFReference })));
const SchoolReadiness = lazy(() => import('./components/SchoolReadiness').then(m => ({ default: m.SchoolReadiness })));
const RoutineManager = lazy(() => import('./components/RoutineManager').then(m => ({ default: m.RoutineManager })));
const AssessmentRating = lazy(() => import('./components/AssessmentRating').then(m => ({ default: m.AssessmentRating })));
const FloorPlan = lazy(() => import('./components/FloorPlan').then(m => ({ default: m.FloorPlan })));
const SafetyCenter = lazy(() => import('./components/SafetyCenter').then(m => ({ default: m.SafetyCenter })));
const DailyCare = lazy(() => import('./components/DailyCare').then(m => ({ default: m.DailyCare })));
const ChildProtection = lazy(() => import('./components/ChildProtection').then(m => ({ default: m.ChildProtection })));
const CodeOfConduct = lazy(() => import('./components/CodeOfConduct').then(m => ({ default: m.CodeOfConduct })));
const MedicalManager = lazy(() => import('./components/MedicalManager').then(m => ({ default: m.MedicalManager })));
const OperationalLog = lazy(() => import('./components/OperationalLog').then(m => ({ default: m.OperationalLog })));
const DirectorOffice = lazy(() => import('./components/DirectorOffice').then(m => ({ default: m.DirectorOffice })));
const IncidentReports = lazy(() => import('./components/IncidentReports').then(m => ({ default: m.IncidentReports })));
const RoomManager = lazy(() => import('./components/RoomManager').then(m => ({ default: m.RoomManager })));
const StaffRoster = lazy(() => import('./components/StaffRoster').then(m => ({ default: m.StaffRoster })));
const ExcursionManager = lazy(() => import('./components/ExcursionManager').then(m => ({ default: m.ExcursionManager })));
const SustainabilityTracker = lazy(() => import('./components/SustainabilityTracker').then(m => ({ default: m.SustainabilityTracker })));
const MedicationLog = lazy(() => import('./components/MedicationLog').then(m => ({ default: m.MedicationLog })));
const ParentPortal = lazy(() => import('./components/ParentPortal').then(m => ({ default: m.ParentPortal })));
const InventoryManager = lazy(() => import('./components/InventoryManager').then(m => ({ default: m.InventoryManager })));
const AssetRegister = lazy(() => import('./components/AssetRegister').then(m => ({ default: m.AssetRegister })));
const CCSEstimator = lazy(() => import('./components/CCSEstimator').then(m => ({ default: m.CCSEstimator })));
const ExpenseTracker = lazy(() => import('./components/ExpenseTracker').then(m => ({ default: m.ExpenseTracker })));
const ReceptionKiosk = lazy(() => import('./components/ReceptionKiosk').then(m => ({ default: m.ReceptionKiosk })));
const SubscriptionPage = lazy(() => import('./components/SubscriptionPage').then(m => ({ default: m.SubscriptionPage })));
const RequireSubscription = lazy(() => import('./components/RequireSubscription').then(m => ({ default: m.RequireSubscription })));
const TransitionStatements = lazy(() => import('./components/TransitionStatements').then(m => ({ default: m.TransitionStatements })));
const CulturalAudit = lazy(() => import('./components/CulturalAudit').then(m => ({ default: m.CulturalAudit })));
const InvoicingSystem = lazy(() => import('./components/InvoicingSystem').then(m => ({ default: m.InvoicingSystem })));
const StaffQualifications = lazy(() => import('./components/StaffQualifications').then(m => ({ default: m.StaffQualifications })));
const ChefStation = lazy(() => import('./components/ChefStation').then(m => ({ default: m.ChefStation })));
const SleepTracker = lazy(() => import('./components/SleepTracker').then(m => ({ default: m.SleepTracker })));
const OccupancyAnalytics = lazy(() => import('./components/OccupancyAnalytics').then(m => ({ default: m.OccupancyAnalytics })));
const WaitlistManager = lazy(() => import('./components/WaitlistManager').then(m => ({ default: m.WaitlistManager })));
const EmergencyHub = lazy(() => import('./components/EmergencyHub').then(m => ({ default: m.EmergencyHub })));
const PolicyPortal = lazy(() => import('./components/PolicyPortal').then(m => ({ default: m.PolicyPortal })));
const HealthCompliance = lazy(() => import('./components/HealthCompliance').then(m => ({ default: m.HealthCompliance })));
const MaintenanceLog = lazy(() => import('./components/MaintenanceLog').then(m => ({ default: m.MaintenanceLog })));
const PDPortfolio = lazy(() => import('./components/PDPortfolio').then(m => ({ default: m.PDPortfolio })));
const CurriculumBoard = lazy(() => import('./components/CurriculumBoard').then(m => ({ default: m.CurriculumBoard })));
const ParentMessages = lazy(() => import('./components/ParentMessages').then(m => ({ default: m.ParentMessages })));
const StaffOnboarding = lazy(() => import('./components/StaffOnboarding').then(m => ({ default: m.StaffOnboarding })));
const DirectorGeneralDashboard = lazy(() => import('./components/DirectorGeneralDashboard').then(m => ({ default: m.DirectorGeneralDashboard })));
const ComplianceAlerts = lazy(() => import('./components/ComplianceAlerts').then(m => ({ default: m.ComplianceAlerts })));
const ResourceBooking = lazy(() => import('./components/ResourceBooking').then(m => ({ default: m.ResourceBooking })));
const WellbeingTrends = lazy(() => import('./components/WellbeingTrends').then(m => ({ default: m.WellbeingTrends })));
const RequiredTraining = lazy(() => import('./components/RequiredTraining').then(m => ({ default: m.RequiredTraining })));
const FamilyAuditLog = lazy(() => import('./components/FamilyAuditLog').then(m => ({ default: m.FamilyAuditLog })));
const InclusionSupport = lazy(() => import('./components/InclusionSupport').then(m => ({ default: m.InclusionSupport })));
const ChildPortfolio = lazy(() => import('./components/ChildPortfolio').then(m => ({ default: m.ChildPortfolio })));
const CommunityHub = lazy(() => import('./components/CommunityHub').then(m => ({ default: m.CommunityHub })));
const ProfessionalStandardsMapping = lazy(() => import('./components/ProfessionalStandardsMapping').then(m => ({ default: m.ProfessionalStandardsMapping })));
const GreenAudit = lazy(() => import('./components/GreenAudit').then(m => ({ default: m.GreenAudit })));
const MarketingStudio = lazy(() => import('./components/MarketingStudio').then(m => ({ default: m.MarketingStudio })));
const UserSettings = lazy(() => import('./components/UserSettings').then(m => ({ default: m.UserSettings })));
const SystemAuditLog = lazy(() => import('./components/SystemAuditLog').then(m => ({ default: m.SystemAuditLog })));
const LegalCompliance = lazy(() => import('./components/LegalCompliance').then(m => ({ default: m.LegalCompliance })));
const EnrolmentManager = lazy(() => import('./components/EnrolmentManager').then(m => ({ default: m.EnrolmentManager })));
const DigitalJournal = lazy(() => import('./components/DigitalJournal').then(m => ({ default: m.DigitalJournal })));
const OccupancyDashboard = lazy(() => import('./components/OccupancyDashboard').then(m => ({ default: m.OccupancyDashboard })));
const RevenueForecasting = lazy(() => import('./components/RevenueForecasting').then(m => ({ default: m.RevenueForecasting })));
const WalkthroughChecklist = lazy(() => import('./components/WalkthroughChecklist').then(m => ({ default: m.WalkthroughChecklist })));
const StaffTimesheet = lazy(() => import('./components/StaffTimesheet').then(m => ({ default: m.StaffTimesheet })));

interface AppRouterProps {
  currentView: AppView;
  user: DbUser | null;
  navigateTo: (view: AppView) => void;
  navigateToPlan: (area: NQSArea) => void;
  selectedAreaForPlan?: NQSArea;
}

export const AppRouter: React.FC<AppRouterProps> = ({ 
  currentView, 
  user, 
  navigateTo, 
  navigateToPlan, 
  selectedAreaForPlan 
}) => {
  const renderContent = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard onNavigate={navigateTo} user={user} />;
      case AppView.OBSERVATION:
        return <ObservationWriter user={user} />;
      case AppView.NEWSLETTER:
        return (
          <RequireSubscription user={user} onUpgrade={() => navigateTo(AppView.SUBSCRIPTION)} title="Newsletter Generator" description="Create professional newsletters with AI assistance.">
            <NewsletterGen />
          </RequireSubscription>
        );
      case AppView.COMPLIANCE:
      case AppView.NQS_OVERVIEW:
        return <NQSOverview onSelectArea={navigateToPlan} />;
      case AppView.QIP_PLANNER:
        return (
          <RequireSubscription user={user} onUpgrade={() => navigateTo(AppView.SUBSCRIPTION)} title="QIP Goal Planner" description="Manage your Quality Improvement Plan with AI-driven goals.">
            <GoalPlanner initialArea={selectedAreaForPlan} />
          </RequireSubscription>
        );
      case AppView.ASSISTANT:
        return (
          <RequireSubscription user={user} onUpgrade={() => navigateTo(AppView.SUBSCRIPTION)} title="Expert AI Assistant" description="Get instant answers to regulation and compliance questions.">
            <ExpertChat />
          </RequireSubscription>
        );
      case AppView.STUDIO:
        return (
          <RequireSubscription user={user} onUpgrade={() => navigateTo(AppView.SUBSCRIPTION)} title="Media Studio" description="Edit and enhance documentation photos with AI tools.">
            <MediaStudio />
          </RequireSubscription>
        );
      case AppView.RISK_ASSESSMENT:
        return (
          <RequireSubscription user={user} onUpgrade={() => navigateTo(AppView.SUBSCRIPTION)} title="Risk Assessment Tool" description="Generate comprehensive risk assessments instantly.">
            <RiskAssessment />
          </RequireSubscription>
        );
      case AppView.ACTIVITY_PLANNER:
        return <ActivityPlanner />;
      case AppView.ACTIVITY_LIBRARY:
        return <ActivityLibrary />;
      case AppView.DEVELOPMENT_REPORT:
        return <DevelopmentReport />;
      case AppView.CRITICAL_REFLECTION:
        return <CriticalReflection />;
      case AppView.PHILOSOPHY:
        return <PhilosophyBuilder />;
      case AppView.PLANNING_CYCLE:
        return <PlanningCycle />;
      case AppView.EYLF_REFERENCE:
        return <EYLFReference />;
      case AppView.SCHOOL_READINESS:
        return <SchoolReadiness />;
      case AppView.ROUTINE_MANAGER:
        return <RoutineManager />;
      case AppView.ASSESSMENT_RATING:
        return <AssessmentRating />;
      case AppView.FLOOR_PLAN:
        return <FloorPlan />;
      case AppView.SAFETY_CENTER:
        return <SafetyCenter />;
      case AppView.DAILY_CARE:
        return <DailyCare />;
      case AppView.CHILD_PROTECTION:
        return <ChildProtection />;
      case AppView.CODE_OF_CONDUCT:
        return <CodeOfConduct />;
      case AppView.MEDICAL_MANAGER:
        return <MedicalManager />;
      case AppView.MEDICATION_LOG:
        return <MedicationLog />;
      case AppView.EXCURSION_MANAGER:
        return <ExcursionManager />;
      case AppView.SUSTAINABILITY_TRACKER:
        return <SustainabilityTracker />;
      case AppView.OPERATIONAL_LOG:
        return <OperationalLog />;
      case AppView.INCIDENT_REPORTS:
        return <IncidentReports />;
      case AppView.ROOM_MANAGER:
        return <RoomManager user={user} />;
      case AppView.STAFF_ROSTER:
        return <StaffRoster user={user} />;
      case AppView.DIRECTOR_OFFICE:
        return <DirectorOffice user={user} />;
      case AppView.RECEPTION:
        return <ReceptionKiosk />;
      case AppView.SUBSCRIPTION:
        return <SubscriptionPage />;
      case AppView.LEGAL:
        return <LegalCompliance />;
      case AppView.PARENT_PORTAL:
        return <ParentPortal user={user} />;
      case AppView.INVENTORY:
        return <InventoryManager />;
      case AppView.ASSET_REGISTER:
        return <AssetRegister />;
      case AppView.CCS_ESTIMATOR:
        return <CCSEstimator />;
      case AppView.EXPENSE_TRACKER:
        return <ExpenseTracker />;
      case AppView.TRANSITION_STATEMENTS:
        return <TransitionStatements />;
      case AppView.CULTURAL_AUDIT:
        return <CulturalAudit />;
      case AppView.INVOICING_SYSTEM:
        return <InvoicingSystem />;
      case AppView.STAFF_QUALIFICATIONS:
        return <StaffQualifications />;
      case AppView.CHEF_STATION:
        return <ChefStation user={user} />;
      case AppView.SLEEP_TRACKER:
        return <SleepTracker />;
      case AppView.OCCUPANCY_ANALYTICS:
        return <OccupancyAnalytics />;
      case AppView.WAITLIST_MANAGER:
        return <WaitlistManager />;
      case AppView.EMERGENCY_HUB:
        return <EmergencyHub />;
      case AppView.POLICY_PORTAL:
        return <PolicyPortal />;
      case AppView.HEALTH_COMPLIANCE:
        return <HealthCompliance />;
      case AppView.MAINTENANCE_LOG:
        return <MaintenanceLog />;
      case AppView.PD_PORTFOLIO:
        return <PDPortfolio />;
      case AppView.CURRICULUM_BOARD:
        return <CurriculumBoard />;
      case AppView.PARENT_MESSAGES:
        return <ParentMessages />;
      case AppView.STAFF_ONBOARDING:
        return <StaffOnboarding />;
      case AppView.DIRECTOR_GENERAL_DASHBOARD:
        return <DirectorGeneralDashboard />;
      case AppView.COMPLIANCE_ALERTS:
        return <ComplianceAlerts />;
      case AppView.RESOURCE_BOOKING:
        return <ResourceBooking />;
      case AppView.WELLBEING_TRENDS:
        return <WellbeingTrends />;
      case AppView.REQUIRED_TRAINING:
        return <RequiredTraining />;
      case AppView.FAMILY_AUDIT_LOG:
        return <FamilyAuditLog user={user} onBack={() => navigateTo(AppView.DIRECTOR_OFFICE)} />;
      case AppView.INCLUSION_SUPPORT:
        return <InclusionSupport />;
      case AppView.CHILD_PORTFOLIO:
        return <ChildPortfolio />;
      case AppView.COMMUNITY_HUB:
        return <CommunityHub />;
      case AppView.PROFESSIONAL_STANDARDS:
        return <ProfessionalStandardsMapping />;
      case AppView.GREEN_AUDIT:
        return <GreenAudit />;
      case AppView.MARKETING_STUDIO:
        return <MarketingStudio />;
      case AppView.USER_SETTINGS:
        return <UserSettings />;
      case AppView.SYSTEM_AUDIT_LOG:
        return <SystemAuditLog />;
      case AppView.ENROLMENT_MANAGER:
        return <EnrolmentManager />;
      case AppView.DIGITAL_JOURNAL:
        return <DigitalJournal />;
      case AppView.OCCUPANCY_DASHBOARD:
        return <OccupancyDashboard />;
      case AppView.REVENUE_FORECASTING:
        return <RevenueForecasting />;
      case AppView.WALKTHROUGH_CHECKLIST:
        return <WalkthroughChecklist />;
      case AppView.MONTESSORI_CURRICULUM:
        return <MontessoriCurriculum />;
      case AppView.TERMS_OF_SERVICE:
        return <TermsOfService />;
      case AppView.PRIVACY_POLICY:
        return <PrivacyPolicy />;
      case AppView.STAFF_TIMESHEET:
        return <StaffTimesheet user={user} />;
      default:
        return <Dashboard onNavigate={navigateTo} user={user} />;
    }
  };

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-platinum dark:bg-slate-950">
        <Loader2 className="w-8 h-8 animate-spin text-brand-azure" />
      </div>
    }>
      {renderContent()}
    </Suspense>
  );
};
