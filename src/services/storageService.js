// Servicio unificado de persistencia en localStorage para la plataforma de tesis

export const USER_ROLES = {
  ESTUDIANTE: 'estudiante',
  TUTOR: 'tutor',
  JURADO: 'jurado',
  ADMIN: 'admin', // Unidad de Culminación de Estudios
};

export const PROJECT_STATUS = {
  BORRADOR: 'borrador',
  EN_REVISION_TUTOR: 'en_revision_tutor',
  CON_OBSERVACIONES: 'con_observaciones',
  APROBADO_TUTOR: 'aprobado_tutor',
  EN_EVALUACION_JURADO: 'en_evaluacion_jurado',
  APROBADO_DEFENSA: 'aprobado_defensa',
  AUTORIZADO: 'autorizado',
  PUBLICADO: 'publicado',
};

export const INITIAL_USERS = [
  {
    id: 'usr_est_1',
    name: 'Carlos Mendoza & Ana Silva',
    email: 'carlos.mendoza@est.universidad.edu',
    role: USER_ROLES.ESTUDIANTE,
    career: 'Ingeniería de Sistemas',
    projectId: 'proj_1',
  },
  {
    id: 'usr_tut_1',
    name: 'Dr. Roberto Gómez Lozano',
    email: 'roberto.gomez@prof.universidad.edu',
    role: USER_ROLES.TUTOR,
    specialty: 'Inteligencia Artificial y Redes',
  },
  {
    id: 'usr_jur_1',
    name: 'Mgtr. Elena Valenzuela',
    email: 'elena.valenzuela@prof.universidad.edu',
    role: USER_ROLES.JURADO,
    specialty: 'Metodología y Software',
  },
  {
    id: 'usr_adm_1',
    name: 'Dra. Patricia Alarcón',
    email: 'culminacion.estudios@universidad.edu',
    role: USER_ROLES.ADMIN,
    department: 'Unidad de Culminación de Estudios',
  },
];

export const INITIAL_PROJECTS = [
  {
    id: 'proj_1',
    title: 'Sistema Automatizado de Control de Inventario con IoT en Almacenes Centrales',
    authors: ['Carlos Mendoza', 'Ana Silva'],
    authorEmail: 'carlos.mendoza@est.universidad.edu',
    career: 'Ingeniería de Sistemas',
    year: '2026',
    tutorId: 'usr_tut_1',
    tutorName: 'Dr. Roberto Gómez Lozano',
    jurados: ['Mgtr. Elena Valenzuela', 'Dr. Manuel Rivas', 'Ing. Sofía Duarte'],
    status: PROJECT_STATUS.CON_OBSERVACIONES,
    similarityScore: 11, // % Turnitin
    lineOfResearch: 'Internet de las Cosas y Automatización',
    abstract: 'Investigación orientada a minimizar pérdidas y desabastecimiento de materias primas mediante microcontroladores ESP32 y sensores RFID sincronizados a una nube central.',
    currentVersion: 'v1.1',
    createdAt: '2026-09-15',
    updatedAt: '2026-11-10',
  },
  {
    id: 'proj_2',
    title: 'Plataforma de Diagnóstico Asistido por Visión Artificial para Detección de Afecciones Pulmonares',
    authors: ['Laura Pérez Villalba'],
    authorEmail: 'laura.perez@est.universidad.edu',
    career: 'Ingeniería Biomédica',
    year: '2026',
    tutorId: 'usr_tut_1',
    tutorName: 'Dr. Roberto Gómez Lozano',
    jurados: ['Mgtr. Elena Valenzuela', 'Dr. Alberto Cisneros'],
    status: PROJECT_STATUS.EN_EVALUACION_JURADO,
    similarityScore: 8,
    lineOfResearch: 'Bioinformática y Deep Learning',
    abstract: 'Modelo convolucional para clasificación de radiografías de tórax con un 94.6% de precisión validado por especialistas clínicos.',
    currentVersion: 'v2.0',
    createdAt: '2026-08-01',
    updatedAt: '2026-11-05',
  },
  {
    id: 'proj_3',
    title: 'Optimización de Rutas de Recolección de Residuos Urbanos utilizando Algoritmos Genéticos',
    authors: ['David Ramírez Castillo'],
    authorEmail: 'david.ramirez@est.universidad.edu',
    career: 'Ingeniería Industrial',
    year: '2026',
    tutorId: 'usr_tut_1',
    tutorName: 'Dr. Roberto Gómez Lozano',
    jurados: ['Mgtr. Elena Valenzuela', 'Ing. Sofía Duarte'],
    status: PROJECT_STATUS.APROBADO_DEFENSA,
    similarityScore: 6,
    lineOfResearch: 'Investigación de Operaciones',
    abstract: 'Diseño heurístico para reducción del 22% de consumo de combustible en flotas municipales mediante modelado geoespacial.',
    currentVersion: 'v3.0',
    createdAt: '2026-07-10',
    updatedAt: '2026-11-12',
  },
  {
    id: 'proj_4',
    title: 'Análisis de Vulnerabilidades y Protocolos de Ciberseguridad en Arquitecturas Cloud Bancarias',
    authors: ['Jorge Delgado Méndez', 'Valeria Cárdenas'],
    authorEmail: 'jorge.delgado@alumni.universidad.edu',
    career: 'Ingeniería de Sistemas',
    year: '2025',
    tutorId: 'usr_tut_1',
    tutorName: 'Dr. Roberto Gómez Lozano',
    jurados: ['Mgtr. Elena Valenzuela', 'Dr. Manuel Rivas'],
    status: PROJECT_STATUS.PUBLICADO,
    similarityScore: 5,
    lineOfResearch: 'Seguridad de la Información',
    abstract: 'Evaluación técnica de configuraciones de seguridad en AWS y Azure bajo normativas PCI-DSS e ISO 27001.',
    currentVersion: 'vFinal',
    createdAt: '2025-03-01',
    updatedAt: '2025-11-20',
    defenseDate: '2025-12-15',
    grade: 'Aprobado con Mención de Honor (98/100)',
  },
];

