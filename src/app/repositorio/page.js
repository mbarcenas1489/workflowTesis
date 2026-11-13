'use client';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Divider from '@mui/material/Divider';

// Iconos
import SearchIcon from '@mui/icons-material/Search';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import DownloadIcon from '@mui/icons-material/Download';
import SchoolIcon from '@mui/icons-material/School';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import { useAuth } from '@/context/AuthContext';
import { StorageService } from '@/services/storageService';

export default function RepositorioPage() {
  const { dataVersion } = useAuth();
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCareer, setSelectedCareer] = useState('TODAS');
  const [selectedThesis, setSelectedThesis] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    // Tomamos todos los proyectos registrados
    setProjects(StorageService.getProjects());
  }, [dataVersion]);

  const careers = ['TODAS', 'Ingeniería de Sistemas', 'Ingeniería Biomédica', 'Ingeniería Industrial'];

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.authors.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.lineOfResearch?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCareer = selectedCareer === 'TODAS' || p.career === selectedCareer;

    return matchesSearch && matchesCareer;
  });

  const getApaCitation = (thesis) => {
    if (!thesis) return '';
    const authorsStr = thesis.authors.join(' & ');
    return `${authorsStr} (${thesis.year || '2026'}). ${thesis.title} [Trabajo de Culminación de Estudios, ${thesis.career}]. Repositorio Institucional Digital.`;
  };

  const handleCopyCitation = (thesis) => {
    navigator.clipboard.writeText(getApaCitation(thesis));
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      {/* Banner de Cabecera */}
      <Paper
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 3,
          backgroundColor: '#1e3a8a',
          color: '#ffffff',
          backgroundImage: 'linear-gradient(135deg, #1e3a8a 0%, #0284c7 100%)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
          <AutoStoriesIcon sx={{ fontSize: 40 }} />
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Repositorio Institucional de Monografías y Tesis
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 800 }}>
          Acceso abierto al acervo de investigaciones y trabajos de culminación de estudios aprobados y sustentados
          ante la Unidad Académica.
        </Typography>
      </Paper>

      {/* Barra de Filtros y Búsqueda */}
      <Paper sx={{ p: 2.5, mb: 4, borderRadius: 2, border: '1px solid #e2e8f0' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              placeholder="Buscar por título, tesista o línea de investigación..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              select
              label="Filtrar por Carrera"
              value={selectedCareer}
              onChange={(e) => setSelectedCareer(e.target.value)}
            >
              {careers.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* Resultados de Trabajos */}
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: 'text.secondary' }}>
        Mostrando {filteredProjects.length} trabajos de grado disponibles
      </Typography>

      <Grid container spacing={3}>
        {filteredProjects.map((thesis) => (
          <Grid item xs={12} md={6} key={thesis.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Chip label={thesis.career} size="small" color="primary" variant="outlined" />
                  <Chip label={thesis.year || '2026'} size="small" />
                </Box>

                <Typography variant="h6" sx={{ fontWeight: 700, my: 1, lineHeight: 1.3 }}>
                  {thesis.title}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, color: 'text.secondary' }}>
                  <SchoolIcon fontSize="small" />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {thesis.authors.join(' • ')}
                  </Typography>
                </Box>

                <Typography variant="body2" sx={{ color: 'text.secondary', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', mb: 2 }}>
                  {thesis.abstract}
                </Typography>

                <Divider sx={{ my: 1 }} />

                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Tutor: <strong>{thesis.tutorName}</strong> • Línea: <strong>{thesis.lineOfResearch}</strong>
                </Typography>
              </CardContent>

              <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setSelectedThesis(thesis)}
                >
                  Ver Ficha y Citar APA
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  startIcon={<DownloadIcon />}
                  onClick={() => alert(`Descargando documento final: ${thesis.title}.pdf`)}
                >
                  Descargar PDF
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Modal Ficha Completa & Cita APA */}
      <Dialog open={Boolean(selectedThesis)} onClose={() => setSelectedThesis(null)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>
          {selectedThesis?.title}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            <Chip label={selectedThesis?.career} color="primary" size="small" />
            <Chip label={`Año: ${selectedThesis?.year || '2026'}`} size="small" />
            <Chip label={`Tutor: ${selectedThesis?.tutorName}`} color="secondary" size="small" variant="outlined" />
          </Box>

          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.secondary', mt: 2 }}>
            Autores / Tesistas:
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
            {selectedThesis?.authors?.join(', ')}
          </Typography>

          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.secondary' }}>
            Resumen (Abstract):
          </Typography>
          <Typography variant="body2" paragraph sx={{ lineHeight: 1.8, textAlign: 'justify', mt: 0.5 }}>
            {selectedThesis?.abstract}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* Generador de Cita APA 7 */}
          <Box sx={{ p: 2.5, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                Referencia Bibliográfica (Normas APA 7ma Edición)
              </Typography>
              <Button
                size="small"
                variant="outlined"
                startIcon={<ContentCopyIcon />}
                onClick={() => handleCopyCitation(selectedThesis)}
              >
                {copySuccess ? '¡Copiado!' : 'Copiar Cita'}
              </Button>
            </Box>
            <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#1e293b' }}>
              {getApaCitation(selectedThesis)}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setSelectedThesis(null)}>Cerrar</Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={() => alert(`Descargando documento final: ${selectedThesis?.title}.pdf`)}
          >
            Descargar Documento Digital
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

