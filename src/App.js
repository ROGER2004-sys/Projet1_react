import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './routes/PrivateRoute';
import Layout from './components/Layout';

// Pages
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import DashboardRedirect from './pages/DashboardRedirect';
import Clients from './pages/Clients';
import Invoices from './pages/Invoices';
import Articles from './pages/Articles';
import Categories from './pages/Categories';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1',
    },
    background: {
      default: '#0f172a',
      paper: '#1e293b',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#94a3b8',
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 20px',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            <Route path="/" element={
              <PrivateRoute>
                <DashboardRedirect />
              </PrivateRoute>
            } />

            <Route path="/admin" element={
              <PrivateRoute adminOnly>
                <Layout><AdminDashboard /></Layout>
              </PrivateRoute>
            } />

            <Route path="/user" element={
              <PrivateRoute>
                <Layout><UserDashboard /></Layout>
              </PrivateRoute>
            } />
            
            <Route path="/clients" element={
              <PrivateRoute>
                <Layout><Clients /></Layout>
              </PrivateRoute>
            } />
            
            <Route path="/invoices" element={
              <PrivateRoute>
                <Layout><Invoices /></Layout>
              </PrivateRoute>
            } />
            
            <Route path="/articles" element={
              <PrivateRoute adminOnly>
                <Layout><Articles /></Layout>
              </PrivateRoute>
            } />
            
            <Route path="/categories" element={
              <PrivateRoute adminOnly>
                <Layout><Categories /></Layout>
              </PrivateRoute>
            } />

            <Route path="/settings" element={
              <PrivateRoute adminOnly>
                <Layout><Settings /></Layout>
              </PrivateRoute>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
