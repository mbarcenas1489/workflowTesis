'use client';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';

// Iconos
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import ReplyIcon from '@mui/icons-material/Reply';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

import { useAuth } from '@/context/AuthContext';
import { StorageService } from '@/services/storageService';

const SEVERITY_COLORS = {
  alta: 'error',
  media: 'warning',
  baja: 'info',
};

export default function StudentFeedbackPage() {
  const { dataVersion, triggerRefresh } = useAuth();
  const [project, setProject] = useState(null);
  const [feedbackList, setFeedbackList] = useState([]);
  const [tabValue, setTabValue] = useState(0);

  // Modal subsanación
  const [selectedObs, setSelectedObs] = useState(null);
  const [responseNotes, setResponseNotes] = useState('');

  useEffect(() => {
    const proj = StorageService.getProjectById('proj_1');
    if (proj) {
      setProject(proj);
      setFeedbackList(StorageService.getFeedback(proj.id));
    }
  }, [dataVersion]);

  const handleOpenResponse = (obs) => {
    setSelectedObs(obs);
    setResponseNotes(obs.studentResponse || '');
  };

  const handleSaveSubsanacion = (e) => {
    e.preventDefault();
    if (!selectedObs) return;

    StorageService.updateFeedback(selectedObs.id, {
      status: 'subsanada',
      studentResponse: responseNotes,
    });

    setSelectedObs(null);
    setResponseNotes('');
    triggerRefresh();
  };

  if (!project) return null;

  const filteredList = feedbackList.filter((item) => {
    if (tabValue === 1) return item.status === 'pendiente';
    if (tabValue === 2) return item.status === 'subsanada';
    return true;
  });

  const pendingCount = feedbackList.filter((f) => f.status === 'pendiente').length;

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
      <Box sx={{ mb: 3 }}>
        <Chip label="Revisión de Normas y Fondo" color="primary" size="small" sx={{ mb: 1 }} />
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>
          Observaciones Estructuradas del Tutor
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Tutor a cargo: <strong>{project.tutorName}</strong> • Versión evaluada: <strong>{project.currentVersion}</strong>
        </Typography>
      </Box>

      {/* Tabs de Filtro */}
      <Tabs
        value={tabValue}
        onChange={(e, val) => setTabValue(val)}
        sx={{ mb: 3, borderBottom: '1px solid #e2e8f0' }}
      >
        <Tab label={`Todas (${feedbackList.length})`} sx={{ fontWeight: 600 }} />
        <Tab
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              Pendientes
              {pendingCount > 0 && (
                <Chip label={pendingCount} color="warning" size="small" sx={{ height: 20 }} />
              )}
            </Box>
          }
          sx={{ fontWeight: 600 }}
        />
        <Tab label="Subsanadas" sx={{ fontWeight: 600 }} />
      </Tabs>

      {/* Lista de Observaciones */}
      <Grid container spacing={2.5}>
        {filteredList.map((obs) => {
          const isPending = obs.status === 'pendiente';
          return (
            <Grid item xs={12} key={obs.id}>
              <Card sx={{ borderLeft: `6px solid ${isPending ? '#f59e0b' : '#10b981'}` }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <Chip
                        icon={<FormatQuoteIcon />}
                        label={obs.category}
                        color="secondary"
                        size="small"
                        sx={{ fontWeight: 700 }}
                      />
                      <Chip
                        label={`Severidad ${obs.severity.toUpperCase()}`}
                        color={SEVERITY_COLORS[obs.severity] || 'default'}
                        size="small"
                        variant="outlined"
                      />
                      <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', bgcolor: '#f1f5f9', px: 1, py: 0.3, borderRadius: 1 }}>
                        Página: {obs.page}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {isPending ? (
                        <Chip icon={<PendingIcon />} label="Pendiente de Subsanar" color="warning" size="small" />
                      ) : (
                        <Chip icon={<CheckCircleIcon />} label="Subsanada" color="success" size="small" />
                      )}
                      <Typography variant="caption" color="text.secondary">
                        {obs.createdAt}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Comentario del tutor */}
                  <Typography variant="body1" sx={{ color: '#1e293b', fontWeight: 500, my: 1.5, p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                    "{obs.comment}"
                  </Typography>

                  {/* Respuesta del estudiante si fue subsanada */}
                  {obs.studentResponse && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: '#ecfdf5', borderRadius: 2, border: '1px solid #a7f3d0' }}>
                      <Typography variant="caption" sx={{ color: '#047857', fontWeight: 700, display: 'block', mb: 0.5 }}>
                        Respuesta del Equipo / Solución Aplicada:
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#065f46' }}>
                        {obs.studentResponse}
                      </Typography>
                    </Box>
                  )}

                  {/* Botón para responder/subsanar */}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button
                      variant={isPending ? 'contained' : 'outlined'}
                      color={isPending ? 'primary' : 'inherit'}
                      size="small"
                      startIcon={<ReplyIcon />}
                      onClick={() => handleOpenResponse(obs)}
                    >
                      {isPending ? 'Responder y Subsanar' : 'Editar Respuesta'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Modal para Subsanar Observación */}
      <Dialog open={Boolean(selectedObs)} onClose={() => setSelectedObs(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          Subsanar Observación: {selectedObs?.category} (Pág. {selectedObs?.page})
        </DialogTitle>
        <form onSubmit={handleSaveSubsanacion}>
          <DialogContent dividers>
            <Alert severity="info" sx={{ mb: 2 }}>
              "{selectedObs?.comment}"
            </Alert>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Explica la corrección realizada en el borrador"
              value={responseNotes}
              onChange={(e) => setResponseNotes(e.target.value)}
              required
              placeholder="Indica qué cambios hiciste, en qué página o anexo, o cómo se adaptó la norma APA requerida..."
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setSelectedObs(null)}>Cancelar</Button>
            <Button type="submit" variant="contained" color="success" startIcon={<CheckCircleIcon />}>
              Guardar como Subsanada
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

