// src/pages/UserDashboard.js
import React, { useState, useEffect } from 'react';
import { 
    Typography, 
    Box, 
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
    Button,
    MenuItem,
    Chip
} from '@mui/material';
import { Edit as EditIcon, History as HistoryIcon } from '@mui/icons-material';
import { getInvoices, updateInvoice } from '../services/firebaseService';
import DashboardStats from '../components/DashboardStats';

const UserDashboard = () => {
    const [invoices, setInvoices] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentInvoice, setCurrentInvoice] = useState(null);

    const fetchInvoices = async () => {
        const data = await getInvoices();
        setInvoices(data);
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    const handleOpenTracking = (invoice) => {
        setCurrentInvoice({
            ...invoice,
            date_depot: invoice.date_depot || '',
            date_encaissement: invoice.date_encaissement || '',
            type_virement: invoice.type_virement || '',
            statut: invoice.statut || 'En attente'
        });
        setOpen(true);
    };

    const handleUpdateTracking = async () => {
        await updateInvoice(currentInvoice.id, currentInvoice);
        setOpen(false);
        fetchInvoices();
    };

    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }} className="gradient-text">My Workspace</Typography>
            
            <DashboardStats invoices={invoices} />

            <Typography variant="h5" sx={{ fontWeight: 600, mt: 4, mb: 2 }}>Invoice Tracking & Follow-up</Typography>
            <TableContainer component={Paper} className="glass-card" sx={{ p: 0 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Client</TableCell>
                            <TableCell>Dépôt</TableCell>
                            <TableCell>Encaissement</TableCell>
                            <TableCell>Virement</TableCell>
                            <TableCell>Statut</TableCell>
                            <TableCell align="right">Follow-up</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {invoices.map((invoice) => (
                            <TableRow key={invoice.id}>
                                <TableCell>{invoice.client_id}</TableCell>
                                <TableCell>{invoice.date_depot || '-'}</TableCell>
                                <TableCell>{invoice.date_encaissement || '-'}</TableCell>
                                <TableCell>{invoice.type_virement || '-'}</TableCell>
                                <TableCell>
                                    <Chip 
                                        label={invoice.statut} 
                                        color={invoice.statut === 'Payée' ? 'success' : invoice.statut === 'Rejetée' ? 'error' : 'warning'} 
                                        size="small" 
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => handleOpenTracking(invoice)} color="primary">
                                        <EditIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)} PaperProps={{ className: 'glass-card' }}>
                <DialogTitle sx={{ fontWeight: 700 }}>Follow-up Invoice</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Date de dépôt"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={currentInvoice?.date_depot}
                        onChange={(e) => setCurrentInvoice({...currentInvoice, date_depot: e.target.value})}
                        sx={{ mt: 1 }}
                    />
                    <TextField
                        margin="dense"
                        label="Date d'encaissement"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={currentInvoice?.date_encaissement}
                        onChange={(e) => setCurrentInvoice({...currentInvoice, date_encaissement: e.target.value})}
                    />
                    <TextField
                        select
                        margin="dense"
                        label="Type de virement"
                        fullWidth
                        value={currentInvoice?.type_virement}
                        onChange={(e) => setCurrentInvoice({...currentInvoice, type_virement: e.target.value})}
                    >
                        <MenuItem value="Virement Bancaire">Virement Bancaire</MenuItem>
                        <MenuItem value="Chèque">Chèque</MenuItem>
                        <MenuItem value="Espèces">Espèces</MenuItem>
                    </TextField>
                    <TextField
                        select
                        margin="dense"
                        label="Statut"
                        fullWidth
                        value={currentInvoice?.statut}
                        onChange={(e) => setCurrentInvoice({...currentInvoice, statut: e.target.value})}
                    >
                        <MenuItem value="En attente">En attente</MenuItem>
                        <MenuItem value="Payée">Payée</MenuItem>
                        <MenuItem value="Rejetée">Rejetée</MenuItem>
                    </TextField>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpen(false)} color="inherit">Cancel</Button>
                    <Button onClick={handleUpdateTracking} variant="contained">Update Tracking</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UserDashboard;
