'use client';
import { useState, useEffect } from 'react';
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
import Alert from '@mui/material/Alert';

// Iconos
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import { useAuth } from '@/context/AuthContext';
import { StorageService } from '@/services/storageService';

export default function StudentVersionsPage() {
  const { dataVersion, triggerRefresh } = useAuth();
  const [project, setProject] = useState(null);
  const [versions, setVersions] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  // Form states
  const [versionNumber, setVersionNumber] = useState('');
  const [fileName, setFileName] = useState('');
  const [similarityScore, setSimilarityScore] = useState(10);
  const [changelog, setChangelog] = useState('');

  useEffect(() => {
    const proj = StorageService.getProjectById('proj_1');
    if (proj) {
      setProject(proj);
      const vers = StorageService.getVersions(proj.id);
      setVersions(vers);
      // Sugerir siguiente versión
      const nextVer = `v1.${vers.length}`;
      setVersionNumber(nextVer);
    }
  }, [dataVersion]);

  const handleOpenModal = () => {
    setFileName(`Borrador_${versionNumber}_Tesis_Mendoza_Silva.pdf`);
    setOpenModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!project) return;

    StorageService.addVersion({
      projectId: project.id,
      versionNumber,
      fileName: fileName || `Entrega_${versionNumber}.pdf`,
      fileSize: '5.1 MB',
      changelog,
      similarityScore: Number(similarityScore),
      uploadedBy: 'Carlos Mendoza',
    });

    setOpenModal(false);
    setChangelog('');
    triggerRefresh();
  };

  if (!project) return null;

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Chip label="Control de Versiones" color="primary" size="small" sx={{ mb: 1 }} />
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>
            Historial de Entregas y Borradores
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Cada entrega es notificada automáticamente al tutor asignado ({project.tutorName}).
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="large"
          startIcon={<CloudUploadIcon />}
          onClick={handleOpenModal}
        >
          Subir Nueva Entrega
        </Button>
      </Box>

      {/* Tabla de Versiones */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Versión</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Archivo Digital</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Fecha de Carga</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Similitud</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Notas de Cambio (Changelog)</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {versions.slice().reverse().map((ver, idx) => (
                <TableRow key={ver.id} sx={{ '&:hover': { backgroundColor: '#f8fafc' } }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main' }}>
                        {ver.versionNumber}
                      </Typography>
                      {idx === 0 && (
                        <Chip label="Vigente" size="small" color="primary" sx={{ height: 20, fontSize: '0.65rem' }} />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PictureAsPdfIcon color="error" fontSize="small" />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{ver.fileName}</Typography>
                        <Typography variant="caption" color="text.secondary">{ver.fileSize}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{ver.uploadedAt}</Typography>
                    <Typography variant="caption" color="text.secondary">por {ver.uploadedBy}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={`${ver.similarityScore}%`}
                      size="small"
                      color={ver.similarityScore <= 15 ? 'success' : 'error'}
                      variant="outlined"
                      sx={{ fontWeight: 700 }}
                    />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 320 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                      {ver.changelog}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {ver.status === 'revisado' ? (
                      <Chip icon={<CheckCircleIcon />} label="Revisado" color="success" size="small" />
                    ) : (
                      <Chip icon={<AccessTimeIcon />} label="En Revisión" color="warning" size="small" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Modal para Subir Nueva Entrega */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          Subir Nueva Entrega de Borrador
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            <Alert severity="info" sx={{ mb: 2.5, borderRadius: 2 }}>
              Al enviar un nuevo borrador, el estado de tu proyecto cambiará a <strong>"En Revisión Tutor"</strong> para que sea evaluado.
            </Alert>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Número de Versión"
                  value={versionNumber}
                  onChange={(e) => setVersionNumber(e.target.value)}
                  required
                  placeholder="ej. v1.2"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="% Similitud Reporte Turnitin"
                  type="number"
                  inputProps={{ min: 0, max: 100 }}
                  value={similarityScore}
                  onChange={(e) => setSimilarityScore(e.target.value)}
                  required
                  helperText="Límite reglamentario: 15%"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nombre del Documento (PDF)"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Notas de Cambio (¿Qué mejoras o correcciones incluye esta versión?)"
                  value={changelog}
                  onChange={(e) => setChangelog(e.target.value)}
                  required
                  placeholder="Detalla las correcciones de APA o fondo realizadas..."
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenModal(false)}>Cancelar</Button>
            <Button type="submit" variant="contained" startIcon={<CloudUploadIcon />}>
              Confirmar y Enviar Entrega
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

