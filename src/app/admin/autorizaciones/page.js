'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
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
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Divider from '@mui/material/Divider';

// Iconos
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VerifiedIcon from '@mui/icons-material/Verified';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { useAuth } from '@/context/AuthContext';
import { StorageService } from '@/services/storageService';

export default function AutorizacionesPage() {
  const router = useRouter();
  const { dataVersion, triggerRefresh } = useAuth();
  const [projects, setProjects] = useState([]);
  const [authorizations, setAuthorizations] = useState([]);

  // Modal Autorización
  const [selectedProject, setSelectedProject] = useState(null);
  const [defenseDate, setDefenseDate] = useState('2026-11-28');
  const [defensePlace, setDefensePlace] = useState('Auditorio Central de Grados - Campus Principal');
  const [coordinatorName, setCoordinatorName] = useState('Dra. Patricia Alarcón');

  // Modal Ver Acta Emitida
  const [viewingAuth, setViewingAuth] = useState(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setProjects(StorageService.getProjects());
    setAuthorizations(StorageService.getAuthorizations());
  }, [dataVersion]);

  const handleOpenEmitir = (proj) => {
    setSelectedProject(proj);
  };

  const handleConfirmAuthorize = (e) => {
    e.preventDefault();
    if (!selectedProject) return;

    const newAuth = StorageService.createAuthorization({
      projectId: selectedProject.id,
      coordinator: coordinatorName,
      defenseTentativeDate: defenseDate,
      defensePlace,
    });

    setSelectedProject(null);
    setSavedSuccess(true);
    triggerRefresh();
    setViewingAuth({ ...newAuth, project: selectedProject });
  };

  const readyProjects = projects.filter(
    (p) => p.status === 'aprobado_defensa' || p.status === 'aprobado_tutor'
  );

  return (
    <Box sx={{ maxWidth: 1150, mx: 'auto' }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => router.push('/admin')} sx={{ mb: 2 }}>
        Volver a Control Institucional
      </Button>

      <Box sx={{ mb: 3 }}>
        <Chip label="Pase de Culminación 100% Digital" color="success" size="small" sx={{ mb: 1 }} />
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>
          Autorización Digital de Defensa de Grado
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          La Unidad Académica valida las aprobaciones de tutor y jurados para emitir el acta que habilita la sustentación.
        </Typography>
      </Box>

      {/* Trabajos Listos para Autorización */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 2.5, borderBottom: '1px solid #e2e8f0', bgcolor: '#f8fafc' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Trabajos Pendientes de Emisión de Autorización ({readyProjects.length})
            </Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Proyecto / Carrera</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Tesistas</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Tutor V°B°</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Similitud</TableCell>
                  <TableCell sx={{ fontWeight: 700, textAlign: 'right' }}>Acción</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {readyProjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>
                      No hay proyectos pendientes de emisión en este momento.
                    </TableCell>
                  </TableRow>
                ) : (
                  readyProjects.map((proj) => (
                    <TableRow key={proj.id} sx={{ '&:hover': { backgroundColor: '#f8fafc' } }}>
                      <TableCell sx={{ maxWidth: 350 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{proj.title}</Typography>
                        <Typography variant="caption" color="text.secondary">{proj.career}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{proj.authors.join(', ')}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip icon={<CheckCircleIcon />} label="Aprobado" color="success" size="small" />
                      </TableCell>
                      <TableCell>
                        <Chip label={`${proj.similarityScore}%`} color="success" size="small" variant="outlined" />
                      </TableCell>
                      <TableCell sx={{ textAlign: 'right' }}>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          startIcon={<VerifiedIcon />}
                          onClick={() => handleOpenEmitir(proj)}
                        >
                          Autorizar Defensa
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Actas Digitales Emitidas */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 2.5, borderBottom: '1px solid #e2e8f0', bgcolor: '#f8fafc' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Historial de Actas y Autorizaciones Digitales Emitidas ({authorizations.length})
            </Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Código de Acta</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Fecha Autorizada</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Fecha de Defensa Programada</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Lugar</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Sello Digital (Hash)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {authorizations.map((auth) => (
                  <TableRow key={auth.id}>
                    <TableCell>
                      <Chip label={auth.code} color="primary" size="small" sx={{ fontWeight: 700 }} />
                    </TableCell>
                    <TableCell><Typography variant="body2">{auth.authorizedAt}</Typography></TableCell>
                    <TableCell><Typography variant="body2" sx={{ fontWeight: 600 }}>{auth.defenseTentativeDate}</Typography></TableCell>
                    <TableCell><Typography variant="body2">{auth.defensePlace}</Typography></TableCell>
                    <TableCell>
                      <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
                        {auth.digitalSealHash.substring(0, 16)}...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Modal para Emitir Autorización */}
      <Dialog open={Boolean(selectedProject)} onClose={() => setSelectedProject(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          Generar Acta Oficial de Autorización de Defensa
        </DialogTitle>
        <form onSubmit={handleConfirmAuthorize}>
          <DialogContent dividers>
            <Alert severity="success" sx={{ mb: 2.5 }}>
              Proyecto: <strong>{selectedProject?.title}</strong>
              <br />
              Autores: {selectedProject?.authors?.join(', ')}
            </Alert>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Fecha Programada de Defensa"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={defenseDate}
                  onChange={(e) => setDefenseDate(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Coordinador de Unidad"
                  value={coordinatorName}
                  onChange={(e) => setCoordinatorName(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Lugar / Enlace de la Sustentación"
                  value={defensePlace}
                  onChange={(e) => setDefensePlace(e.target.value)}
                  required
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setSelectedProject(null)}>Cancelar</Button>
            <Button type="submit" variant="contained" color="success" startIcon={<VerifiedIcon />}>
              Emitir y Firmar Digitalmente
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Modal Vista Previa de Acta Generada */}
      <Dialog open={Boolean(viewingAuth)} onClose={() => setViewingAuth(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 800 }}>
          CERTIFICADO DIGITAL DE AUTORIZACIÓN DE DEFENSA
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f8fafc', borderRadius: 2, mb: 2 }}>
            <QrCode2Icon sx={{ fontSize: 90, color: 'primary.main' }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main' }}>
              {viewingAuth?.code}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
              Validación Criptográfica: {viewingAuth?.digitalSealHash}
            </Typography>
          </Box>

          <Typography variant="body2" paragraph sx={{ textAlign: 'justify', lineHeight: 1.8 }}>
            La <strong>Unidad de Culminación de Estudios</strong> certifica que el trabajo de grado ha cumplido
            a satisfacción con todas las revisiones metodológicas, estándares de formato <strong>Normas APA</strong> y
            el control de similitud académica exigido por reglamento. En consecuencia, queda formalmente autorizado para su
            sustentación pública.
          </Typography>

          <Divider sx={{ my: 1.5 }} />

          <Typography variant="caption" color="text.secondary" display="block">
            <strong>Fecha de Sustentación:</strong> {viewingAuth?.defenseTentativeDate}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            <strong>Lugar:</strong> {viewingAuth?.defensePlace}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            <strong>Autorizado por:</strong> {viewingAuth?.coordinator}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button variant="contained" onClick={() => setViewingAuth(null)}>
            Cerrar Certificado
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={savedSuccess} autoHideDuration={3000}>
        <Alert severity="success">
          ¡Autorización de defensa emitida y registrada digitalmente!
        </Alert>
      </Snackbar>
    </Box>
  );
}

