'use client';
import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

// Iconos
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VerifiedIcon from '@mui/icons-material/Verified';
import FactCheckIcon from '@mui/icons-material/FactCheck';

import { useAuth } from '@/context/AuthContext';
import { StorageService, PROJECT_STATUS } from '@/services/storageService';

function TutorDictamenContent() {
  const { id } = useParams();
  const router = useRouter();
  const { dataVersion, triggerRefresh } = useAuth();
  const [project, setProject] = useState(null);
  const [feedback, setFeedback] = useState([]);

  // Checklists
  const [checkApa, setCheckApa] = useState(true);
  const [checkFondo, setCheckFondo] = useState(true);
  const [checkSimilitud, setCheckSimilitud] = useState(true);
  const [conclusions, setConclusions] = useState(
    'Habiendo revisado los borradores presentados y constatado la subsanación de las observaciones formuladas, emito VISTO BUENO favorable para el pase del documento a evaluación por la terna de jurados.'
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const proj = StorageService.getProjectById(id || 'proj_1');
    if (proj) {
      setProject(proj);
      setFeedback(StorageService.getFeedback(proj.id));
    }
  }, [id, dataVersion]);

  const handleEmitirVistoBueno = (e) => {
    e.preventDefault();
    if (!project) return;

    StorageService.saveProject({
      ...project,
      status: PROJECT_STATUS.APROBADO_TUTOR,
      tutorApprovalDate: new Date().toISOString().split('T')[0],
      tutorComments: conclusions,
    });

    setSavedSuccess(true);
    triggerRefresh();
    setTimeout(() => {
      router.push('/tutor');
    }, 1500);
  };

  if (!project) return null;

  const pendingObs = feedback.filter((f) => f.status === 'pendiente');

  return (
    <Box sx={{ maxWidth: 850, mx: 'auto' }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => router.push('/tutor')} sx={{ mb: 2 }}>
        Volver a Mis Proyectos
      </Button>

      <Box sx={{ mb: 3 }}>
        <Chip label="Dictamen de Tutoría" color="primary" size="small" sx={{ mb: 1 }} />
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>
          Emisión de Visto Bueno Académico
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Autorización formal para que el trabajo continúe a la etapa de evaluación de jurados y defensa.
        </Typography>
      </Box>

      {pendingObs.length > 0 && (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
          Atención: Aún constan <strong>{pendingObs.length} observaciones pendientes</strong> en el sistema. Puedes emitir el visto bueno condicionado o solicitar correcciones adicionales.
        </Alert>
      )}

      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          {/* Datos del Proyecto */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>
              {project.title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              Tesistas: {project.authors.join(' • ')} | Versión: {project.currentVersion}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <form onSubmit={handleEmitirVistoBueno}>
            {/* Checklist de Requisitos Formales */}
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: 'text.secondary', textTransform: 'uppercase' }}>
              Declaración de Conformidad
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
              <FormControlLabel
                control={<Checkbox checked={checkApa} onChange={(e) => setCheckApa(e.target.checked)} color="primary" />}
                label="Revisión de Normas APA 7ma edición completada (citas, tablas y bibliografía conformes)."
              />
              <FormControlLabel
                control={<Checkbox checked={checkFondo} onChange={(e) => setCheckFondo(e.target.checked)} color="primary" />}
                label="Contenido científico, metodología y resultados rigurosamente validados."
              />
              <FormControlLabel
                control={<Checkbox checked={checkSimilitud} onChange={(e) => setCheckSimilitud(e.target.checked)} color="primary" />}
                label={`Control de similitud verificado (${project.similarityScore}%, dentro del margen permitido < 15%).`}
              />
            </Box>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Dictamen y Recomendación del Tutor"
              value={conclusions}
              onChange={(e) => setConclusions(e.target.value)}
              required
              sx={{ mb: 3 }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button variant="outlined" onClick={() => router.push('/tutor')}>
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="success"
                size="large"
                startIcon={<VerifiedIcon />}
                disabled={!checkApa || !checkFondo || !checkSimilitud}
              >
                Firmar y Emitir Visto Bueno
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>

      <Snackbar open={savedSuccess} autoHideDuration={3000}>
        <Alert severity="success">
          ¡Visto Bueno emitido con éxito! El proyecto pasa a la fase de Evaluación de Jurados.
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default function TutorDictamenPage() {
  return (
    <Suspense fallback={null}>
      <TutorDictamenContent />
    </Suspense>
  );
}

