'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

// Iconos
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import HowToRegIcon from '@mui/icons-material/HowToReg';

import { useAuth } from '@/context/AuthContext';
import { StorageService } from '@/services/storageService';

export default function AsignacionesPage() {
  const router = useRouter();
  const { dataVersion, triggerRefresh } = useAuth();
  const [projects, setProjects] = useState([]);

  // Modal Asignación
  const [selectedProject, setSelectedProject] = useState(null);
  const [tutorName, setTutorName] = useState('');
  const [juradosStr, setJuradosStr] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setProjects(StorageService.getProjects());
  }, [dataVersion]);

  const handleOpenEdit = (proj) => {
    setSelectedProject(proj);
    setTutorName(proj.tutorName || '');
    setJuradosStr(proj.jurados ? proj.jurados.join(', ') : '');
  };

  const handleSaveAssignment = (e) => {
    e.preventDefault();
    if (!selectedProject) return;

    StorageService.saveProject({
      ...selectedProject,
      tutorName,
      jurados: juradosStr.split(',').map((j) => j.trim()).filter(Boolean),
    });

    setSelectedProject(null);
    setSavedSuccess(true);
    triggerRefresh();
  };

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => router.push('/admin')} sx={{ mb: 2 }}>
        Volver a Control Institucional
      </Button>

      <Box sx={{ mb: 3 }}>
        <Chip label="Gestión Docente" color="success" size="small" sx={{ mb: 1 }} />
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>
          Asignación Oficial de Tutores y Jurados Evaluadores
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Vincula a cada equipo de tesistas con su docente asesor y el comité de tres jurados para la evaluación.
        </Typography>
      </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Proyecto / Tesistas</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Tutor Académico</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Terna de Jurados</TableCell>
                <TableCell sx={{ fontWeight: 700, textAlign: 'right' }}>Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map((proj) => (
                <TableRow key={proj.id} sx={{ '&:hover': { backgroundColor: '#f8fafc' } }}>
                  <TableCell sx={{ maxWidth: 350 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                      {proj.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Tesistas: {proj.authors.join(', ')} ({proj.career})
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={proj.tutorName} size="small" color="secondary" variant="outlined" sx={{ fontWeight: 600 }} />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 300 }}>
                    <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                      {proj.jurados?.join(' • ') || 'Sin asignar'}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={() => handleOpenEdit(proj)}
                    >
                      Asignar / Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Modal para Asignar */}
      <Dialog open={Boolean(selectedProject)} onClose={() => setSelectedProject(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          Modificar Comité Evaluador y Tutoría
        </DialogTitle>
        <form onSubmit={handleSaveAssignment}>
          <DialogContent dividers>
            <Typography variant="subtitle2" sx={{ mb: 2, color: 'primary.main' }}>
              {selectedProject?.title}
            </Typography>
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nombre del Docente Tutor Asignado"
                  value={tutorName}
                  onChange={(e) => setTutorName(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Jurados Evaluadores (separados por comas)"
                  value={juradosStr}
                  onChange={(e) => setJuradosStr(e.target.value)}
                  required
                  helperText="Ingresa los tres nombres de los jurados titulares"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setSelectedProject(null)}>Cancelar</Button>
            <Button type="submit" variant="contained" color="success" startIcon={<HowToRegIcon />}>
              Guardar Asignación
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar open={savedSuccess} autoHideDuration={3000}>
        <Alert severity="success">
          Asignación actualizada con éxito en localStorage.
        </Alert>
      </Snackbar>
    </Box>
  );
}

