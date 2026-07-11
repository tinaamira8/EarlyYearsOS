
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 
  | 'en' | 'es' | 'fr' | 'zh' | 'ar' | 'de' | 'it' | 'pt' | 'ru' | 'ja' 
  | 'ko' | 'hi' | 'bn' | 'ur' | 'id' | 'ms' | 'vi' | 'th' | 'tr' | 'nl' 
  | 'pl' | 'sv' | 'no' | 'da' | 'fi' | 'el' | 'he' | 'fa' | 'sw' | 'zu' 
  | 'af' | 'tl' | 'uk' | 'ro' | 'hu' | 'cs' | 'sk' | 'bg' | 'hr' | 'sr' 
  | 'sl' | 'et' | 'lv' | 'lt' | 'is';

interface Translations {
  [key: string]: {
    [key in Language]?: string;
  };
}

const translations: Translations = {
  dashboard: { 
    en: 'Dashboard', es: 'Tablero', fr: 'Tableau de bord', zh: '仪表板', ar: 'لوحة القيادة',
    de: 'Dashboard', it: 'Dashboard', pt: 'Painel', ru: 'Панель управления', ja: 'ダッシュボード',
    ko: '대시보드', hi: 'डैशबोर्ड', bn: 'ড্যাশবোর্ড', ur: 'ڈیش بورڈ', id: 'Dasbor',
    ms: 'Papan Pemuka', vi: 'Bảng điều khiển', th: 'แผงควบคุม', tr: 'Panel', nl: 'Dashboard',
    pl: 'Pulpit', sv: 'Instrumentpanel', no: 'Dashbord', da: 'Kontrolpanel', fi: 'Ohjauspaneeli'
  },
  inventory: { 
    en: 'Inventory', es: 'Inventario', fr: 'Inventaire', zh: '库存', ar: 'المخزون',
    de: 'Inventar', it: 'Inventario', pt: 'Inventário', ru: 'Инвентарь', ja: '在庫',
    ko: '인벤토리', hi: 'इन्वेंटरी', bn: 'ইনভেন্টরি', ur: 'انوینٹری', id: 'Inventaris',
    ms: 'Inventori', vi: 'Hàng tồn kho', th: 'สินค้าคงคลัง', tr: 'Envanter', nl: 'Inventaris',
    pl: 'Inwentarz', sv: 'Lager', no: 'Lager', da: 'Lager', fi: 'Varasto'
  },
  assetRegister: { 
    en: 'Asset Register', es: 'Registro de Activos', fr: 'Registre des actifs', zh: '资产登记', ar: 'سجل الأصول',
    de: 'Anlagenregister', it: 'Registro cespiti', pt: 'Registro de Ativos', ru: 'Реестр активов', ja: '資産台帳',
    ko: '자산 대장', hi: 'संपत्ति रजिस्टर', bn: 'সম্পদ রেজিস্টার', ur: 'اثاثہ رجسٹر', id: 'Daftar Aset',
    ms: 'Daftar Aset', vi: 'Sổ đăng ký tài sản', th: 'ทะเบียนสินทรัพย์', tr: 'Varlık Kaydı', nl: 'Activaregister',
    pl: 'Rejestr aktywów', sv: 'Tillgångsregister', no: 'Eiendelsregister', da: 'Anlægsregister', fi: 'Omaisuusrekisteri'
  },
  ccsEstimator: { 
    en: 'CCS Estimator', es: 'Estimador CCS', fr: 'Estimateur CCS', zh: 'CCS 估算器', ar: 'مقدر CCS',
    de: 'CCS-Schätzer', it: 'Stimatore CCS', pt: 'Estimador CCS', ru: 'Оценщик CCS', ja: 'CCS推定器',
    ko: 'CCS 추정기', hi: 'CCS अनुमानक', bn: 'CCS অনুমানকারী', ur: 'CCS تخمینہ لگانے والا', id: 'Estimator CCS',
    ms: 'Estimator CCS', vi: 'Công cụ ước tính CCS', th: 'เครื่องมือประมาณการ CCS', tr: 'CCS Tahmincisi', nl: 'CCS-schatter',
    pl: 'Estymator CCS', sv: 'CCS-beräknare', no: 'CCS-estimator', da: 'CCS-estimator', fi: 'CCS-arvioija'
  },
  expenseTracker: { 
    en: 'Expense Tracker', es: 'Rastreador de Gastos', fr: 'Suivi des dépenses', zh: '费用追踪器', ar: 'تتبع النفقات',
    de: 'Ausgaben-Tracker', it: 'Gestione spese', pt: 'Rastreador de Despesas', ru: 'Отслеживание расходов', ja: '経費トラッカー',
    ko: '지출 추적기', hi: 'व्यय ट्रैकर', bn: 'ব্যয় ট্র্যাকার', ur: 'اخراجات کا ٹریکر', id: 'Pelacak Pengeluaran',
    ms: 'Penjejak Perbelanjaan', vi: 'Theo dõi chi phí', th: 'เครื่องมือติดตามค่าใช้จ่าย', tr: 'Gider Takipçisi', nl: 'Uitgaven-tracker',
    pl: 'Śledzenie wydatków', sv: 'Utgiftsmätare', no: 'Utgiftssporer', da: 'Udgiftsmåler', fi: 'Kuluseuranta'
  },
  parentPortal: { 
    en: 'Parent Portal', es: 'Portal para Padres', fr: 'Portail Parent', zh: '家长门户', ar: 'بوابة الوالدين',
    de: 'Elternportal', it: 'Portale genitori', pt: 'Portal dos Pais', ru: 'Портал для родителей', ja: '保護者ポータル',
    ko: '학부모 포털', hi: 'अभिভাবক पोर्टल', bn: 'অভিভাবক পোর্টাল', ur: 'پیرنٹ پورٹل', id: 'Portal Orang Tua',
    ms: 'Portal Ibu Bapa', vi: 'Cổng thông tin phụ huynh', th: 'พอร์ทัลผู้ปกครอง', tr: 'Veli Portalı', nl: 'Ouderportaal',
    pl: 'Portal rodzica', sv: 'Föräldraportal', no: 'Foreldreportal', da: 'Forældreportal', fi: 'Vanhempien portaali'
  },
  directorOffice: { 
    en: 'Director Office', es: 'Oficina del Director', fr: 'Bureau du directeur', zh: '主任办公室', ar: 'مكتب المدير',
    de: 'Direktionsbüro', it: 'Ufficio del direttore', pt: 'Gabinete do Diretor', ru: 'Кабинет директора', ja: '園長室',
    ko: '원장실', hi: 'निदेशक कार्यालय', bn: 'পরিচালক অফিস', ur: 'ডائریکٹر آفس', id: 'Kantor Direktur',
    ms: 'Pejabat Pengarah', vi: 'Văn phòng giám đốc', th: 'ห้องทำงานผู้อำนวยการ', tr: 'Müdür Ofisi', nl: 'Directiekantoor',
    pl: 'Biuro dyrektora', sv: 'Rektors kontor', no: 'Direktørkontor', da: 'Direktørkontor', fi: 'Johtajan toimisto'
  },
  roomManager: { 
    en: 'Room Manager', es: 'Gerente de Sala', fr: 'Gestionnaire de salle', zh: '房间经理', ar: 'مدير الغرفة',
    de: 'Raummanager', it: 'Gestore sale', pt: 'Gerente de Sala', ru: 'Менеджер комнат', ja: 'ルームマネージャー',
    ko: '교실 관리자', hi: 'कक्ष प्रबंधक', bn: 'রুম ম্যানেজার', ur: 'روم মینیجر', id: 'Manajer Ruangan',
    ms: 'Pengurus Bilik', vi: 'Quản lý phòng', th: 'ผู้จัดการห้อง', tr: 'Oda Yöneticisi', nl: 'Zaalbeheerder',
    pl: 'Menedżer sali', sv: 'Rumsansvarig', no: 'Romansvarlig', da: 'Rumsansvarlig', fi: 'Huonevastaava'
  },
  staffRoster: { 
    en: 'Staff Roster', es: 'Lista de Personal', fr: 'Liste du personnel', zh: '员工花名册', ar: 'قائمة الموظفين',
    de: 'Personalplan', it: 'Turni del personale', pt: 'Escala de Funcionários', ru: 'График персонала', ja: 'スタッフ名簿',
    ko: '직원 명부', hi: 'स्टाफ रोस्टर', bn: 'স্টাফ রোস্টার', ur: 'اسٹاف روسٹر', id: 'Daftar Staf',
    ms: 'Jadual Kakitangan', vi: 'Danh sách nhân viên', th: 'บัญชีรายชื่อพนักงาน', tr: 'Personel Listesi', nl: 'Personeelsrooster',
    pl: 'Grafik personelu', sv: 'Personalschema', no: 'Personalplan', da: 'Personaleplan', fi: 'Henkilöstösuunnitelma'
  },
  incidentReports: {
    en: 'Incident Reports', es: 'Informes de Incidentes', fr: 'Rapports d\'incidents', zh: '事故报告', ar: 'تقارير الحوادث',
    de: 'Vorfallberichte', it: 'Rapporti incidenti', pt: 'Relatórios de Incidentes', ru: 'Отчеты об инцидентах', ja: '事故報告',
    ko: '사고 보고서', hi: 'घटना रिपोर्ट', id: 'Laporan Insiden', tr: 'Olay Raporları', nl: 'Incidentrapporten'
  },
  receptionKiosk: {
    en: 'Reception Kiosk', es: 'Kiosko de Recepción', fr: 'Kiosque de réception', zh: '接待亭', ar: 'كشك الاستقبال',
    de: 'Empfangskiosk', it: 'Chiosco reception', pt: 'Quiosque de Recepção', ru: 'Киоск регистрации', ja: '受付キオスク',
    ko: '리셉션 키오스크', hi: 'रिसेप्शन कियो스크', id: 'Kios Resepsionis', tr: 'Resepsiyon Köşkü', nl: 'Receptiekiosk'
  },
  routineManager: {
    en: 'Flow of the Day', es: 'Flujo del Día', fr: 'Déroulement de la journée', zh: '日间流程', ar: 'تدفق اليوم',
    de: 'Tagesablauf', it: 'Flusso della giornata', pt: 'Fluxo do Dia', ru: 'Распорядок дня', ja: '一日の流れ',
    ko: '하루 일과', hi: 'दिन का प्रवाह', id: 'Alur Hari Ini', tr: 'Gün Akışı', nl: 'Dagindeling'
  },
  operationalLog: {
    en: 'Daily Safety Checks', es: 'Controles Diarios de Seguridad', fr: 'Contrôles de sécurité quotidiens', zh: '每日安全检查', ar: 'فحوصات السلامة اليومية',
    de: 'Tägliche Sicherheitschecks', it: 'Controlli sicurezza giornalieri', pt: 'Verificações Diárias de Segurança', ru: 'Ежедневные проверки безопасности', ja: '毎日の安全点検',
    ko: '일일 안전 점검', hi: 'দैनिक सुरक्षा जाँच', id: 'Pemeriksaan Keamanan Harian', tr: 'Günlük Güvenlik Kontrolleri', nl: 'Dagelijkse veiligheidscontroles'
  },
  medicalManager: {
    en: 'Medical & Allergies', es: 'Médico y Alergias', fr: 'Médical et allergies', zh: '医疗与过敏', ar: 'الطبية والحساسية',
    de: 'Medizin & Allergien', it: 'Medicina e allergie', pt: 'Médico e Alergias', ru: 'Медицина и аллергия', ja: '医療とアレルギー',
    ko: '의료 및 알레르기', hi: 'चिकित्सा और एलर्जी', id: 'Medis & Alergi', tr: 'Tıbbi ve Alerjiler', nl: 'Medisch & allergieën'
  },
  childProtection: {
    en: 'Child Protection', es: 'Protección Infantil', fr: 'Protection de l\'enfance', zh: '儿童保护', ar: 'حماية الطفل',
    de: 'Kinderschutz', it: 'Protezione dei minori', pt: 'Proteção Infantil', ru: 'Защита детей', ja: '児童保護',
    ko: '아동 보호', hi: 'बाल संरक्षण', id: 'Perlindungan Anak', tr: 'Çocuk Koruma', nl: 'Kinderbescherming'
  },
  codeOfConduct: {
    en: 'Code of Conduct', es: 'Código de Conducta', fr: 'Code de conduite', zh: '行为准则', ar: 'مدونة قواعد السلوك',
    de: 'Verhaltenskodex', it: 'Codice di condotta', pt: 'Código de Conduta', ru: 'Кодекс поведения', ja: '行動規範',
    ko: '행동 강령', hi: 'आचार संहिता', id: 'Kode Etik', tr: 'Davranış Kuralları', nl: 'Gedragscode'
  },
  safetyCenter: {
    en: 'Headcounts & Sleep', es: 'Recuentos y Sueño', fr: 'Comptages et sommeil', zh: '人数统计与睡眠', ar: 'تعداد الرؤوس والنوم',
    de: 'Anwesenheit & Schlaf', it: 'Conteggi e sonno', pt: 'Contagens e Sono', ru: 'Учет и сон', ja: '人数確認と睡眠',
    ko: '인원 파악 및 수면', hi: 'हे드काउंट और नींद', id: 'Penghitungan & Tidur', tr: 'Sayımlar ve Uyku', nl: 'Telling & slaap'
  },
  dailyCare: {
    en: 'Care & Ratios', es: 'Cuidado y Ratios', fr: 'Soins et ratios', zh: '护理与比例', ar: 'الرعاية والنسب',
    de: 'Pflege & Betreuungsschlüssel', it: 'Cura e rapporti', pt: 'Cuidados e Rácios', ru: 'Уход и нормативы', ja: 'ケアと比率',
    ko: '돌봄 및 비율', hi: 'देखभाल और अनुपात', id: 'Perawatan & Rasio', tr: 'Bakım ve Oranlar', nl: 'Zorg & ratio\'s'
  },
  floorPlan: {
    en: 'Room Planner', es: 'Planificador de Sala', fr: 'Planificateur de salle', zh: '房间规划器', ar: 'مخطط الغرفة',
    de: 'Raumplaner', it: 'Pianificatore sale', pt: 'Planejador de Sala', ru: 'Планировщик комнат', ja: 'ルームプランナー',
    ko: '교실 플래너', hi: 'कक्ष योजनाकार', id: 'Perencana Ruangan', tr: 'Oda Planlayıcı', nl: 'Zaalplanner'
  },
  planningCycle: {
    en: 'Planning Cycle', es: 'Ciclo de Planificación', fr: 'Cycle de planification', zh: '规划周期', ar: 'دورة التخطيط',
    de: 'Planungszyklus', it: 'Ciclo di pianificazione', pt: 'Ciclo de Planejamento', ru: 'Цикл планирования', ja: '計画サイクル',
    ko: '계획 주기', hi: 'योजना चक्र', id: 'Siklus Perencanaan', tr: 'Planlama Döngüsü', nl: 'Planningscyclus'
  },
  assessmentRating: {
    en: 'A&R Evidence', es: 'Evidencia A&R', fr: 'Preuves A&R', zh: 'A&R 证据', ar: 'أدلة A&R',
    de: 'A&R-Nachweise', it: 'Prove A&R', pt: 'Evidências A&R', ru: 'Доказательства A&R', ja: 'A&Rエビデンス',
    ko: 'A&R 증거', hi: 'A&R साक्ष्य', id: 'Bukti A&R', tr: 'A&R Kanıtı', nl: 'A&R-bewijs'
  },
  activityPlanner: {
    en: 'Weekly Program', es: 'Programa Semanal', fr: 'Programme hebdomadaire', zh: '每周计划', ar: 'البرنامج الأسبوعي',
    de: 'Wochenprogramm', it: 'Programma settimanale', pt: 'Programa Semanal', ru: 'Еженедельная программа', ja: '週間プログラム',
    ko: '주간 프로그램', hi: 'साप्ताहिक कार्यक्रम', id: 'Program Mingguan', tr: 'Haftalık Program', nl: 'Weekprogramma'
  },
  activityLibrary: {
    en: 'Activity Library', es: 'Biblioteca de Actividades', fr: 'Bibliothèque d\'activités', zh: '活动库', ar: 'مكتبة الأنشطة',
    de: 'Aktivitätsbibliothek', it: 'Libreria attività', pt: 'Biblioteca de Actividades', ru: 'Библиотека активностей', ja: 'アクティビティライブラリ',
    ko: '활동 라이브러리', hi: 'गतिविधि पुस्तकालय', id: 'Perpustakaan Aktivitas', tr: 'Etkinlik Kütüphanesi', nl: 'Activiteitenbibliotheek'
  },
  schoolReadiness: {
    en: 'School Readiness', es: 'Preparación Escolar', fr: 'Preparación à l\'école', zh: '入学准备', ar: 'الاستعداد للمدرسة',
    de: 'Schulreife', it: 'Preparazione scolastica', pt: 'Prontidão Escolar', ru: 'Готовность к школе', ja: '就学準備',
    ko: '학교 준비도', hi: 'स्कूल की तैयारी', id: 'Kesiapan Sekolah', tr: 'Okula Hazırlık', nl: 'Schoolrijpheid'
  },
  observation: {
    en: 'Learning Stories', es: 'Historias de Aprendizaje', fr: 'Histoires d\'apprentissage', zh: '学习故事', ar: 'قصص التعلم',
    de: 'Lerngeschichten', it: 'Storie di apprendimento', pt: 'Histórias de Aprendizagem', ru: 'Истории обучения', ja: 'ラーニングストーリー',
    ko: '학습 이야기', hi: 'सीখনে की कहानियाँ', id: 'Cerita Belajar', tr: 'Öğrenme Hikayeleri', nl: 'Leerervaringen'
  },
  eylfReference: {
    en: 'EYLF Outcomes', es: 'Resultados EYLF', fr: 'Résultats EYLF', zh: 'EYLF 成果', ar: 'نتائج EYLF',
    de: 'EYLF-Ergebnisse', it: 'Risultati EYLF', pt: 'Resultados EYLF', ru: 'Результаты EYLF', ja: 'EYLFの成果',
    ko: 'EYLF 성과', hi: 'EYLF परिणाम', id: 'Hasil EYLF', tr: 'EYLF Sonuçları', nl: 'EYLF-resultaten'
  },
  developmentReport: {
    en: 'Dev Reports', es: 'Informes de Desarrollo', fr: 'Rapports de développement', zh: '发展报告', ar: 'تقارير التنمية',
    de: 'Entwicklungsberichte', it: 'Rapporti di sviluppo', pt: 'Relatórios de Desenvolvimento', ru: 'Отчеты о развитии', ja: '発達報告書',
    ko: '발달 보고서', hi: 'विकास रिपोर्ट', id: 'Laporan Pengembangan', tr: 'Gelişim Raporları', nl: 'Ontwikkelingsrapporten'
  },
  riskAssessment: {
    en: 'Risk Assessments', es: 'Evaluaciones de Riesgo', fr: 'Évaluations des risques', zh: '风险评估', ar: 'تقييمات المخاطر',
    de: 'Risikobewertungen', it: 'Valutazione dei rischi', pt: 'Avaliações de Risco', ru: 'Оценка рисков', ja: 'リスクアセスメント',
    ko: '위험 평가', hi: 'जोखिम मूल्यांकन', id: 'Penilaian Risiko', tr: 'Risk Değerlendirmeleri', nl: 'Risicobeoordelingen'
  },
  criticalReflection: {
    en: 'Critical Reflection', es: 'Reflexión Crítica', fr: 'Réflexion critique', zh: '批判性反思', ar: 'التفكير النقدي',
    de: 'Kritische Reflexion', it: 'Riflessione critica', pt: 'Reflexão Crítica', ru: 'Критическое осмысление', ja: 'クリティカルリフレクション',
    ko: '비판적 성찰', hi: 'महত্বपूर्ण प्रतिबिंब', id: 'Refleksi Kritis', tr: 'Eleştirel Yansıma', nl: 'Kritische reflectie'
  },
  philosophy: {
    en: 'Philosophy', es: 'Filosofía', fr: 'Philosophie', zh: '哲学', ar: 'الفلسفة',
    de: 'Philosophie', it: 'Filosofia', pt: 'Filosofia', ru: 'Философия', ja: '理念',
    ko: '철학', hi: 'दर्शन', id: 'Filosofi', tr: 'Felsefe', nl: 'Filosofie'
  },
  transitionStatements: {
    en: 'Transition Statements', es: 'Declaraciones de Transición', fr: 'Déclarations de transition', id: 'Pernyataan Transisi'
  },
  culturalAudit: {
    en: 'Cultural Audit', es: 'Auditoría Cultural', fr: 'Audit culturel', id: 'Audit Budaya'
  },
  invoicingSystem: {
    en: 'Invoicing System', es: 'Sistema de Facturación', fr: 'Système de facturation', id: 'Sistem Penagihan'
  },
  staffQualifications: {
    en: 'Staff Qualifications', es: 'Calificaciones del Personal', fr: 'Qualifications du personnel', id: 'Kualifikasi Staf'
  },
  chefStation: {
    en: 'Chef Station', es: 'Estación del Chef', fr: 'Station du chef', id: 'Stasiun Koki'
  },
  sleepTracker: {
    en: 'Sleep Tracker', es: 'Rastreador de Sueño', fr: 'Suivi du sommeil', id: 'Pelacak Tidur'
  },
  occupancyAnalytics: {
    en: 'Occupancy Analytics', es: 'Análisis de Ocupación', fr: 'Analyse d\'occupation', id: 'Analisis Okupansi'
  },
  emergencyHub: {
    en: 'Emergency Hub', es: 'Centro de Emergencias', fr: 'Centre d\'urgence', id: 'Pusat Darurat'
  },
  policyPortal: {
    en: 'Policy Portal', es: 'Portal de Políticas', fr: 'Portail des politiques', id: 'Portal Kebijakan'
  },
  healthCompliance: {
    en: 'Health Compliance', es: 'Cumplimiento de Salud', fr: 'Conformité santé', id: 'Kepatuhan Kesehatan'
  },
  maintenanceLog: {
    en: 'Maintenance Log', es: 'Registro de Mantenimiento', fr: 'Journal d\'entretien', id: 'Log Pemeliharaan'
  },
  pdPortfolio: {
    en: 'PD Portfolio', es: 'Portafolio de PD', fr: 'Portfolio de DP', id: 'Portofolio PD'
  },
  qipPlanner: {
    en: 'QIP Goals', es: 'Objetivos QIP', fr: 'Objectifs QIP', zh: 'QIP 目标', ar: 'أهداف QIP',
    de: 'QIP-Ziele', it: 'Obiettivi QIP', pt: 'Metas QIP', ru: 'Цели QIP', ja: 'QIPの目標',
    ko: 'QIP 목표', hi: 'QIP लक्ष्य', id: 'Tujuan QIP', tr: 'QIP Hedefleri', nl: 'QIP-doelen'
  },
  assistant: {
    en: 'Expert Chat', es: 'Chat de Expertos', fr: 'Chat d\'experts', zh: '专家聊天', ar: 'دردشة الخبراء',
    de: 'Experten-Chat', it: 'Chat esperti', pt: 'Chat de Especialistas', ru: 'Чат с экспертами', ja: 'エキスパートチャット',
    ko: '전문가 채팅', hi: 'विशेषज्ञ चैट', id: 'Obrolan Pakar', tr: 'Uzman Sohbeti', nl: 'Expert-chat'
  },
  legal: {
    en: 'Legal & Privacy', es: 'Legal y Privacidad', fr: 'Légal et confidentialité', zh: '法律与隐私', ar: 'القانون والخصوصية',
    de: 'Rechtliches & Datenschutz', it: 'Legale e privacy', pt: 'Legal e Privacidade', ru: 'Юридическая информация', ja: '法務とプライバシー',
    ko: '법적 고지 및 개인정보 보호', hi: 'कानूनी और गोपनीयता', id: 'Hukum & Privasi', tr: 'Yasal ve Gizlilik', nl: 'Juridisch & privacy'
  },
  logout: { 
    en: 'Log Out', es: 'Cerrar Sesión', fr: 'Se déconnecter', zh: '登出', ar: 'تسجيل الخروج',
    de: 'Abmelden', it: 'Esci', pt: 'Sair', ru: 'Выйти', ja: 'ログアウト',
    ko: '로그아웃', hi: 'লॉग आउट', bn: 'লগ আউট', ur: 'لاگ آؤٹ', id: 'Keluar',
    ms: 'Log Keluar', vi: 'Đăng xuất', th: 'ออกจากระบบ', tr: 'Çıkış Yap', nl: 'Uitloggen',
    pl: 'Wyloguj się', sv: 'Logga ut', no: 'Logg ut', da: 'Log ud', fi: 'Kirjaudu ulos'
  },
  upgradePlan: { 
    en: 'Upgrade Plan', es: 'Plan de Mejora', fr: 'Améliorer le plan', zh: '升级计划', ar: 'ترقية الخطة',
    de: 'Plan upgraden', it: 'Aggiorna piano', pt: 'Atualizar Plano', ru: 'Обновить план', ja: 'プランをアップグレード',
    ko: '요금제 업그레이드', hi: 'प्लान अपग्रेड करें', bn: 'প্ল্যান আপগ্রেড করুন', ur: 'প্ল্যান আপগ্রেড করুন', id: 'Tingkatkan Paket',
    ms: 'Naik Taraf Pelan', vi: 'Nâng cấp gói', th: 'อัปเกรดแผน', tr: 'Planı Yükselt', nl: 'Plan upgraden',
    pl: 'Ulepsz plan', sv: 'Uppgradera plan', no: 'Oppgrader plan', da: 'Opgrader plan', fi: 'Päivitä tilaus'
  },
  welcome: { 
    en: 'Welcome', es: 'Bienvenido', fr: 'Bienvenue', zh: '欢迎', ar: 'أهلاً بك',
    de: 'Willkommen', it: 'Benvenuto', pt: 'Bem-vindo', ru: 'Добро пожаловать', ja: 'ようこそ',
    ko: '환영합니다', hi: 'स्वागत है', bn: 'স্বাগতম', ur: 'خوش آمدید', id: 'Selamat Datang',
    ms: 'Selamat Datang', vi: 'Chào mừng', th: 'ยินดีต้อนรับ', tr: 'Hoş geldiniz', nl: 'Welkom',
    pl: 'Witaj', sv: 'Välkommen', no: 'Velkommen', da: 'Velkommen', fi: 'Tervetuloa'
  },
  searchPlaceholder: { 
    en: 'Search anything...', es: 'Buscar algo...', fr: 'Rechercher n\'importe quoi...', zh: '搜索任何内容...', ar: 'بحث عن أي شيء...',
    de: 'Alles suchen...', it: 'Cerca...', pt: 'Pesquisar...', ru: 'Поиск...', ja: '検索...',
    ko: '검색...', hi: 'कुछ भी खोजें...', bn: 'অনুসন্ধান করুন...', ur: 'تلاش کریں...', id: 'Cari apa saja...',
    ms: 'Cari apa-apa...', vi: 'Tìm kiếm...', th: 'ค้นหา...', tr: 'Ara...', nl: 'Zoeken...',
    pl: 'Szukaj...', sv: 'Sök...', no: 'Søk...', da: 'Søg...', fi: 'Hae...'
  },
  familyAccess: { 
    en: 'Family Access', es: 'Acceso Familiar', fr: 'Accès Famille', zh: '家庭访问', ar: 'وصول العائلة', 
    de: 'Familienzugang', it: 'Accesso famiglia', pt: 'Acesso Familiar', ru: 'Доступ для семей', ja: '家族アクセス',
    ko: '가족 액세스', hi: 'परिवार पहुंच', id: 'Akses Keluarga', tr: 'Aile Erişimi', nl: 'Familietoegang'
  },
  staffAccess: { 
    en: 'Staff Access', es: 'Acceso del Personal', fr: 'Accès Personnel', zh: '员工访问', ar: 'وصول الموظفين', 
    de: 'Personalzugang', it: 'Accesso personale', pt: 'Acesso de Funcionários', ru: 'Доступ для персонала', ja: 'スタッフアクセス',
    ko: '직원 액세스', hi: 'स्टाफ पहुंच', id: 'Akses Staf', tr: 'Personel Erişimi', nl: 'Personeelstoegang'
  },
  visitorLog: { 
    en: 'Visitor Log', es: 'Registro de Visitantes', fr: 'Registre des Visiteurs', zh: '访客记录', ar: 'سجل الزوار', 
    de: 'Besucherprotokoll', it: 'Registro visitatori', pt: 'Registro de Visitantes', ru: 'Журнал посетителей', ja: '来客記録',
    ko: '방문자 로그', hi: 'आगंतुक लॉग', id: 'Log Pengunjung', tr: 'Ziyaretçi Kaydı', nl: 'Bezoekerslogboek'
  },
  evacuationList: { 
    en: 'Evacuation List', es: 'Lista de Evacuación', fr: 'Liste d\'Évacuation', zh: '疏散名单', ar: 'قائمة الإخلاء', 
    de: 'Evakuierungsliste', it: 'Lista di evacuazione', pt: 'Lista de Evacuação', ru: 'Список эвакуации', ja: '避難リスト',
    ko: '대피 명단', hi: 'निकासी सूची', id: 'Daftar Evakuasi', tr: 'Tahliye Listesi', nl: 'Evacuatielijst'
  },
  signIn: { 
    en: 'Sign In', es: 'Registrar Entrada', fr: 'Se Connecter', zh: '签到', ar: 'تسجيل الدخول', 
    de: 'Anmelden', it: 'Entra', pt: 'Entrar', ru: 'Войти', ja: 'サインイン',
    ko: '로그인', hi: 'साइन इन', id: 'Masuk', tr: 'Giriş Yap', nl: 'Inloggen'
  },
  signOut: { 
    en: 'Sign Out', es: 'Registrar Salida', fr: 'Se Déconnecter', zh: '签退', ar: 'تسجيل الخروج', 
    de: 'Abmelden', it: 'Esci', pt: 'Sair', ru: 'Выйти', ja: 'サインアウト',
    ko: '로그아웃', hi: 'साइन आउट', id: 'Keluar', tr: 'Çıkış Yap', nl: 'Uitloggen'
  },
  selectCollector: { 
    en: 'Select Collector', es: 'Seleccionar Recolector', fr: 'Sélectionner le Collecteur', zh: '选择收集者', ar: 'اختر المستلم', 
    de: 'Abholer auswählen', it: 'Seleziona raccoglitore', pt: 'Selecionar Coletor', ru: 'Выберите сборщика', ja: 'コレクターを選択',
    ko: '수거자 선택', hi: 'कलेक्टर चुनें', id: 'Pilih Penjemput', tr: 'Toplayıcı Seç', nl: 'Verzamelaar selecteren'
  },
  securityPin: { 
    en: 'Security PIN', es: 'PIN de Seguridad', fr: 'PIN de Sécurité', zh: '安全密码', ar: 'الرمز السري', 
    de: 'Sicherheits-PIN', it: 'PIN di sicurezza', pt: 'PIN de Segurança', ru: 'ПИН-код безопасности', ja: 'セキュリティPIN',
    ko: '보안 PIN', hi: 'सुरक्षा पिन', id: 'PIN Keamanan', tr: 'Güvenlik PIN\'i', nl: 'Beveiligings-PIN'
  },
  employeeId: { 
    en: 'Employee ID', es: 'ID de Empleado', fr: 'ID Employé', zh: '员工 ID', ar: 'رقم الموظف', 
    de: 'Mitarbeiter-ID', it: 'ID dipendente', pt: 'ID do Funcionário', ru: 'ID сотрудника', ja: '従業員ID',
    ko: '직원 ID', hi: 'कर्मचारी आईडी', id: 'ID Karyawan', tr: 'Personel Kimliği', nl: 'Werknemer-ID'
  },
  evacuationMode: { 
    en: 'Evacuation Mode', es: 'Modo de Evacuación', fr: 'Mode Évacuation', zh: '疏散模式', ar: 'وضع الإخلاء', 
    de: 'Evakuierungsmodus', it: 'Modalità evacuazione', pt: 'Modo de Evacuação', ru: 'Режим эвакуации', ja: '避難モード',
    ko: '대피 모드', hi: 'निकासी मोड', id: 'Mode Evakuasi', tr: 'Tahliye Modu', nl: 'Evacuatiemodus'
  },
  printEvacList: { 
    en: 'Print Evacuation List', es: 'Imprimir Lista de Evacuación', fr: 'Imprimer la Liste d\'Évacuation', zh: '打印疏散名单', ar: 'طباعة قائمة الإخلاء', 
    de: 'Evakuierungsliste drucken', it: 'Stampa lista evacuazione', pt: 'Imprimir Lista de Evacuação', ru: 'Печать списка эвакуации', ja: '避難リストを印刷',
    ko: '대피 명단 인쇄', hi: 'निकासी सूची प्रिंट करें', id: 'Cetak Daftar Evakuasi', tr: 'Tahliye Listesini Yazdır', nl: 'Evacuatielijst afdrukken'
  },
  receptionTitle: { en: 'Reception', ar: 'الاستقبال', es: 'Recepción', fr: 'Réception', id: 'Resepsionis' },
  welcomeTo: { en: 'Welcome to', ar: 'مرحباً بك في', es: 'Bienvenido a', fr: 'Bienvenue à', id: 'Selamat datang di' },
  childAttendance: { en: 'Child Attendance', ar: 'حضور الأطفال', es: 'Asistencia Infantil', fr: 'Présence des Enfants', id: 'Kehadiran Anak' },
  childrenPresent: { en: 'Children Present', ar: 'الأطفال الحاضرون', es: 'Niños Presentes', fr: 'Enfants Présents', id: 'Anak-anak Hadir' },
  noChildrenEnrolled: { en: 'No children enrolled. Please add children in Director\'s Office.', ar: 'لا يوجد أطفال مسجلون. يرجى إضافة الأطفال في مكتب المدير.', es: 'No hay niños inscritos. Por favor, agregue niños en la Oficina del Director.', fr: 'Aucun enfant inscrit. Veuillez ajouter des enfants dans le bureau du directeur.', id: 'Tidak ada anak yang terdaftar. Silakan tambahkan anak di Kantor Direktur.' },
  tapToSignIn: { en: 'Tap to Sign In', ar: 'انقر لتسجيل الدخول', es: 'Toca para Registrar Entrada', fr: 'Appuyez pour vous Connecter', id: 'Ketuk untuk Masuk' },
  noStaffFound: { en: 'No staff members found. Add staff in Director\'s Office.', ar: 'لم يتم العثور على موظفين. أضف موظفين في مكتب المدير.', es: 'No se encontraron miembros del personal. Agregue personal en la Oficina del Director.', fr: 'Aucun membre du personnel trouvé. Ajoutez du personnel dans le bureau du directeur.', id: 'Tidak ada anggota staf yang ditemukan. Tambahkan staf di Kantor Direktur.' },
  signedInAt: { en: 'Signed In at', ar: 'تم تسجيل الدخول في', es: 'Registrado a las', fr: 'Connecté à', id: 'Masuk pada' },
  newVisitor: { en: 'New Visitor', ar: 'زائر جديد', es: 'Nuevo Visitante', fr: 'Nouveau Visiteur', id: 'Pengunjung Baru' },
  fullName: { en: 'Full Name', ar: 'الاسم الكامل', es: 'Nombre Completo', fr: 'Nom Complet', id: 'Nama Lengkap' },
  reasonForVisit: { en: 'Reason for Visit', ar: 'سبب الزيارة', es: 'Motivo de la Visita', fr: 'Motif de la Visite', id: 'Alasan Kunjungan' },
  visitorAgreement: { en: 'I confirm I have presented my WWCC/ID and agree to the Code of Conduct.', ar: 'أؤكد أنني قدمت هويتي وأوافق على مدونة قواعد السلوك.', es: 'Confirmo que he presentado mi identificación y acepto el Código de Conducta.', fr: 'Je confirme avoir présenté ma pièce d\'identité et j\'accepte le code de conduite.', id: 'Saya mengonfirmasi bahwa saya telah menunjukkan ID saya dan menyetujui Kode Etik.' },
  currentVisitors: { en: 'Current Visitors', ar: 'الزوار الحاليون', es: 'Visitantes Actuales', fr: 'Visiteurs Actuels', id: 'Pengunjung Saat Ini' },
  noVisitorsOnSite: { en: 'No visitors currently on site.', ar: 'لا يوجد زوار حالياً في الموقع.', es: 'No hay visitantes actualmente en el sitio.', fr: 'Aucun visiteur actuellement sur place.', id: 'Tidak ada pengunjung di lokasi saat ini.' },
  evacInstructions: { en: 'Use this list to account for all persons currently signed in to the premises.', ar: 'استخدم هذه القائمة لحصر جميع الأشخاص المسجلين حالياً في المبنى.', es: 'Use esta lista para contabilizar a todas las personas registradas actualmente en las instalaciones.', fr: 'Utilisez cette liste pour comptabiliser toutes les personnes actuellement connectées dans les locaux.', id: 'Gunakan daftar ini untuk mendata semua orang yang saat ini terdaftar di lokasi.' },
  name: { en: 'Name', ar: 'الاسم', es: 'Nombre', fr: 'Nom', id: 'Nama' },
  roleType: { en: 'Role / Type', ar: 'الدور / النوع', es: 'Rol / Tipo', fr: 'Rôle / Type', id: 'Peran / Tipe' },
  child: { en: 'Child', ar: 'طفل', es: 'Niño', fr: 'Enfant', id: 'Anak' },
  staff: { en: 'Staff', ar: 'موظف', es: 'Personal', fr: 'Personnel', id: 'Staf' },
  visitor: { en: 'Visitor', ar: 'زائر', es: 'Visitante', fr: 'Visiteur', id: 'Pengunjung' },
  noPersonsSignedIn: { en: 'No persons currently signed in system.', ar: 'لا يوجد أشخاص مسجلون حالياً في النظام.', es: 'No hay personas registradas actualmente en el sistema.', fr: 'Aucune personne actuellement connectée au système.', id: 'Tidak ada orang yang saat ini terdaftar di sistem.' },
  signingIn: { en: 'Signing In', ar: 'جاري تسجيل الدخول', es: 'Registrando Entrada', fr: 'Connexion en cours', id: 'Sedang Masuk' },
  signingOut: { en: 'Signing Out', ar: 'جاري تسجيل الخروج', es: 'Registrando Salida', fr: 'Déconnexion en cours', id: 'Sedang Keluar' },
  incorrectPin: { en: 'Incorrect PIN', ar: 'الرمز السري غير صحيح', es: 'PIN Incorrecto', fr: 'PIN Incorrect', id: 'PIN Salah' },
    incorrectIdOrPin: { 
      en: 'Incorrect ID or PIN', ar: 'رقم الموظف أو الرمز السري غير صحيح', es: 'ID o PIN Incorrecto', fr: 'ID ou PIN Incorrect', id: 'ID atau PIN Salah',
      de: 'Falsche ID oder PIN', it: 'ID o PIN errati', pt: 'ID ou PIN incorretos', ru: 'Неверный ID или ПИН-код', ja: 'IDまたはPINが正しくありません',
      ko: 'ID 또는 PIN이 올바르지 않습니다', hi: 'गलत आईडी या पिन', tr: 'Geçersiz Kimlik veya PIN', nl: 'Onjuiste ID of pincode'
    },
    noPinSet: {
      en: "No PIN or Employee ID set. Please set them in Director's Office.",
      es: "No se ha establecido un PIN o ID de empleado. Por favor, establézcalos en la Oficina del Director.",
      fr: "Aucun code PIN ou ID d'employé n'est défini. Veuillez les définir dans le bureau du directeur.",
      id: "PIN atau ID Karyawan tidak disetel. Silakan setel di Kantor Direktur."
    },
    updateAttendanceFailed: {
      en: "Failed to update attendance. Please check connection.",
      es: "Error al actualizar la asistencia. Por favor, compruebe la conexión.",
      fr: "Échec de la mise à jour de la présence. Veuillez vérifier la connexion.",
      id: "Gagal memperbarui kehadiran. Silakan periksa koneksi."
    },
    visitorSignInFailed: {
      en: "Failed to sign in visitor",
      es: "Error al registrar al visitante",
      fr: "Échec de l'enregistrement du visiteur",
      id: "Gagal mendaftarkan pengunjung"
    },
    visitorSignOutFailed: {
      en: "Failed to sign out visitor",
      es: "Error al registrar la salida del visitante",
      fr: "Échec de la sortie du visiteur",
      id: "Gagal mengeluarkan pengunjung"
    },
    idPlaceholder: {
      en: "ID",
      es: "ID",
      fr: "ID",
      id: "ID"
    }
  };

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string) => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
