'use client';
import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Alert from '@mui/material/Alert';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

// Iconos
import AddCommentIcon from '@mui/icons-material/AddComment';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { useAuth } from '@/context/AuthContext';
import { StorageService, USER_ROLES } from '@/services/storageService';

const CATEGORIES = [
  'APA / Citas y Referencias',
  'Metodología / Población y Muestra',
  'Marco Teórico y Conceptual',
  'Control de Similitud / Parafraseo',
  'Estructura y Redacción Académica',
];

function DocumentReviewContent() {
  const { id } = useParams();
  const router = useRouter();
  const { dataVersion, triggerRefresh } = useAuth();
  const [project, setProject] = useState(null);
  const [versions, setVersions] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [chapterTab, setChapterTab] = useState(0);

  // Modal nueva observación
  const [openModal, setOpenModal] = useState(false);
  const [pageNumber, setPageNumber] = useState(24);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [severity, setSeverity] = useState('media');
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    const proj = StorageService.getProjectById(id || 'proj_1');
    if (proj) {
      setProject(proj);
      setVersions(StorageService.getVersions(proj.id));
      setFeedback(StorageService.getFeedback(proj.id));
    }
  }, [id, dataVersion]);

  const handleAddFeedback = (e) => {
    e.preventDefault();
    if (!project) return;

    const latestVer = versions[versions.length - 1]?.id || 'ver_1';

    StorageService.addFeedback({
      projectId: project.id,
      versionId: latestVer,
      author: 'Dr. Roberto Gómez Lozano',
      authorRole: USER_ROLES.TUTOR,
      page: Number(pageNumber),
      category,
      severity,
      comment: commentText,
    });

    setOpenModal(false);
    setCommentText('');
    triggerRefresh();
  };

  if (!project) return null;

  return (
    <Box sx={{ maxWidth: 1350, mx: 'auto' }}>
      {/* Botón Volver y Cabecera */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => router.push('/tutor')}>
          Volver a Mis Proyectos
        </Button>
      </Box>

      {/* Barra de Título y Acciones */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, mb: 2.5 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Chip label={`Versión Evaluada: ${project.currentVersion}`} color="primary" size="small" />
            <Chip label={`Similitud: ${project.similarityScore}%`} color="success" size="small" variant="outlined" />
            <Chip label={project.career} size="small" />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
            Mesa de Revisión: {project.title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Tesistas: <strong>{project.authors.join(' • ')}</strong> | Tutor: <strong>{project.tutorName}</strong>
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddCommentIcon />}
            onClick={() => setOpenModal(true)}
          >
            Nueva Observación
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push(`/tutor/proyectos/${project.id}/dictamen`)}
          >
            Emitir Dictamen V°B°
          </Button>
        </Box>
      </Box>

      {/* Pestañas de Navegación por Capítulos */}
      <Paper sx={{ mb: 2.5, borderRadius: 2, border: '1px solid #e2e8f0' }}>
        <Tabs
          value={chapterTab}
          onChange={(e, val) => setChapterTab(val)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ minHeight: 48 }}
        >
          <Tab label="Documento Completo" sx={{ fontWeight: 600 }} />
          <Tab label="1. Introducción & Problema" sx={{ fontWeight: 600 }} />
          <Tab label="2. Marco Teórico" sx={{ fontWeight: 600 }} />
          <Tab label="3. Metodología" sx={{ fontWeight: 600 }} />
          <Tab label="4. Desarrollo & Resultados" sx={{ fontWeight: 600 }} />
          <Tab label="5. Conclusiones" sx={{ fontWeight: 600 }} />
          <Tab label="Referencias APA" sx={{ fontWeight: 600 }} />
        </Tabs>
      </Paper>

      <Grid container spacing={3}>
        {/* Visor del Documento con Scroll Interno (Lado Izquierdo) */}
        <Grid item xs={12} md={7} lg={7.5}>
          <Paper
            sx={{
              p: { xs: 2.5, sm: 4 },
              maxHeight: 'calc(100vh - 230px)',
              minHeight: 500,
              overflowY: 'auto',
              borderRadius: 3,
              border: '1px solid #cbd5e1',
              bgcolor: '#ffffff',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: '#f1f5f9',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#cbd5e1',
                borderRadius: '4px',
                '&:hover': {
                  backgroundColor: '#94a3b8',
                },
              },
            }}
          >
            {/* Cabecera del visor */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 2, mb: 3, borderBottom: '2px solid #e2e8f0' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <MenuBookIcon color="primary" />
                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                  Borrador Completo del Proyecto (Lectura y Auditoría)
                </Typography>
              </Box>
              <Chip label="78 Páginas • v1.1" size="small" color="primary" variant="outlined" />
            </Box>

            {/* PORTADA SIMULADA */}
            {(chapterTab === 0 || chapterTab === 1) && (
              <Box sx={{ textAlign: 'center', py: 4, mb: 4, bgcolor: '#f8fafc', borderRadius: 2, border: '1px dashed #cbd5e1' }}>
                <Typography variant="caption" sx={{ textTransform: 'uppercase', color: 'text.secondary', letterSpacing: '0.1em' }}>
                  Facultad de Ingeniería • Escuela Profesional de Ingeniería de Sistemas
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, mt: 2, mb: 2, color: '#0f172a', maxWidth: 600, mx: 'auto' }}>
                  {project.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Trabajo de Culminación de Estudios para optar el Título Profesional
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, mt: 1 }}>
                  Tesistas: {project.authors.join(' & ')}
                </Typography>
                <Typography variant="body2" sx={{ color: 'secondary.main', fontWeight: 600, mt: 0.5 }}>
                  Asesor Académico: {project.tutorName}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>
                  2026
                </Typography>
              </Box>
            )}

            {/* CAPÍTULO 1 */}
            {(chapterTab === 0 || chapterTab === 1) && (
              <Box sx={{ mb: 5 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b', borderBottom: '2px solid #3b82f6', pb: 0.5, mb: 2 }}>
                  Capítulo 1: Introducción y Planteamiento del Problema
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.secondary', mb: 1 }}>
                  1.1 Descripción de la Realidad Problemática
                </Typography>
                <Typography variant="body2" paragraph sx={{ lineHeight: 1.8, color: '#334155', textAlign: 'justify' }}>
                  En las cadenas logísticas contemporáneas, la gestión precisa de inventarios constituye un pilar estratégico
                  para la competitividad operativa. No obstante, las empresas de distribución masiva enfrentan discrepancias
                  recurrentes entre el inventario físico y los registros contables computarizados (diferencias de stock de hasta un 14.8%),
                  atribuibles a métodos de conteo manual, retrasos en la lectura de códigos de barras tradicionales y errores humanos
                  durante los turnos de recepción y despacho.
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.secondary', mb: 1 }}>
                  1.2 Formulación del Problema General
                </Typography>
                <Typography variant="body2" paragraph sx={{ lineHeight: 1.8, color: '#334155', textAlign: 'justify', fontStyle: 'italic' }}>
                  "¿De qué manera la implementación de una arquitectura basada en Internet de las Cosas (IoT) con sensores RFID y microcontroladores ESP32
                  optimiza los tiempos de registro y la exactitud del inventario en almacenes centrales durante el periodo 2026?"
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.secondary', mb: 1 }}>
                  1.3 Objetivos de la Investigación
                </Typography>
                <Typography variant="body2" component="ul" sx={{ lineHeight: 1.8, color: '#334155', pl: 3 }}>
                  <li><strong>Objetivo General:</strong> Diseñar e implementar un prototipo automatizado de trazabilidad en tiempo real empleando dispositivos IoT y telemetría en nube.</li>
                  <li><strong>Objetivo Específico 1:</strong> Determinar los tiempos de captura de datos antes y después del despliegue tecnológico.</li>
                  <li><strong>Objetivo Específico 2:</strong> Evaluar la tasa de error en la conciliación de existencias bajo la metodología de clasificación ABC.</li>
                </Typography>
              </Box>
            )}

            {/* CAPÍTULO 2 */}
            {(chapterTab === 0 || chapterTab === 2) && (
              <Box sx={{ mb: 5 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b', borderBottom: '2px solid #3b82f6', pb: 0.5, mb: 2 }}>
                  Capítulo 2: Marco Teórico y Antecedentes
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.secondary', mb: 1 }}>
                  2.1 Antecedentes Internacionales y Nacionales
                </Typography>
                <Typography variant="body2" paragraph sx={{ lineHeight: 1.8, color: '#334155', textAlign: 'justify' }}>
                  Hernández et al. (2023) desarrollaron un modelo experimental en centros de distribución en Monterrey,
                  concluyendo que los tags RFID pasivos de ultra alta frecuencia (UHF) alcanzan una tasa de lectura superior
                  al 99.2% en pallets en movimiento continuo. Asimismo, Kumar & Zhang (2024) demostraron que la latencia
                  de sincronización mediante el protocolo MQTT disminuye el consumo energético en nodos periféricos en un 38%.
                </Typography>

                {/* ALERTA OBSERVACIÓN 1 (APA) */}
                <Paper sx={{ p: 2, my: 2.5, bgcolor: '#fef3c7', borderLeft: '4px solid #f59e0b' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <BookmarkIcon color="warning" fontSize="small" />
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#b45309' }}>
                      [Página 24 - Observación de Tutoría #1 | Severidad Media | Estado: PENDIENTE]:
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#92400e', fontStyle: 'italic' }}>
                    "En la sección 3.2, las citas textuales de más de 40 palabras deben ir en bloque sangrado sin comillas conforme a APA 7ma edición."
                  </Typography>
                </Paper>

                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.secondary', mb: 1 }}>
                  2.2 Bases Teóricas del Internet de las Cosas y Protocolo MQTT
                </Typography>
                <Typography variant="body2" paragraph sx={{ lineHeight: 1.8, color: '#334155', textAlign: 'justify' }}>
                  El paradigma de Internet de las Cosas (IoT) aplicado a la logística industrial se estructura en tres capas principales:
                  la capa de percepción (sensores RFID y lectores UHF), la capa de red (comunicación Wi-Fi 802.11 b/g/n y brokers MQTT seguros con TLS),
                  y la capa de aplicación (servidores cloud con almacenamiento relacional y tableros analíticos en tiempo real).
                </Typography>
              </Box>
            )}

            {/* CAPÍTULO 3 */}
            {(chapterTab === 0 || chapterTab === 3) && (
              <Box sx={{ mb: 5 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b', borderBottom: '2px solid #3b82f6', pb: 0.5, mb: 2 }}>
                  Capítulo 3: Marco Metodológico y Procedimientos
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.secondary', mb: 1 }}>
                  3.1 Enfoque y Tipo de Investigación
                </Typography>
                <Typography variant="body2" paragraph sx={{ lineHeight: 1.8, color: '#334155', textAlign: 'justify' }}>
                  La investigación se desarrolla bajo un enfoque cuantitativo, de nivel explicativo-aplicado y con diseño cuasi-experimental.
                  Se establecieron dos mediciones longitudinales (pre-test y post-test) para contrastar la hipótesis de investigación frente a la nula.
                </Typography>

                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.secondary', mb: 1 }}>
                  3.2 Población, Muestra y Muestreo
                </Typography>
                <Typography variant="body2" paragraph sx={{ lineHeight: 1.8, color: '#334155', textAlign: 'justify' }}>
                  La población objetivo comprende 45 centros de acopio y distribución de la organización. Para el cálculo del tamaño de muestra
                  se empleó la fórmula para poblaciones finitas con un nivel de confianza del 95% y un margen de error del 5%, resultando en 40 almacenes representativos.
                </Typography>

                {/* ALERTA OBSERVACIÓN 2 (SUBSANADA) */}
                <Paper sx={{ p: 2, my: 2.5, bgcolor: '#ecfdf5', borderLeft: '4px solid #10b981' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <CheckCircleIcon color="success" fontSize="small" />
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#047857' }}>
                      [Página 41 - Observación #2 | Severidad Alta | Estado: SUBSANADA]:
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#065f46', mb: 1 }}>
                    "Falta especificar el tamaño de la muestra de almacenes y la fórmula estadística empleada para validar el nivel de confianza del 95%."
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', color: '#047857', fontWeight: 700 }}>
                    Respuesta del tesista: "Se incorporó la fórmula de población finita y tabla de variables de muestreo en el anexo B y pág. 42."
                  </Typography>
                </Paper>
              </Box>
            )}

            {/* CAPÍTULO 4 */}
            {(chapterTab === 0 || chapterTab === 4) && (
              <Box sx={{ mb: 5 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b', borderBottom: '2px solid #3b82f6', pb: 0.5, mb: 2 }}>
                  Capítulo 4: Desarrollo de la Solución y Resultados
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.secondary', mb: 1 }}>
                  4.1 Arquitectura del Prototipo IoT
                </Typography>
                <Typography variant="body2" paragraph sx={{ lineHeight: 1.8, color: '#334155', textAlign: 'justify' }}>
                  El sistema implementado consta de arcos de lectura RFID en las compuertas de recepción, procesadores embebidos ESP32 encargados
                  del filtrado inicial de lecturas duplicadas y un backend desarrollado con Next.js y base de datos relacional para la auditoría de entradas y salidas.
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.secondary', mb: 1 }}>
                  4.2 Resultados de Tiempos y Tasa de Exactitud
                </Typography>
                <Typography variant="body2" paragraph sx={{ lineHeight: 1.8, color: '#334155', textAlign: 'justify' }}>
                  El tiempo promedio de registro por pallet de 50 ítems se redujo drásticamente de 14.2 minutos (método tradicional con pistola de código de barras)
                  a tan solo 42 segundos con la lectura masiva por radiofrecuencia, representando una optimización del 95.1%.
                </Typography>

                {/* ALERTA OBSERVACIÓN 3 (SIMILITUD) */}
                <Paper sx={{ p: 2, my: 2.5, bgcolor: '#fef3c7', borderLeft: '4px solid #f59e0b' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <BookmarkIcon color="warning" fontSize="small" />
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#b45309' }}>
                      [Página 65 - Observación #3 | Severidad Baja | Estado: PENDIENTE]:
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#92400e', fontStyle: 'italic' }}>
                    "El marco regulatorio muestra 3 párrafos idénticos a la norma ISO 9001. Parafrasear para reducir el índice de coincidencia."
                  </Typography>
                </Paper>
              </Box>
            )}

            {/* CAPÍTULO 5 */}
            {(chapterTab === 0 || chapterTab === 5) && (
              <Box sx={{ mb: 5 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b', borderBottom: '2px solid #3b82f6', pb: 0.5, mb: 2 }}>
                  Capítulo 5: Conclusiones y Recomendaciones
                </Typography>
                <Typography variant="body2" component="ul" sx={{ lineHeight: 1.8, color: '#334155', pl: 3 }}>
                  <li><strong>Primera:</strong> Se demostró experimentalmente que la integración de tecnología RFID pasiva UHF con microcontroladores de bajo costo optimiza sustancialmente la velocidad de ingreso en bodegas centrales.</li>
                  <li><strong>Segunda:</strong> La tasa de error en conciliaciones físicas descendió del 14.8% al 0.3%, validando la hipótesis de investigación con un p-valor menor a 0.001.</li>
                  <li><strong>Tercera:</strong> El retorno de inversión (ROI) estimado para almacenes con inventario superior a $100,000 USD es alcanzable en un plazo promedio de 6.4 meses.</li>
                </Typography>
              </Box>
            )}

            {/* REFERENCIAS APA */}
            {(chapterTab === 0 || chapterTab === 6) && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b', borderBottom: '2px solid #3b82f6', pb: 0.5, mb: 2 }}>
                  Referencias Bibliográficas (Normas APA 7ma Edición)
                </Typography>
                <Typography variant="body2" paragraph sx={{ pl: 4, textIndent: '-2rem', lineHeight: 1.8, color: '#334155' }}>
                  Hernández, L., Torres, G., & Castro, R. (2023). <em>Optimización logística mediante sensores de radiofrecuencia en centros de almacenamiento masivo</em>. Revista Iberoamericana de Automática, 19(2), 142–156. https://doi.org/10.1016/j.riauto.2023.04.002
                </Typography>
                <Typography variant="body2" paragraph sx={{ pl: 4, textIndent: '-2rem', lineHeight: 1.8, color: '#334155' }}>
                  Kumar, A., & Zhang, W. (2024). <em>Low-power edge computing architectures for smart inventory management</em>. IEEE Transactions on Industrial Informatics, 20(3), 2891–2900.
                </Typography>
                <Typography variant="body2" paragraph sx={{ pl: 4, textIndent: '-2rem', lineHeight: 1.8, color: '#334155' }}>
                  Organización Internacional de Normalización. (2015). <em>Sistemas de gestión de la calidad: Requisitos</em> (ISO 9001:2015). Ginebra: ISO.
                </Typography>
              </Box>
            )}

            <Box sx={{ textAlign: 'center', py: 3, borderTop: '1px solid #e2e8f0', mt: 4 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                — Fin del documento cargado (Versión {project.currentVersion}) —
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Panel Lateral Sticky de Observaciones (Lado Derecho) */}
        <Grid item xs={12} md={5} lg={4.5}>
          <Box
            sx={{
              position: { md: 'sticky' },
              top: 85,
              maxHeight: 'calc(100vh - 230px)',
              overflowY: 'auto',
              pr: 0.5,
              '&::-webkit-scrollbar': { width: '6px' },
              '&::-webkit-scrollbar-thumb': { backgroundColor: '#cbd5e1', borderRadius: '3px' },
            }}
          >
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                Observaciones del Tutor ({feedback.length})
              </Typography>
              <Chip
                label={`${feedback.filter((f) => f.status === 'pendiente').length} pendientes`}
                size="small"
                color={feedback.filter((f) => f.status === 'pendiente').length > 0 ? 'warning' : 'success'}
                sx={{ fontWeight: 700 }}
              />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {feedback.map((obs) => {
                const isPending = obs.status === 'pendiente';
                return (
                  <Card
                    key={obs.id}
                    sx={{
                      borderLeft: `5px solid ${isPending ? '#f59e0b' : '#10b981'}`,
                      boxShadow: '0 2px 4px rgb(0 0 0 / 0.05)',
                    }}
                  >
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Chip
                          icon={<FormatQuoteIcon />}
                          label={obs.category}
                          size="small"
                          color="secondary"
                          sx={{ fontWeight: 700, fontSize: '0.72rem' }}
                        />
                        <Chip
                          label={obs.status.toUpperCase()}
                          size="small"
                          color={isPending ? 'warning' : 'success'}
                          sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }}
                        />
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', bgcolor: '#f1f5f9', px: 1, py: 0.2, borderRadius: 1 }}>
                          Página {obs.page}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Severidad: <strong>{obs.severity}</strong>
                        </Typography>
                      </Box>

                      <Typography variant="body2" sx={{ my: 1, color: '#1e293b', fontWeight: 500, bgcolor: '#f8fafc', p: 1.5, borderRadius: 1.5 }}>
                        "{obs.comment}"
                      </Typography>

                      {obs.studentResponse && (
                        <Box sx={{ mt: 1, p: 1.5, bgcolor: '#ecfdf5', borderRadius: 1.5, border: '1px solid #a7f3d0' }}>
                          <Typography variant="caption" sx={{ color: '#047857', fontWeight: 800, display: 'block', mb: 0.3 }}>
                            Respuesta del Tesista:
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#065f46', display: 'block' }}>
                            {obs.studentResponse}
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Modal Nueva Observación */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          Ingresar Observación Estructurada
        </DialogTitle>
        <form onSubmit={handleAddFeedback}>
          <DialogContent dividers>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Tipo / Categoría"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORIES.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  fullWidth
                  label="Página"
                  type="number"
                  value={pageNumber}
                  onChange={(e) => setPageNumber(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  fullWidth
                  select
                  label="Severidad"
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                >
                  <MenuItem value="baja">Baja</MenuItem>
                  <MenuItem value="media">Media</MenuItem>
                  <MenuItem value="alta">Alta</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Comentario y Orientación de Corrección"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  required
                  placeholder="Detalla qué corregir de acuerdo a las normas APA o método de investigación..."
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenModal(false)}>Cancelar</Button>
            <Button type="submit" variant="contained" color="secondary" startIcon={<AddCommentIcon />}>
              Registrar Observación
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default function DocumentReviewPage() {
  return (
    <Suspense fallback={null}>
      <DocumentReviewContent />
    </Suspense>
  );
}
