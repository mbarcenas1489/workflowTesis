'use client';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import SaveIcon from '@mui/icons-material/Save';

import { useAuth } from '@/context/AuthContext';
import { StorageService } from '@/services/storageService';

export default function StudentProjectPage() {
  const { dataVersion, triggerRefresh } = useAuth();
  const [project, setProject] = useState(null);
  const [title, setTitle] = useState('');
  const [lineOfResearch, setLineOfResearch] = useState('');
  const [abstract, setAbstract] = useState('');
  const [authorNames, setAuthorNames] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const proj = StorageService.getProjectById('proj_1');
    if (proj) {
      setProject(proj);
      setTitle(proj.title);
      setLineOfResearch(proj.lineOfResearch);
      setAbstract(proj.abstract);
      setAuthorNames(proj.authors.join(', '));
    }
  }, [dataVersion]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!project) return;

    const updated = {
      ...project,
      title,
      lineOfResearch,
      abstract,
      authors: authorNames.split(',').map((a) => a.trim()).filter(Boolean),
    };

    StorageService.saveProject(updated);
    setSavedSuccess(true);
    triggerRefresh();
  };

  if (!project) return null;

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <Box sx={{ mb: 3 }}>
        <Chip label="Ficha Oficial" color="primary" size="small" sx={{ mb: 1 }} />
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>
          Datos del Proyecto de Culminación de Estudios
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Información registrada ante la Unidad Académica y Comité Evaluador.
        </Typography>
      </Box>

      <Card>
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSave}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Título del Trabajo / Monografía"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  helperText="Debe coincidir exactamente con la portada del documento oficial"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Línea de Investigación"
                  value={lineOfResearch}
                  onChange={(e) => setLineOfResearch(e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Carrera / Facultad"
                  value={project.career}
                  disabled
                  helperText="Asignado por secretaría académica"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Integrantes / Tesistas (separados por coma)"
                  value={authorNames}
                  onChange={(e) => setAuthorNames(e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Resumen Ejecutivo (Abstract)"
                  value={abstract}
                  onChange={(e) => setAbstract(e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.secondary', mb: 1.5 }}>
                  Comité y Tutor Asignados
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                      <Typography variant="caption" color="text.secondary">Tutor Académico:</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: 'secondary.main' }}>
                        {project.tutorName}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                      <Typography variant="caption" color="text.secondary">Jurados Registrados:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {project.jurados.join(' • ')}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={<SaveIcon />}
                >
                  Guardar Cambios
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      <Snackbar
        open={savedSuccess}
        autoHideDuration={4000}
        onClose={() => setSavedSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Ficha del proyecto guardada exitosamente en localStorage.
        </Alert>
      </Snackbar>
    </Box>
  );
}

