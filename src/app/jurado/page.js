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
import GavelIcon from '@mui/icons-material/Gavel';
import SchoolIcon from '@mui/icons-material/School';

import { useAuth } from '@/context/AuthContext';
import { StorageService } from '@/services/storageService';

export default function JuradoDashboard() {
  const router = useRouter();
  const { dataVersion } = useAuth();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Proyectos en fase de evaluación de jurado o aprobados
    const all = StorageService.getProjects();
    setProjects(all);
  }, [dataVersion]);

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
      <Box sx={{ mb: 3 }}>
        <Chip label="Portal de Jurados Evaluadores" color="warning" size="small" sx={{ mb: 1 }} />
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>
          Monografías Asignadas para Evaluación
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Emite tu dictamen técnico y valoración cuantitativa/cualitativa previa a la sustentación pública.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {projects.map((proj) => (
          <Grid item xs={12} md={6} key={proj.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                  <Chip label={proj.career} size="small" variant="outlined" />
                  <Chip
                    label={proj.status.replace(/_/g, ' ').toUpperCase()}
                    color={proj.status === 'aprobado_defensa' ? 'success' : 'info'}
                    size="small"
                  />
                </Box>

                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  {proj.title}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Autores: <strong>{proj.authors.join(', ')}</strong> | Tutor: <strong>{proj.tutorName}</strong>
                </Typography>

                <Divider sx={{ my: 1.5 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    Versión Aprobada: <strong>{proj.currentVersion}</strong>
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Similitud: <strong>{proj.similarityScore}%</strong>
                  </Typography>
                </Box>
              </CardContent>

              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  variant="contained"
                  color="warning"
                  fullWidth
                  startIcon={<GavelIcon />}
                  onClick={() => router.push(`/jurado/evaluacion/${proj.id}`)}
                >
                  Evaluar Proyecto / Emitir Dictamen
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