export const INITIAL_VERSIONS = [
  {
    id: 'ver_1_1',
    projectId: 'proj_1',
    versionNumber: 'v1.0',
    uploadedAt: '2026-10-15 14:30',
    uploadedBy: 'Carlos Mendoza',
    fileName: 'Borrador_Capitulos_1_al_3_Mendoza_Silva.pdf',
    fileSize: '4.2 MB',
    changelog: 'Primera entrega completa de Marco Teórico, Metodología y Levantamiento de Requerimientos.',
    similarityScore: 14,
    status: 'revisado',
  },
  {
    id: 'ver_1_2',
    projectId: 'proj_1',
    versionNumber: 'v1.1',
    uploadedAt: '2026-11-08 18:20',
    uploadedBy: 'Ana Silva',
    fileName: 'Borrador_v1.1_Corregido_APA_InventarioIoT.pdf',
    fileSize: '4.8 MB',
    changelog: 'Ajuste de citas bibliográficas según APA 7ma ed., diagramas UML actualizados y reducción de similitud.',
    similarityScore: 11,
    status: 'en_revision',
  },
];

export const INITIAL_FEEDBACK = [
  {
    id: 'fb_1',
    projectId: 'proj_1',
    versionId: 'ver_1_2',
    author: 'Dr. Roberto Gómez Lozano',
    authorRole: USER_ROLES.TUTOR,
    page: 24,
    category: 'APA / Formato',
    severity: 'media', // 'baja', 'media', 'alta'
    comment: 'En la sección 3.2, las citas textuales de más de 40 palabras deben ir en bloque sangrado sin comillas conforme a APA 7ma edición.',
    status: 'pendiente', // 'pendiente', 'subsanada'
    studentResponse: '',
    createdAt: '2026-11-09 10:15',
  },
  {
    id: 'fb_2',
    projectId: 'proj_1',
    versionId: 'ver_1_2',
    author: 'Dr. Roberto Gómez Lozano',
    authorRole: USER_ROLES.TUTOR,
    page: 41,
    category: 'Metodología / Fondo',
    severity: 'alta',
    comment: 'Falta especificar el tamaño de la muestra de almacenes y la fórmula estadística empleada para validar el nivel de confianza del 95%.',
    status: 'subsanada',
    studentResponse: 'Se incorporó la fórmula de población finita y tabla de variables de muestreo en el anexo B y pág. 42.',
    createdAt: '2026-11-09 10:45',
  },
  {
    id: 'fb_3',
    projectId: 'proj_1',
    versionId: 'ver_1_2',
    author: 'Dr. Roberto Gómez Lozano',
    authorRole: USER_ROLES.TUTOR,
    page: 65,
    category: 'Control de Similitud',
    severity: 'baja',
    comment: 'El marco regulatorio muestra 3 párrafos idénticos a la norma ISO 9001. Parafrasear para reducir el índice de coincidencia.',
    status: 'pendiente',
    studentResponse: '',
    createdAt: '2026-11-09 11:20',
  },
];

export const INITIAL_AUTHORIZATIONS = [
  {
    id: 'auth_3',
    projectId: 'proj_3',
    code: 'ACTA-UCE-2026-089',
    authorizedAt: '2026-11-13',
    coordinator: 'Dra. Patricia Alarcón',
    defenseTentativeDate: '2026-11-28',
    defensePlace: 'Auditorio Central / Salón B-201',
    status: 'Habilitado para Defensa',
    digitalSealHash: '7f9a8b1c4e2d3f4a5b6c7d8e9f0a1b2c',
  },
];

// Helper functions para el almacenamiento seguro
function getFromStorage(key, defaultVal) {
  if (typeof window === 'undefined') return defaultVal;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultVal;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultVal;
  }
}

