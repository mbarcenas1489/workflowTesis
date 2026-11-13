'use client';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Paper from '@mui/material/Paper';

// Iconos
import SchoolIcon from '@mui/icons-material/School';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import GavelIcon from '@mui/icons-material/Gavel';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { useAuth } from '@/context/AuthContext';
import { USER_ROLES } from '@/services/storageService';

const WORKFLOW_STEPS = [
  'Registro de Proyecto',
  'Carga de Borradores (v1.0...)',
  'Revisión Tutor & APA',
  'Evaluación de Jurados',
  'Autorización de Defensa',
  'Repositorio Digital',
];

export default function HomePage() {
  const router = useRouter();
  const { switchRole } = useAuth();

  const handleEnterRole = (role, path) => {
    switchRole(role);
    router.push(path);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      {/* Banner Principal */}
      <Box sx={{ mb: 4, textAlign: 'left' }}>
        <Chip
          label="Plataforma 100% Digital • Unidad de Culminación de Estudios"
          color="primary"
          variant="outlined"
          sx={{ mb: 1.5, fontWeight: 600 }}
        />
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
          Flujo Digital y Repositorio de Trabajos de Grado
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 850 }}>
          Centraliza la entrega de borradores, control de normas APA, observaciones estructuradas y la autorización
          digital de defensas entre estudiantes, tutores, jurados y la Unidad Académica.
        </Typography>
      </Box>

      {/* Stepper del Proceso */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3, border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: 'primary.main', textTransform: 'uppercase' }}>
          Ciclo de Vida de la Monografía / Tesis
        </Typography>
        <Stepper activeStep={2} alternativeLabel sx={{ pt: 1 }}>
          {WORKFLOW_STEPS.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Tarjetas de Acceso por Rol */}
      <Typography variant="h6" sx={{ mb: 2.5, fontWeight: 700 }}>
        Selecciona un Rol para Ingresar al Módulo
      </Typography>

      <Grid container spacing={3}>
        {/* Card Estudiante */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <SchoolIcon color="primary" fontSize="large" />
                <Chip label="Estudiante" color="primary" size="small" />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                Tesistas / Grupo
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sube avances de tu monografía, consulta observaciones de formato APA y subsana correcciones del tutor.
              </Typography>
            </CardContent>
            <CardActions sx={{ p: 2, pt: 0 }}>
              <Button
                variant="contained"
                fullWidth
                endIcon={<ArrowForwardIcon />}
                onClick={() => handleEnterRole(USER_ROLES.ESTUDIANTE, '/estudiante')}
              >
                Entrar como Estudiante
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Card Tutor */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <SupervisedUserCircleIcon color="secondary" fontSize="large" />
                <Chip label="Tutor" color="secondary" size="small" />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                Docente Tutor
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Revisa borradores, registra comentarios estructurados de fondo y APA, y emite el V°B° para habilitar jurados.
              </Typography>
            </CardContent>
            <CardActions sx={{ p: 2, pt: 0 }}>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                endIcon={<ArrowForwardIcon />}
                onClick={() => handleEnterRole(USER_ROLES.TUTOR, '/tutor')}
              >
                Entrar como Tutor
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Card Jurado */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <GavelIcon color="warning" fontSize="large" />
                <Chip label="Jurado" color="warning" size="small" />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                Jurado Evaluador
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Evalúa el borrador aprobado bajo rúbrica académica y emite el dictamen final previo a la defensa.
              </Typography>
            </CardContent>
            <CardActions sx={{ p: 2, pt: 0 }}>
              <Button
                variant="contained"
                color="warning"
                fullWidth
                endIcon={<ArrowForwardIcon />}
                onClick={() => handleEnterRole(USER_ROLES.JURADO, '/jurado')}
              >
                Entrar como Jurado
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Card Unidad Académica */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <AdminPanelSettingsIcon color="success" fontSize="large" />
                <Chip label="Unidad" color="success" size="small" />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                Unidad de Culminación
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Asigna tutores/jurados, monitorea indicadores globales y emite el Acta Oficial Digital de Defensa.
              </Typography>
            </CardContent>
            <CardActions sx={{ p: 2, pt: 0 }}>
              <Button
                variant="contained"
                color="success"
                fullWidth
                endIcon={<ArrowForwardIcon />}
                onClick={() => handleEnterRole(USER_ROLES.ADMIN, '/admin')}
              >
                Entrar a la Unidad
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      {/* Banner Repositorio Abierto */}
      <Paper
        sx={{
          mt: 4,
          p: 3,
          borderRadius: 3,
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <AutoStoriesIcon color="primary" sx={{ fontSize: 40 }} />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e3a8a' }}>
              Repositorio Institucional de Monografías Aprobadas
            </Typography>
            <Typography variant="body2" sx={{ color: '#3b82f6' }}>
              Consulta las tesis sustentadas, filtra por carrera y descarga documentos aprobados.
            </Typography>
          </Box>
        </Box>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => router.push('/repositorio')}
          sx={{ whiteSpace: 'nowrap' }}
        >
          Explorar Repositorio
        </Button>
      </Paper>
    </Box>
  );
}
