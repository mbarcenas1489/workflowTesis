'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';

// Iconos
import RateReviewIcon from '@mui/icons-material/RateReview';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import SchoolIcon from '@mui/icons-material/School';

import { useAuth } from '@/context/AuthContext';
import { StorageService } from '@/services/storageService';

export default function TutorDashboard() {
  const router = useRouter();
  const { dataVersion } = useAuth();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Proyectos asignados al tutor usr_tut_1
    const all = StorageService.getProjects();
    setProjects(all);
  }, [dataVersion]);

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ mb: 3 }}>
        <Chip label="Portal Docente" color="secondary" size="small" sx={{ mb: 1 }} />
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>
          Mis Proyectos Asignados para Tutoría
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Revisa las entregas de borradores, audita el cumplimiento de normas APA y emite los dictámenes de visto bueno.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {projects.map((proj) => {
          const feedback = StorageService.getFeedback(proj.id);
          const pendingObs = feedback.filter((f) => f.status === 'pendiente').length;

          return (
            <Grid item xs={12} md={6} key={proj.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Chip label={proj.career} size="small" variant="outlined" />
                    <Chip
                      label={proj.status.replace(/_/g, ' ').toUpperCase()}
                      color={proj.status === 'aprobado_tutor' || proj.status === 'aprobado_defensa' ? 'success' : 'warning'}
                      size="small"
                      sx={{ fontWeight: 700 }}
                    />
                  </Box>

                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, lineHeight: 1.3 }}>
                    {proj.title}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: 'text.secondary' }}>
                    <SchoolIcon fontSize="small" />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Tesistas: {proj.authors.join(', ')}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 1.5 }} />

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Versión Actual:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        {proj.currentVersion}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Similitud Turnitin:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: proj.similarityScore <= 15 ? 'success.main' : 'error.main' }}>
                        {proj.similarityScore}%
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary">Observaciones registradas:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {pendingObs > 0 ? (
                          <span style={{ color: '#d97706' }}>{pendingObs} pendientes de subsanación</span>
                        ) : (
                          <span style={{ color: '#059669' }}>Todas subsanadas ({feedback.length} totales)</span>
                        )}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    startIcon={<RateReviewIcon />}
                    onClick={() => router.push(`/tutor/proyectos/${proj.id}/revision`)}
                  >
                    Revisar Borrador
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    startIcon={<AssignmentTurnedInIcon />}
                    onClick={() => router.push(`/tutor/proyectos/${proj.id}/dictamen`)}
                  >
                    Emitir Visto Bueno
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

