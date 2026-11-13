'use client';
import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

// Iconos
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GavelIcon from '@mui/icons-material/Gavel';

import { useAuth } from '@/context/AuthContext';
import { StorageService, PROJECT_STATUS } from '@/services/storageService';

function JuradoEvaluationContent() {
  const { id } = useParams();
  const router = useRouter();
  const { dataVersion, triggerRefresh } = useAuth();
  const [project, setProject] = useState(null);

  // Rúbrica
  const [scoreMetodologia, setScoreMetodologia] = useState(23);
  const [scoreApa, setScoreApa] = useState(24);
  const [scoreTeoria, setScoreTeoria] = useState(22);
  const [scoreResultados, setScoreResultados] = useState(24);
  const [verdict, setVerdict] = useState('FAVORABLE');
  const [comments, setComments] = useState(
    'El trabajo presenta una solución técnica viable, con rigor metodológico y adecuada redacción bajo normas APA. Se recomienda habilitar para fecha de defensa pública.'
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const proj = StorageService.getProjectById(id || 'proj_2');
    if (proj) {
      setProject(proj);
    }
  }, [id, dataVersion]);

  const totalScore = scoreMetodologia + scoreApa + scoreTeoria + scoreResultados;

  const handleSubmitEvaluation = (e) => {
    e.preventDefault();
    if (!project) return;

    StorageService.saveProject({
      ...project,
      status: verdict === 'FAVORABLE' ? PROJECT_STATUS.APROBADO_DEFENSA : PROJECT_STATUS.CON_OBSERVACIONES,
      juradoScore: totalScore,
      juradoVerdict: verdict,
      juradoComments: comments,
      juradoDate: new Date().toISOString().split('T')[0],
    });

    setSavedSuccess(true);
    triggerRefresh();
    setTimeout(() => {
      router.push('/jurado');
    }, 1500);
  };

  if (!project) return null;

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => router.push('/jurado')} sx={{ mb: 2 }}>
        Volver a Proyectos Asignados
      </Button>

      <Box sx={{ mb: 3 }}>
        <Chip label="Rúbrica de Jurado" color="warning" size="small" sx={{ mb: 1 }} />
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>
          Dictamen de Jurado Evaluador
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Proyecto: <strong>{project.title}</strong>
        </Typography>
      </Box>

      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmitEvaluation}>
            {/* Rúbrica de Criterios */}
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 3 }}>
              Criterios de Evaluación Cuantitativa (Base 100 puntos)
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 2.5, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>1. Rigor Metodológico:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>{scoreMetodologia}/25 pts</Typography>
                  </Box>
                  <Slider
                    value={scoreMetodologia}
                    onChange={(e, val) => setScoreMetodologia(val)}
                    min={0}
                    max={25}
                    sx={{ mt: 1 }}
                  />
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 2.5, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>2. Normas APA y Formato:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>{scoreApa}/25 pts</Typography>
                  </Box>
                  <Slider
                    value={scoreApa}
                    onChange={(e, val) => setScoreApa(val)}
                    min={0}
                    max={25}
                    sx={{ mt: 1 }}
                  />
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 2.5, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>3. Fundamento Teórico:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>{scoreTeoria}/25 pts</Typography>
                  </Box>
                  <Slider
                    value={scoreTeoria}
                    onChange={(e, val) => setScoreTeoria(val)}
                    min={0}
                    max={25}
                    sx={{ mt: 1 }}
                  />
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 2.5, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>4. Resultados y Aportes:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>{scoreResultados}/25 pts</Typography>
                  </Box>
                  <Slider
                    value={scoreResultados}
                    onChange={(e, val) => setScoreResultados(val)}
                    min={0}
                    max={25}
                    sx={{ mt: 1 }}
                  />
                </Paper>
              </Grid>

              {/* Puntaje Total */}
              <Grid item xs={12}>
                <Box sx={{ p: 2, bgcolor: '#f0fdf4', borderRadius: 2, border: '1px solid #bbf7d0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#166534' }}>
                    Calificación Preliminar Total:
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#15803d' }}>
                    {totalScore} / 100 puntos
                  </Typography>
                </Box>
              </Grid>

              {/* Veredicto */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Veredicto del Jurado"
                  value={verdict}
                  onChange={(e) => setVerdict(e.target.value)}
                >
                  <MenuItem value="FAVORABLE">Favorable (Habilitar para Defensa)</MenuItem>
                  <MenuItem value="CON_OBSERVACIONES">Requiere Correcciones Menores</MenuItem>
                  <MenuItem value="DESFAVORABLE">Desfavorable (Rehacer)</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Comentarios del Jurado Evaluador"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 1 }}>
                <Button variant="outlined" onClick={() => router.push('/jurado')}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="warning"
                  size="large"
                  startIcon={<GavelIcon />}
                >
                  Registrar Dictamen de Jurado
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      <Snackbar open={savedSuccess} autoHideDuration={3000}>
        <Alert severity="success">
          Dictamen de jurado registrado con éxito. Estado actualizado a Aprobado para Defensa.
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default function JuradoEvaluationPage() {
  return (
    <Suspense fallback={null}>
      <JuradoEvaluationContent />
    </Suspense>
  );
}

