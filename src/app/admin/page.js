'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
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
import Paper from '@mui/material/Paper';

// Iconos
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import VerifiedIcon from '@mui/icons-material/Verified';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';

import { useAuth } from '@/context/AuthContext';
import { StorageService } from '@/services/storageService';

export default function AdminDashboard() {
  const router = useRouter();
  const { dataVersion } = useAuth();
  const [projects, setProjects] = useState([]);
  const [authorizations, setAuthorizations] = useState([]);

  useEffect(() => {
    setProjects(StorageService.getProjects());
    setAuthorizations(StorageService.getAuthorizations());
  }, [dataVersion]);

  const totalProjects = projects.length;
  const readyForDefense = projects.filter((p) => p.status === 'aprobado_defensa').length;
  const authorized = projects.filter((p) => p.status === 'autorizado' || p.status === 'publicado').length;
  const inReview = projects.filter((p) => p.status === 'en_revision_tutor' || p.status === 'con_observaciones').length;

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Chip label="Unidad de Culminación de Estudios" color="success" size="small" sx={{ mb: 1 }} />
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>
            Panel de Control Institucional
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Monitoreo en tiempo real del flujo de borradores, asignación docente y autorizaciones digitales.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<HowToRegIcon />}
            onClick={() => router.push('/admin/asignaciones')}
          >
            Asignaciones
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<VerifiedIcon />}
            onClick={() => router.push('/admin/autorizaciones')}
          >
            Autorizaciones ({readyForDefense})
          </Button>
        </Box>
      </Box>

      {/* Tarjetas de Métricas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2.5, borderRadius: 2, border: '1px solid #e2e8f0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <DescriptionIcon color="primary" />
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                Total Trabajos
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>
              {totalProjects}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2.5, borderRadius: 2, border: '1px solid #e2e8f0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <PendingActionsIcon color="warning" />
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                En Revisión / Observaciones
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'warning.main' }}>
              {inReview}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2.5, borderRadius: 2, border: '1px solid #e2e8f0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <VerifiedIcon color="info" />
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                Listos para Defensa
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'info.main' }}>
              {readyForDefense}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2.5, borderRadius: 2, border: '1px solid #e2e8f0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <CheckCircleIcon color="success" />
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                Autorizados / Publicados
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'success.main' }}>
              {authorized}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Tabla General de Expedientes */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 2.5, borderBottom: '1px solid #e2e8f0' }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Expedientes y Estado del Flujo de Culminación de Estudios
            </Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Proyecto / Título</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Tesistas</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Carrera</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Tutor Asignado</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Similitud</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projects.map((proj) => (
                  <TableRow key={proj.id} sx={{ '&:hover': { backgroundColor: '#f8fafc' } }}>
                    <TableCell sx={{ maxWidth: 320 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                        {proj.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Versión: {proj.currentVersion}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{proj.authors.join(', ')}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={proj.career} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'secondary.main' }}>
                        {proj.tutorName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${proj.similarityScore}%`}
                        size="small"
                        color={proj.similarityScore <= 15 ? 'success' : 'error'}
                        sx={{ fontWeight: 700 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={proj.status.replace(/_/g, ' ').toUpperCase()}
                        color={
                          proj.status === 'autorizado' || proj.status === 'publicado'
                            ? 'success'
                            : proj.status === 'aprobado_defensa'
                            ? 'info'
                            : 'warning'
                        }
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}