function setToStorage(key, value) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
}

export const StorageService = {
  // Inicialización con datos de prueba si no existen
  init() {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem('tesis_initialized')) {
      this.resetDatabase();
    }
  },

  resetDatabase() {
    setToStorage('tesis_users', INITIAL_USERS);
    setToStorage('tesis_projects', INITIAL_PROJECTS);
    setToStorage('tesis_versions', INITIAL_VERSIONS);
    setToStorage('tesis_feedback', INITIAL_FEEDBACK);
    setToStorage('tesis_authorizations', INITIAL_AUTHORIZATIONS);
    setToStorage('tesis_current_user', INITIAL_USERS[0]); // Por defecto: Estudiante
    localStorage.setItem('tesis_initialized', 'true');
  },

  // Gestión de Usuarios y Sesión
  getCurrentUser() {
    return getFromStorage('tesis_current_user', INITIAL_USERS[0]);
  },

  setCurrentUser(user) {
    setToStorage('tesis_current_user', user);
  },

  getUsers() {
    return getFromStorage('tesis_users', INITIAL_USERS);
  },

  // Gestión de Proyectos
  getProjects() {
    return getFromStorage('tesis_projects', INITIAL_PROJECTS);
  },

  getProjectById(id) {
    const projects = this.getProjects();
    return projects.find((p) => p.id === id) || null;
  },

  saveProject(project) {
    const projects = this.getProjects();
    const index = projects.findIndex((p) => p.id === project.id);
    if (index >= 0) {
      projects[index] = { ...projects[index], ...project, updatedAt: new Date().toISOString().split('T')[0] };
    } else {
      projects.push({
        ...project,
        id: `proj_${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      });
    }
    setToStorage('tesis_projects', projects);
    return project;
  },

  // Gestión de Versiones de Entrega
  getVersions(projectId) {
    const all = getFromStorage('tesis_versions', INITIAL_VERSIONS);
    return all.filter((v) => v.projectId === projectId);
  },

  addVersion(versionData) {
    const all = getFromStorage('tesis_versions', INITIAL_VERSIONS);
    const newVersion = {
      ...versionData,
      id: `ver_${Date.now()}`,
      uploadedAt: new Date().toLocaleString(),
      status: 'en_revision',
    };
    all.push(newVersion);
    setToStorage('tesis_versions', all);

    // Actualizar versión y estado en el proyecto
    const project = this.getProjectById(versionData.projectId);
    if (project) {
      this.saveProject({
        ...project,
        currentVersion: versionData.versionNumber,
        similarityScore: versionData.similarityScore || project.similarityScore,
        status: PROJECT_STATUS.EN_REVISION_TUTOR,
      });
    }
    return newVersion;
  },

  // Observaciones y Comentarios Estructurados
  getFeedback(projectId) {
    const all = getFromStorage('tesis_feedback', INITIAL_FEEDBACK);
    return all.filter((f) => f.projectId === projectId);
  },

  addFeedback(feedbackData) {
    const all = getFromStorage('tesis_feedback', INITIAL_FEEDBACK);
    const newFeedback = {
      ...feedbackData,
      id: `fb_${Date.now()}`,
      status: 'pendiente',
      studentResponse: '',
      createdAt: new Date().toLocaleString(),
    };
    all.push(newFeedback);
    setToStorage('tesis_feedback', all);

    // Actualizar estado del proyecto a "Con Observaciones"
    const project = this.getProjectById(feedbackData.projectId);
    if (project) {
      this.saveProject({ ...project, status: PROJECT_STATUS.CON_OBSERVACIONES });
    }
    return newFeedback;
  },

  updateFeedback(feedbackId, updates) {
    const all = getFromStorage('tesis_feedback', INITIAL_FEEDBACK);
    const index = all.findIndex((f) => f.id === feedbackId);
    if (index >= 0) {
      all[index] = { ...all[index], ...updates };
      setToStorage('tesis_feedback', all);
      return all[index];
    }
    return null;
  },

  // Autorizaciones de Defensa
  getAuthorizations() {
    return getFromStorage('tesis_authorizations', INITIAL_AUTHORIZATIONS);
  },

  createAuthorization(authData) {
    const all = this.getAuthorizations();
    const newAuth = {
      ...authData,
      id: `auth_${Date.now()}`,
      code: `ACTA-UCE-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      authorizedAt: new Date().toISOString().split('T')[0],
      status: 'Habilitado para Defensa',
      digitalSealHash: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
    };
    all.push(newAuth);
    setToStorage('tesis_authorizations', all);

    // Actualizar proyecto a Autorizado
    const project = this.getProjectById(authData.projectId);
    if (project) {
      this.saveProject({ ...project, status: PROJECT_STATUS.AUTORIZADO });
    }
    return newAuth;
  },
};

