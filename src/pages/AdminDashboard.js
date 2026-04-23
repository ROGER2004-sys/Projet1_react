// src/pages/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { 
    Grid, 
    Typography, 
    Box, 
    Paper, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Button,
    Chip
} from '@mui/material';
import { 
    CheckCircle as CheckIcon, 
    Pending as PendingIcon 
} from '@mui/icons-material';
import { getInvoices, updateInvoice } from '../services/firebaseService';
import DashboardStats from '../components/DashboardStats';

const AdminDashboard = () => {
    const [invoices, setInvoices] = useState([]);

    const fetchInvoices = async () => {
        const data = await getInvoices();
        setInvoices(data);
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    const handleValidate = async (id) => {
        await updateInvoice(id, { validated_by_admin: true });
        fetchInvoices();
    };

    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }} className="gradient-text">Admin Dashboard</Typography>
            
            <DashboardStats invoices={invoices} />

            <Typography variant="h5" sx={{ fontWeight: 600, mt: 4, mb: 2 }}>Invoices Pending Validation</Typography>
            <TableContainer component={Paper} className="glass-card" sx={{ p: 0 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Client</TableCell>
                            <TableCell>Total TTC</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Validation</TableCell>
                            <TableCell align="right">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {invoices.filter(i => !i.validated_by_admin).map((invoice) => (
                            <TableRow key={invoice.id}>
                                <TableCell>{invoice.client_id}</TableCell>
                                <TableCell>{invoice.total_ttc?.toFixed(2)} DH</TableCell>
                                <TableCell><Chip label={invoice.statut} color="warning" size="small" /></TableCell>
                                <TableCell><PendingIcon color="warning" /></TableCell>
                                <TableCell align="right">
                                    <Button 
                                        variant="contained" 
                                        color="success" 
                                        size="small" 
                                        startIcon={<CheckIcon />}
                                        onClick={() => handleValidate(invoice.id)}
                                    >
                                        Validate
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {invoices.filter(i => !i.validated_by_admin).length === 0 && (
                            <TableRow><TableCell colSpan={5} align="center">No pending validations</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default AdminDashboard;
