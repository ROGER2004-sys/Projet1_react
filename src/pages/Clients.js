// src/pages/Clients.js
import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Typography, 
    Button, 
    Paper, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    IconButton, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    TextField,
    CircularProgress
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { getClients, addClient, updateClient, deleteClient } from '../services/firebaseService';

const Clients = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [currentClient, setCurrentClient] = useState({ nom: '', email: '', tel: '', adresse: '' });
    const [isEditing, setIsEditing] = useState(false);

    const fetchClients = async () => {
        setLoading(true);
        const data = await getClients();
        setClients(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const handleOpen = (client = { nom: '', email: '', tel: '', adresse: '' }) => {
        setCurrentClient(client);
        setIsEditing(!!client.id);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentClient({ nom: '', email: '', tel: '', adresse: '' });
    };

    const handleSubmit = async () => {
        if (isEditing) {
            await updateClient(currentClient.id, currentClient);
        } else {
            await addClient(currentClient);
        }
        handleClose();
        fetchClients();
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this client?')) {
            await deleteClient(id);
            fetchClients();
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }} className="gradient-text">Clients</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>Add Client</Button>
            </Box>

            <TableContainer component={Paper} className="glass-card" sx={{ p: 0 }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Phone</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Address</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {clients.map((client) => (
                                <TableRow key={client.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell>{client.nom}</TableCell>
                                    <TableCell>{client.email}</TableCell>
                                    <TableCell>{client.tel}</TableCell>
                                    <TableCell>{client.adresse}</TableCell>
                                    <TableCell align="right">
                                        <IconButton onClick={() => handleOpen(client)} color="primary"><EditIcon /></IconButton>
                                        <IconButton onClick={() => handleDelete(client.id)} color="error"><DeleteIcon /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>

            <Dialog open={open} onClose={handleClose} PaperProps={{ className: 'glass-card', sx: { minWidth: 400 } }}>
                <DialogTitle sx={{ fontWeight: 700 }}>{isEditing ? 'Edit Client' : 'Add New Client'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Full Name"
                        fullWidth
                        variant="outlined"
                        value={currentClient.nom}
                        onChange={(e) => setCurrentClient({ ...currentClient, nom: e.target.value })}
                        sx={{ mt: 1 }}
                    />
                    <TextField
                        margin="dense"
                        label="Email Address"
                        fullWidth
                        variant="outlined"
                        value={currentClient.email}
                        onChange={(e) => setCurrentClient({ ...currentClient, email: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Phone Number"
                        fullWidth
                        variant="outlined"
                        value={currentClient.tel}
                        onChange={(e) => setCurrentClient({ ...currentClient, tel: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Address"
                        fullWidth
                        variant="outlined"
                        multiline
                        rows={2}
                        value={currentClient.adresse}
                        onChange={(e) => setCurrentClient({ ...currentClient, adresse: e.target.value })}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={handleClose} color="inherit">Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">{isEditing ? 'Update' : 'Create'}</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Clients;