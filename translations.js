// Fichier de traductions pour toutes les pages
const globalTranslations = {
  fr: {
    // Éléments communs
    dashboard: "Tableau de bord",
    projects: "Projets",
    electrification: "Électrification",
    investment: "Investissements",
    statistics: "Statistiques",
    settings: "Paramètres",
    reports: "Rapports",
    help: "Aide",
    privacy: "Confidentialité",
    terms: "Conditions d'utilisation",
    activeUsers: "UTILISATEURS ACTIFS",
    search: "Rechercher...",
    export: "Exporter",
    print: "Imprimer",
    add: "Ajouter",
    edit: "Modifier",
    delete: "Supprimer",
    view: "Voir",
    save: "Enregistrer",
    cancel: "Annuler",

    // Statuts
    active: "Actif",
    inactive: "Inactif",
    inProgress: "En cours",
    completed: "Terminé",
    planned: "Planifié",
    pending: "En attente",

    // Messages
    confirmDelete: "Êtes-vous sûr de vouloir supprimer cet élément ?",
    saved: "Enregistré avec succès",
    error: "Une erreur est survenue",

    // Paramètres
    language: "Langue",
    theme: "Thème",
    lightTheme: "Clair",
    darkTheme: "Sombre",
    region: "Région",
    currency: "Devise",

    // Projets
    projectCode: "Code",
    projectTitle: "Intitulé",
    location: "Localisation",
    type: "Type",
    startDate: "Date début",
    endDate: "Date fin",
    status: "Statut",
    actions: "Actions",

    // Électrification
    electrificationSites: "Sites d'électrification",
    totalBudget: "Budget total",
    completedProjects: "Projets terminés",
    ongoingProjects: "Projets en cours",

    // Footer
    copyright: "Tous droits réservés",
    contact: "Contact",
  },

  en: {
    // Common elements
    dashboard: "Dashboard",
    projects: "Projects",
    electrification: "Electrification",
    investment: "Investments",
    statistics: "Statistics",
    settings: "Settings",
    reports: "Reports",
    help: "Help",
    privacy: "Privacy",
    terms: "Terms of Use",
    activeUsers: "ACTIVE USERS",
    search: "Search...",
    export: "Export",
    print: "Print",
    add: "Add",
    edit: "Edit",
    delete: "Delete",
    view: "View",
    save: "Save",
    cancel: "Cancel",

    // Statuses
    active: "Active",
    inactive: "Inactive",
    inProgress: "In Progress",
    completed: "Completed",
    planned: "Planned",
    pending: "Pending",

    // Messages
    confirmDelete: "Are you sure you want to delete this item?",
    saved: "Successfully saved",
    error: "An error occurred",

    // Settings
    language: "Language",
    theme: "Theme",
    lightTheme: "Light",
    darkTheme: "Dark",
    region: "Region",
    currency: "Currency",

    // Projects
    projectCode: "Code",
    projectTitle: "Title",
    location: "Location",
    type: "Type",
    startDate: "Start Date",
    endDate: "End Date",
    status: "Status",
    actions: "Actions",

    // Electrification
    electrificationSites: "Electrification Sites",
    totalBudget: "Total Budget",
    completedProjects: "Completed Projects",
    ongoingProjects: "Ongoing Projects",

    // Footer
    copyright: "All rights reserved",
    contact: "Contact",
  },

  ar: {
    // العناصر المشتركة
    dashboard: "لوحة التحكم",
    projects: "المشاريع",
    electrification: "الكهربة",
    investment: "الاستثمارات",
    statistics: "الإحصائيات",
    settings: "الإعدادات",
    reports: "التقارير",
    help: "المساعدة",
    privacy: "الخصوصية",
    terms: "شروط الاستخدام",
    activeUsers: "المستخدمون النشطون",
    search: "بحث...",
    export: "تصدير",
    print: "طباعة",
    add: "إضافة",
    edit: "تعديل",
    delete: "حذف",
    view: "عرض",
    save: "حفظ",
    cancel: "إلغاء",

    // الحالات
    active: "نشط",
    inactive: "غير نشط",
    inProgress: "قيد التنفيذ",
    completed: "مكتمل",
    planned: "مخطط",
    pending: "قيد الانتظار",

    // الرسائل
    confirmDelete: "هل أنت متأكد من رغبتك في حذف هذا العنصر؟",
    saved: "تم الحفظ بنجاح",
    error: "حدث خطأ",

    // الإعدادات
    language: "اللغة",
    theme: "المظهر",
    lightTheme: "فاتح",
    darkTheme: "داكن",
    region: "المنطقة",
    currency: "العملة",

    // المشاريع
    projectCode: "الرمز",
    projectTitle: "العنوان",
    location: "الموقع",
    type: "النوع",
    startDate: "تاريخ البدء",
    endDate: "تاريخ الانتهاء",
    status: "الحالة",
    actions: "الإجراءات",

    // الكهربة
    electrificationSites: "مواقع الكهربة",
    totalBudget: "الميزانية الإجمالية",
    completedProjects: "المشاريع المكتملة",
    ongoingProjects: "المشاريع الجارية",

    // التذييل
    copyright: "جميع الحقوق محفوظة",
    contact: "اتصل بنا",
  },
}

// Exporter les traductions pour une utilisation dans d'autres fichiers
if (typeof module !== "undefined" && module.exports) {
  module.exports = globalTranslations
}
