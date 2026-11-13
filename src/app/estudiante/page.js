'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';

// Iconos
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import RateReviewIcon from '@mui/icons-material/RateReview';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import { useAuth } from '@/context/AuthContext';
import { StorageService, PROJECT_STATUS } from '@/services/storageService';

const STATUS_STEPS = [
  { key: PROJECT_STATUS.BORRADOR, label: 'Borrador Inicial' },
  { key: PROJECT_STATUS.EN_REVISION_TUTOR, label: 'En Revisión Tutor' },
  { key: PROJECT_STATUS.CON_OBSERVACIONES, label: 'Con Observaciones' },
  { key: PROJECT_STATUS.APROBADO_TUTOR, label: 'Visto Bueno Tutor' },
  { key: PROJECT_STATUS.EN_EVALUACION_JURADO, label: 'Evaluación Jurados' },
  { key: PROJECT_STATUS.AUTORIZADO, label: 'Defensa Autorizada' },
];

export default function StudentDashboard() {
  const router = useRouter();
  const { dataVersion } = useAuth();
  const [project, setProject] = useState(null);
  const [versions, setVersions] = useState([]);
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    // Tomamos el proyecto 1 como proyecto del estudiante logueado
    const proj = StorageService.getProjectById('proj_1');
    if (proj) {
      setProject(proj);
      setVersions(StorageService.getVersions(proj.id));
      setFeedback(StorageService.getFeedback(proj.id));
    }
  }, [dataVersion]);

  if (!project) return null;

  const pendingFeedbackCount = feedback.filter((f) => f.status === 'pendiente').length;

  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.key === project.status);
  const activeStep = currentStepIndex >= 0 ? currentStepIndex : 2;

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      {/* Encabezado */}
      <Box sx={{ mb: 3 }}>
        <Chip label="Portal del Estudiante" color="primary" size="small" sx={{ mb: 1 }} />
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>
          Mi Trabajo de Culminación de Estudios
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mt: 0.5 }}>
          {project.career} • Convocatoria {project.year}
        </Typography>
      </Box>

      {/* Alerta de Observaciones si existen pendientes */}
      {pendingFeedbackCount > 0 && (
        <Alert
          severity="warning"
          icon={<WarningAmberIcon />}
          action={
            <Button color="inherit" size="small" onClick={() => router.push('/estudiante/observaciones')}>
              Ver Observaciones
            </Button>
          }
          sx={{ mb: 3, borderRadius: 2 }}
        >
          Tienes <strong>{pendingFeedbackCount} observaciones pendientes</strong> formuladas por tu tutor sobre la versión {project.currentVersion} (normas APA y metodología).
        </Alert>
      )}

      {/* Stepper de Estado del Workflow */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3, border: '1px solid #e2e8f0' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: 'text.secondary', textTransform: 'uppercase' }}>
          Estado de Trámite del Documento
        </Typography>
        <Stepper activeStep={activeStep} alternativeLabel>
          {STATUS_STEPS.map((step) => (
            <Step key={step.key}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Tarjetas de Información Rápida */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Título y Resumen */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="caption" sx={{ textTransform: 'uppercase', color: 'primary.main', fontWeight: 700 }}>
                Tema Aprobado
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5, mb: 1.5 }}>
                {project.title}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                {project.abstract}
              </Typography>
              <Divider sx={{ my: 1.5 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>Autores:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{project.authors.join(' • ')}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>Tutor Académico:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'secondary.main' }}>{project.tutorName}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Métricas y Versión Actual */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="caption" sx={{ textTransform: 'uppercase', color: 'text.secondary', fontWeight: 700 }}>
                Borrador Vigente
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1, mb: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>
                  {project.currentVersion}
                </Typography>
                <Chip
                  label={project.status.replace(/_/g, ' ').toUpperCase()}
                  color={project.status === 'con_observaciones' ? 'warning' : 'info'}
                  size="small"
                />
              </Box>

              <Box sx={{ mb: 2, p: 1.5, backgroundColor: '#f8fafc', borderRadius: 2 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                  Índice de Similitud (Turnitin):
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: project.similarityScore <= 15 ? 'success.main' : 'error.main' }}>
                    {project.similarityScore}%
                  </Typography>
                  <Chip
                    label={project.similarityScore <= 15 ? 'Aceptable (< 15%)' : 'Excede Límite'}
                    size="small"
                    color={project.similarityScore <= 15 ? 'success' : 'error'}
                    variant="outlined"
                    sx={{ height: 20, fontSize: '0.7rem' }}
                  />
                </Box>
              </Box>

              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Total de entregas realizadas: <strong>{versions.length} versiones</strong>
              </Typography>
            </CardContent>

            <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<CloudUploadIcon />}
                onClick={() => router.push('/estudiante/versiones')}
              >
                Subir Entrega
              </Button>
              <Button
                variant="outlined"
                startIcon={<RateReviewIcon />}
                onClick={() => router.push('/estudiante/observaciones')}
              >
                Observaciones
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

