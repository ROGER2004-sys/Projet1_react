// src/pages/Signup.js
import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Link, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nom, setNom] = useState('');
    const [tel, setTel] = useState('');
    const [adresse, setAdresse] = useState('');
    const [error, setError] = useState('');
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signup(email, password, { nom, tel, adresse });
            navigate('/');
        } catch (err) {
            setError('Failed to create an account: ' + err.message);
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 5, mb: 5, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Paper className="glass-card" sx={{ p: 4, width: '100%' }}>
                    <Typography variant="h4" gutterBottom align="center" className="gradient-text" sx={{ fontWeight: 700 }}>
                        Create Account
                    </Typography>
                    <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 3 }}>
                        Join us today! It's free and easy.
                    </Typography>
                    {error && <Typography color="error" variant="body2" sx={{ mb: 2 }}>{error}</Typography>}
                    <form onSubmit={handleSubmit}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Full Name"
                            value={nom}
                            onChange={(e) => setNom(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Phone Number"
                            value={tel}
                            onChange={(e) => setTel(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Address"
                            multiline
                            rows={2}
                            value={adresse}
                            onChange={(e) => setAdresse(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, height: 48 }}
                        >
                            Sign Up
                        </Button>
                        <Box sx={{ textAlign: 'center' }}>
                            <Link href="/login" variant="body2" sx={{ color: 'primary.main', textDecoration: 'none' }}>
                                Already have an account? Sign In
                            </Link>
                        </Box>
                    </form>
                </Paper>
            </Box>
        </Container>
    );
};

export default Signup;
