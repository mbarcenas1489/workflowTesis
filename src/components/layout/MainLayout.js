'use client';
import { useState } from 'react';
import Box from '@mui/material/Box';
import AppNavbar from './AppNavbar';
import AppSidebar from './AppSidebar';

export default function MainLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
      <AppSidebar
        open={mobileOpen}
        onClose={handleDrawerToggle}
        variant="temporary"
      />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', width: { md: `calc(100% - 260px)` } }}>
        <AppNavbar onToggleSidebar={handleDrawerToggle} />
        <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 3, md: 4 } }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}

