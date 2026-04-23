// src/components/Layout.js
import React, { useState } from 'react';
import { 
    Box, 
    Drawer, 
    AppBar, 
    Toolbar, 
    List, 
    Typography, 
    Divider, 
    IconButton, 
    ListItem, 
    ListItemButton, 
    ListItemIcon, 
    ListItemText, 
    Avatar, 
    Menu, 
    MenuItem 
} from '@mui/material';
import { 
    Dashboard as DashboardIcon, 
    People as PeopleIcon, 
    Description as InvoiceIcon, 
    Inventory as ArticleIcon, 
    Category as CategoryIcon, 
    Menu as MenuIcon, 
    Logout as LogoutIcon,
    Settings as SettingsIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const drawerWidth = 260;

const Layout = ({ children }) => {
    const { currentUser, isAdmin, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: isAdmin ? '/admin' : '/user', roles: ['user', 'admin'] },
        { text: 'Clients', icon: <PeopleIcon />, path: '/clients', roles: ['user', 'admin'] },
        { text: 'Invoices', icon: <InvoiceIcon />, path: '/invoices', roles: ['user', 'admin'] },
        { text: 'Articles', icon: <ArticleIcon />, path: '/articles', roles: ['admin'] },
        { text: 'Categories', icon: <CategoryIcon />, path: '/categories', roles: ['admin'] },
        { text: 'Settings', icon: <SettingsIcon />, path: '/settings', roles: ['admin'] },
    ];

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main', letterSpacing: 1 }}>
                    INV<span style={{ color: '#fff' }}>MAST</span>
                </Typography>
            </Toolbar>
            <Divider sx={{ opacity: 0.1 }} />
            <List sx={{ flexGrow: 1, px: 2, mt: 2 }}>
                {menuItems.map((item) => (
                    (!item.roles.includes('admin') || isAdmin) && (
                        <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                            <ListItemButton 
                                onClick={() => navigate(item.path)}
                                selected={location.pathname === item.path}
                                sx={{ 
                                    borderRadius: 2,
                                    '&.Mui-selected': {
                                        bgcolor: 'rgba(99, 102, 241, 0.15)',
                                        color: 'primary.main',
                                        '& .MuiListItemIcon-root': { color: 'primary.main' }
                                    },
                                    '&:hover': {
                                        bgcolor: 'rgba(255, 255, 255, 0.05)'
                                    }
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 500 }} />
                            </ListItemButton>
                        </ListItem>
                    )
                ))}
            </List>
            <Divider sx={{ opacity: 0.1 }} />
            <Box sx={{ p: 2 }}>
                <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2, color: '#f43f5e' }}>
                    <ListItemIcon sx={{ minWidth: 40, color: '#f43f5e' }}><LogoutIcon /></ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItemButton>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    bgcolor: 'rgba(15, 23, 42, 0.8)',
                    backdropFilter: 'blur(8px)',
                    boxShadow: 'none',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
                        {menuItems.find(i => i.path === location.pathname)?.text || 'App'}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ mr: 2, display: { xs: 'none', md: 'block' }, color: 'text.secondary' }}>
                            {currentUser?.email} {isAdmin && <span style={{ color: '#10b981', marginLeft: 8 }}>(Admin)</span>}
                        </Typography>
                        <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                            <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>{currentUser?.email?.charAt(0).toUpperCase()}</Avatar>
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            PaperProps={{ sx: { mt: 1.5, minWidth: 150 } }}
                        >
                            <MenuItem onClick={handleMenuClose}><ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon> Profile</MenuItem>
                            <Divider />
                            <MenuItem onClick={handleLogout} sx={{ color: '#f43f5e' }}><ListItemIcon><LogoutIcon fontSize="small" sx={{ color: '#f43f5e' }} /></ListItemIcon> Logout</MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, border: 'none' },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, border: 'none', borderRight: '1px solid rgba(255, 255, 255, 0.05)' },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, mt: 8, minHeight: '100vh' }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default Layout;
