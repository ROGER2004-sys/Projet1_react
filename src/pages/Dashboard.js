// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { 
    Grid, 
    Paper, 
    Typography, 
    Box, 
    Card, 
    CardContent, 
    CircularProgress 
} from '@mui/material';
import { 
    Description as InvoiceIcon, 
    AccountBalanceWallet as RevenueIcon, 
    PendingActions as PendingIcon, 
    ErrorOutline as RejectedIcon 
} from '@mui/icons-material';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer, 
    LineChart, 
    Line 
} from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { getInvoices } from '../services/firebaseService';

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

const Dashboard = () => {
    const { isAdmin, currentUser } = useAuth();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        revenue: 0,
        pending: 0,
        rejected: 0,
        avgValue: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            const data = await getInvoices();
            setInvoices(data);
            
            const total = data.length;
            const revenue = data.filter(i => i.statut === 'Payée').reduce((acc, i) => acc + i.total_ttc, 0);
            const pending = data.filter(i => i.statut === 'En attente').length;
            const rejected = data.filter(i => i.statut === 'Rejetée').length;
            const avgValue = total > 0 ? revenue / total : 0;

            setStats({ total, revenue, pending, rejected, avgValue });
            setLoading(false);
        };
        fetchData();
    }, []);

    const chartData = [
        { name: 'Jan', amount: 4000 },
        { name: 'Feb', amount: 3000 },
        { name: 'Mar', amount: 2000 },
        { name: 'Apr', amount: 2780 },
        { name: 'May', amount: 1890 },
        { name: 'Jun', amount: 2390 },
    ];

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }} className="gradient-text">
                {isAdmin ? 'Admin Dashboard' : 'User Dashboard'}
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Total Invoices" value={stats.total} icon={<InvoiceIcon />} color="#6366f1" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Total Collected" value={`${stats.revenue.toLocaleString()} DH`} icon={<RevenueIcon />} color="#10b981" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Pending Invoices" value={stats.pending} icon={<PendingIcon />} color="#f59e0b" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Rejected" value={stats.rejected} icon={<RejectedIcon />} color="#f43f5e" />
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs={12} lg={8}>
                    <Paper className="glass-card" sx={{ p: 3, height: 400 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Monthly Revenue (DH)</Typography>
                        <ResponsiveContainer width="100%" height="90%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                                    itemStyle={{ color: '#f8fafc' }}
                                />
                                <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
                <Grid item xs={12} lg={4}>
                    <Paper className="glass-card" sx={{ p: 3, height: 400 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Avg. Invoice Value</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '80%' }}>
                            <Typography variant="h2" sx={{ fontWeight: 800, color: 'primary.main' }}>
                                {stats.avgValue.toFixed(0)}
                            </Typography>
                            <Typography variant="subtitle1" color="textSecondary">DH / Invoice</Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;