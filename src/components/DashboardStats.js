// src/components/DashboardStats.js
import React from 'react';
import { Grid, Box, Card, CardContent, Typography } from '@mui/material';
import { 
    Description as InvoiceIcon, 
    AccountBalanceWallet as RevenueIcon, 
    PendingActions as PendingIcon, 
    ErrorOutline as RejectedIcon 
} from '@mui/icons-material';

const StatCard = ({ title, value, icon, color }) => (
    <Card className="glass-card" sx={{ height: '100%' }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
            <Box sx={{ 
                p: 1.5, 
                borderRadius: 3, 
                bgcolor: `${color}15`, 
                color: color, 
                mr: 3,
                display: 'flex',
                alignItems: 'center'
            }}>
                {icon}
            </Box>
            <Box>
                <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 500, mb: 0.5 }}>{title}</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>{value}</Typography>
            </Box>
        </CardContent>
    </Card>
);

const DashboardStats = ({ invoices = [] }) => {
    const total = invoices.length;
    const revenue = invoices.filter(i => i.statut === 'Payée').reduce((acc, i) => acc + (i.total_ttc || 0), 0);
    const pending = invoices.filter(i => i.statut === 'En attente').length;
    const rejected = invoices.filter(i => i.statut === 'Rejetée').length;

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
                <StatCard title="Total Invoices" value={total} icon={<InvoiceIcon />} color="#6366f1" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <StatCard title="Total Collected" value={`${revenue.toLocaleString()} DH`} icon={<RevenueIcon />} color="#10b981" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <StatCard title="Pending Invoices" value={pending} icon={<PendingIcon />} color="#f59e0b" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <StatCard title="Rejected" value={rejected} icon={<RejectedIcon />} color="#f43f5e" />
            </Grid>
        </Grid>
    );
};

export default DashboardStats;
