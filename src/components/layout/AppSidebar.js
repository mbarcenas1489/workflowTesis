'use client';
import { usePathname, useRouter } from 'next/navigation';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

// Iconos MUI
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import HistoryIcon from '@mui/icons-material/History';
import RateReviewIcon from '@mui/icons-material/RateReview';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import GavelIcon from '@mui/icons-material/Gavel';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import VerifiedIcon from '@mui/icons-material/Verified';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

import { useAuth } from '@/context/AuthContext';
import { USER_ROLES } from '@/services/storageService';

const DRAWER_WIDTH = 260;

export default function AppSidebar({ open, onClose, variant = 'permanent' }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentRole, currentUser } = useAuth();

  const handleNavigate = (path) => {
    router.push(path);
    if (variant === 'temporary' && onClose) {
      onClose();
    }
  };

  const getStudentItems = () => [
    { text: 'Mi Dashboard', icon: <DashboardIcon />, path: '/estudiante' },
    { text: 'Ficha de Proyecto', icon: <DescriptionIcon />, path: '/estudiante/proyecto' },
    { text: 'Versiones y Entregas', icon: <HistoryIcon />, path: '/estudiante/versiones' },
    { text: 'Observaciones y APA', icon: <RateReviewIcon />, path: '/estudiante/observaciones' },
  ];

  const getTutorItems = () => [
    { text: 'Panel de Tutoría', icon: <DashboardIcon />, path: '/tutor' },
    { text: 'Mesa de Revisión', icon: <RateReviewIcon />, path: '/tutor/proyectos/proj_1/revision' },
    { text: 'Emisión de Visto Bueno', icon: <AssignmentTurnedInIcon />, path: '/tutor/proyectos/proj_1/dictamen' },
  ];

  const getJuradoItems = () => [
    { text: 'Panel de Jurados', icon: <DashboardIcon />, path: '/jurado' },
    { text: 'Evaluación y Rúbrica', icon: <GavelIcon />, path: '/jurado/evaluacion/proj_2' },
  ];

  const getAdminItems = () => [
    { text: 'Control Institucional', icon: <AdminPanelSettingsIcon />, path: '/admin' },
    { text: 'Asignar Tutores/Jurados', icon: <HowToRegIcon />, path: '/admin/asignaciones' },
    { text: 'Autorización de Defensa', icon: <VerifiedIcon />, path: '/admin/autorizaciones' },
  ];

  const roleMenuMap = {
    [USER_ROLES.ESTUDIANTE]: { title: 'Módulo de Estudiante', items: getStudentItems() },
    [USER_ROLES.TUTOR]: { title: 'Módulo de Docente Tutor', items: getTutorItems() },
    [USER_ROLES.JURADO]: { title: 'Módulo de Jurado Evaluador', items: getJuradoItems() },
    [USER_ROLES.ADMIN]: { title: 'Unidad de Culminación', items: getAdminItems() },
  };

  const currentMenu = roleMenuMap[currentRole] || roleMenuMap[USER_ROLES.ESTUDIANTE];

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', pt: 2 }}>
      {/* Información del usuario logueado */}
      <Box sx={{ px: 2.5, pb: 2 }}>
        <Typography variant="caption" sx={{ textTransform: 'uppercase', color: 'text.secondary', fontWeight: 700, letterSpacing: '0.05em' }}>
          Sesión Activa
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 700, mt: 0.5, color: '#1e293b' }}>
          {currentUser?.name}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
          {currentUser?.career || currentUser?.specialty || currentUser?.department}
        </Typography>
      </Box>

      <Divider />

      {/* Menú según Rol */}
      <List
        subheader={
          <ListSubheader sx={{ backgroundColor: 'transparent', fontWeight: 700, fontSize: '0.75rem', color: 'primary.main', textTransform: 'uppercase' }}>
            {currentMenu.title}
          </ListSubheader>
        }
      >
        {currentMenu.items.map((item) => {
          const isActive = pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ px: 1, my: 0.3 }}>
              <ListItemButton
                onClick={() => handleNavigate(item.path)}
                selected={isActive}
                sx={{
                  borderRadius: 2,
                  py: 1,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.light',
                    color: 'primary.dark',
                    fontWeight: 700,
                    '&:hover': { backgroundColor: 'primary.light' },
                  },
                }}
              >
                <ListItemIcon sx={{ color: isActive ? 'primary.main' : 'text.secondary', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: isActive ? 600 : 500 }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ my: 1 }} />

      {/* Sección Repositorio Público */}
      <List
        subheader={
          <ListSubheader sx={{ backgroundColor: 'transparent', fontWeight: 700, fontSize: '0.75rem', color: 'text.secondary', textTransform: 'uppercase' }}>
            Acceso Abierto
          </ListSubheader>
        }
      >
        <ListItem disablePadding sx={{ px: 1 }}>
          <ListItemButton
            onClick={() => handleNavigate('/repositorio')}
            selected={pathname === '/repositorio'}
            sx={{
              borderRadius: 2,
              py: 1,
              '&.Mui-selected': {
                backgroundColor: 'secondary.light',
                color: 'secondary.dark',
                fontWeight: 700,
              },
            }}
          >
            <ListItemIcon sx={{ color: pathname === '/repositorio' ? 'secondary.main' : 'text.secondary', minWidth: 40 }}>
              <AutoStoriesIcon />
            </ListItemIcon>
            <ListItemText
              primary="Repositorio Digital"
              primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: pathname === '/repositorio' ? 600 : 500 }}
            />
            <Chip label="Público" size="small" variant="outlined" sx={{ height: 20, fontSize: '0.7rem' }} />
          </ListItemButton>
        </ListItem>
      </List>

      {/* Footer del sidebar */}
      <Box sx={{ mt: 'auto', p: 2, textAlign: 'center', backgroundColor: '#f1f5f9', mx: 2, mb: 2, borderRadius: 2 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontWeight: 600 }}>
          Modo Prototipo
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
          Persistencia activa en localStorage
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Drawer Móvil */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH, backgroundColor: '#ffffff' },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Drawer Desktop */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            backgroundColor: '#ffffff',
            borderRight: '1px solid #e2e8f0',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
}

