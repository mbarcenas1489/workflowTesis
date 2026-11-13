'use client';
import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import SchoolIcon from '@mui/icons-material/School';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '@/context/AuthContext';
import { USER_ROLES } from '@/services/storageService';

const ROLE_LABELS = {
  [USER_ROLES.ESTUDIANTE]: { label: 'Estudiante', color: 'primary' },
  [USER_ROLES.TUTOR]: { label: 'Docente Tutor', color: 'secondary' },
  [USER_ROLES.JURADO]: { label: 'Jurado Evaluador', color: 'warning' },
  [USER_ROLES.ADMIN]: { label: 'Unidad de Culminación', color: 'success' },
};

export default function AppNavbar({ onToggleSidebar }) {
  const { currentUser, currentRole, switchRole, resetDemoData } = useAuth();
  const [roleAnchor, setRoleAnchor] = useState(null);

  const handleOpenRoleMenu = (event) => {
    setRoleAnchor(event.currentTarget);
  };

  const handleCloseRoleMenu = () => {
    setRoleAnchor(null);
  };

  const handleSelectRole = (role) => {
    switchRole(role);
    handleCloseRoleMenu();
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: '#ffffff',
        color: '#0f172a',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Lado izquierdo: Logo y Título */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={onToggleSidebar}
            sx={{ display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: 2,
              backgroundColor: 'primary.main',
              color: '#ffffff',
            }}
          >
            <SchoolIcon />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              Workflow Tesis & Monografías
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'block' } }}>
              Unidad de Culminación de Estudios
            </Typography>
          </Box>
        </Box>

        {/* Lado derecho: Selector de Rol y Acciones */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {/* Selector de Rol interactivo */}
          <Tooltip title="Cambiar rol activo para probar la vista correspondiente">
            <Button
              variant="outlined"
              size="small"
              onClick={handleOpenRoleMenu}
              startIcon={<SwapHorizIcon />}
              sx={{
                textTransform: 'none',
                borderColor: '#cbd5e1',
                color: '#334155',
                '&:hover': { borderColor: 'primary.main' },
              }}
            >
              Rol: 
              <Chip
                size="small"
                label={ROLE_LABELS[currentRole]?.label || currentRole}
                color={ROLE_LABELS[currentRole]?.color || 'default'}
                sx={{ ml: 1, height: 22, fontSize: '0.75rem', fontWeight: 600 }}
              />
            </Button>
          </Tooltip>

          <Menu
            anchorEl={roleAnchor}
            open={Boolean(roleAnchor)}
            onClose={handleCloseRoleMenu}
            PaperProps={{
              sx: { minWidth: 220, borderRadius: 2, mt: 1, border: '1px solid #e2e8f0' },
            }}
          >
            <MenuItem onClick={() => handleSelectRole(USER_ROLES.ESTUDIANTE)}>
              <Chip size="small" label="Estudiante" color="primary" sx={{ mr: 1.5, width: 90 }} />
              <Typography variant="body2">Carlos & Ana</Typography>
            </MenuItem>
            <MenuItem onClick={() => handleSelectRole(USER_ROLES.TUTOR)}>
              <Chip size="small" label="Tutor" color="secondary" sx={{ mr: 1.5, width: 90 }} />
              <Typography variant="body2">Dr. Roberto Gómez</Typography>
            </MenuItem>
            <MenuItem onClick={() => handleSelectRole(USER_ROLES.JURADO)}>
              <Chip size="small" label="Jurado" color="warning" sx={{ mr: 1.5, width: 90 }} />
              <Typography variant="body2">Mgtr. Elena Valenzuela</Typography>
            </MenuItem>
            <MenuItem onClick={() => handleSelectRole(USER_ROLES.ADMIN)}>
              <Chip size="small" label="Unidad" color="success" sx={{ mr: 1.5, width: 90 }} />
              <Typography variant="body2">Dra. Patricia Alarcón</Typography>
            </MenuItem>
          </Menu>

          {/* Botón de Restablecer localStorage */}
          <Tooltip title="Restablecer datos de prueba a valores iniciales">
            <IconButton
              size="small"
              onClick={() => {
                if (window.confirm('¿Deseas restablecer todos los datos de prueba de localStorage?')) {
                  resetDemoData();
                }
              }}
              sx={{ color: '#64748b', border: '1px solid #e2e8f0' }}
            >
              <RestartAltIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* Avatar del usuario actual */}
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: 'primary.dark',
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            {currentUser?.name ? currentUser.name[0] : 'U'}
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

