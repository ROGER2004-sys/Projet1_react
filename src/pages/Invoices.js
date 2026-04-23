// src/pages/Invoices.js
import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Typography, 
    Button, 
    Paper, 
    Grid, 
    TextField, 
    MenuItem, 
    IconButton, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow,
    Divider,
    FormControl,
    InputLabel,
    Select,
    Card,
    CardContent,
    Tabs,
    Tab
} from '@mui/material';
import { 
    Add as AddIcon, 
    Delete as DeleteIcon, 
    PictureAsPdf as PdfIcon, 
    Save as SaveIcon,
    ShoppingCart as CartIcon
} from '@mui/icons-material';
import { getClients, addInvoice } from '../services/firebaseService';
import { getArticles, getCategories, getParametres } from '../services/jsonService';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Invoices = () => {
    const [clients, setClients] = useState([]);
    const [articles, setArticles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [parametres, setParametres] = useState({});
    
    const [selectedClient, setSelectedClient] = useState('');
    const [invoiceItems, setInvoiceItems] = useState([]);
    const [billingMethod, setBillingMethod] = useState(0); // 0: Simple, 1: Line Discount, 2: Global Discount, 3: Category TVA
    const [globalDiscount, setGlobalDiscount] = useState(0);

    const [totals, setTotals] = useState({ ht: 0, tva: 0, ttc: 0 });

    useEffect(() => {
        const fetchData = async () => {
            const [c, a, cat, p] = await Promise.all([
                getClients(),
                getArticles(),
                getCategories(),
                getParametres()
            ]);
            setClients(c);
            setArticles(a);
            setCategories(cat);
            setParametres(p);
        };
        fetchData();
    }, []);

    const addItem = (articleId) => {
        const article = articles.find(a => a.id === articleId);
        if (!article) return;
        setInvoiceItems([...invoiceItems, { 
            ...article, 
            quantity: 1, 
            discount: 0 
        }]);
    };

    const removeItem = (index) => {
        setInvoiceItems(invoiceItems.filter((_, i) => i !== index));
    };

    const updateItem = (index, field, value) => {
        const updated = [...invoiceItems];
        updated[index][field] = value;
        setInvoiceItems(updated);
    };

    useEffect(() => {
        calculateTotals();
    }, [invoiceItems, billingMethod, globalDiscount]);

    const calculateTotals = () => {
        let ht = 0;
        let tva = 0;

        if (billingMethod === 0) { // Simple HT + TVA (20%)
            ht = invoiceItems.reduce((acc, item) => acc + (item.quantity * item.prix_unitaire), 0);
            tva = ht * 0.20;
        } 
        else if (billingMethod === 1) { // Remise par ligne
            ht = invoiceItems.reduce((acc, item) => {
                const sub = item.quantity * item.prix_unitaire;
                return acc + (sub - (sub * (item.discount / 100)));
            }, 0);
            tva = ht * 0.20;
        }
        else if (billingMethod === 2) { // Remise globale
            const rawHt = invoiceItems.reduce((acc, item) => acc + (item.quantity * item.prix_unitaire), 0);
            ht = rawHt - (rawHt * (globalDiscount / 100));
            tva = ht * 0.20;
        }
        else if (billingMethod === 3) { // Category-based TVA
            ht = invoiceItems.reduce((acc, item) => acc + (item.quantity * item.prix_unitaire), 0);
            tva = invoiceItems.reduce((acc, item) => {
                const itemTotal = item.quantity * item.prix_unitaire;
                const cat = categories.find(c => c.id === item.categorie_id);
                let rate = 0.20; // Default
                if (cat?.nom === 'Informatique') rate = 0.20;
                if (cat?.nom === 'Services') rate = 0.10;
                if (cat?.nom === 'Formation') rate = 0;
                return acc + (itemTotal * rate);
            }, 0);
        }

        setTotals({ ht, tva, ttc: ht + tva });
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        const client = clients.find(c => c.id === selectedClient);
        
        // Header
        doc.setFontSize(22);
        doc.setTextColor(99, 102, 241);
        doc.text('FACTURE', 105, 20, { align: 'center' });
        
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text('Votre Entreprise S.A.', 20, 40);
        doc.text('Contact: contact@entreprise.com', 20, 45);
        
        doc.text('Facturé à:', 140, 40);
        doc.setFont(undefined, 'bold');
        doc.text(client?.nom || 'Client Inconnu', 140, 45);
        doc.setFont(undefined, 'normal');
        doc.text(client?.adresse || '', 140, 50);
        doc.text(client?.tel || '', 140, 55);

        // Table
        const body = invoiceItems.map(item => [
            item.designation, 
            item.quantity, 
            `${item.prix_unitaire} DH`, 
            billingMethod === 1 ? `${item.discount}%` : '0%',
            `${(item.quantity * item.prix_unitaire).toFixed(2)} DH`
        ]);

        doc.autoTable({
            startY: 70,
            head: [['Designation', 'Qté', 'P.U', 'Remise', 'Total']],
            body: body,
            theme: 'striped',
            headStyles: { fillColor: [99, 102, 241] }
        });

        // Totals
        const finalY = doc.lastAutoTable.finalY + 10;
        doc.text(`Total HT: ${totals.ht.toFixed(2)} DH`, 140, finalY);
        doc.text(`TVA: ${totals.tva.toFixed(2)} DH`, 140, finalY + 7);
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text(`TOTAL TTC: ${totals.ttc.toFixed(2)} DH`, 140, finalY + 15);

        // Signature
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text('Signature', 160, finalY + 40);
        doc.line(140, finalY + 45, 190, finalY + 45);

        doc.save(`Facture_${Date.now()}.pdf`);
    };

    const handleSave = async () => {
        if (!selectedClient || invoiceItems.length === 0) {
            alert('Please select a client and add at least one item.');
            return;
        }
        await addInvoice({
            client_id: selectedClient,
            articles: invoiceItems,
            billingMethod,
            globalDiscount,
            total_ht: totals.ht,
            tva: totals.tva,
            total_ttc: totals.ttc,
            statut: 'En attente'
        });
        alert('Invoice saved successfully!');
    };

    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }} className="gradient-text">New Invoice</Typography>
            
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Card className="glass-card" sx={{ p: 0, mb: 3 }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={billingMethod} onChange={(_, v) => setBillingMethod(v)} variant="fullWidth">
                                <Tab label="Simple HT+TVA" />
                                <Tab label="Remise Ligne" />
                                <Tab label="Remise Globale" />
                                <Tab label="TVA Catégorie" />
                            </Tabs>
                        </Box>
                        <CardContent>
                            <Grid container spacing={2} sx={{ mb: 3 }}>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Select Client</InputLabel>
                                        <Select value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)} label="Select Client">
                                            {clients.map(c => <MenuItem key={c.id} value={c.id}>{c.nom}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Add Article</InputLabel>
                                        <Select value="" onChange={(e) => addItem(e.target.value)} label="Add Article">
                                            {articles.map(a => <MenuItem key={a.id} value={a.id}>{a.designation} ({a.prix_unitaire} DH)</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Item</TableCell>
                                            <TableCell>Price</TableCell>
                                            <TableCell>Quantity</TableCell>
                                            {billingMethod === 1 && <TableCell>Discount %</TableCell>}
                                            <TableCell>Total</TableCell>
                                            <TableCell align="right"></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {invoiceItems.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{item.designation}</TableCell>
                                                <TableCell>{item.prix_unitaire} DH</TableCell>
                                                <TableCell>
                                                    <TextField 
                                                        type="number" 
                                                        size="small" 
                                                        value={item.quantity} 
                                                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)} 
                                                        sx={{ width: 70 }}
                                                    />
                                                </TableCell>
                                                {billingMethod === 1 && (
                                                    <TableCell>
                                                        <TextField 
                                                            type="number" 
                                                            size="small" 
                                                            value={item.discount} 
                                                            onChange={(e) => updateItem(index, 'discount', parseInt(e.target.value) || 0)} 
                                                            sx={{ width: 70 }}
                                                        />
                                                    </TableCell>
                                                )}
                                                <TableCell>{(item.quantity * item.prix_unitaire).toFixed(2)} DH</TableCell>
                                                <TableCell align="right">
                                                    <IconButton onClick={() => removeItem(index)} color="error"><DeleteIcon /></IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            
                            {billingMethod === 2 && (
                                <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Typography variant="body1">Global Discount (%):</Typography>
                                    <TextField 
                                        type="number" 
                                        size="small" 
                                        value={globalDiscount} 
                                        onChange={(e) => setGlobalDiscount(parseInt(e.target.value) || 0)} 
                                        sx={{ width: 100 }}
                                    />
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card className="glass-card" sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>Summary</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography color="textSecondary">Subtotal HT</Typography>
                            <Typography sx={{ fontWeight: 600 }}>{totals.ht.toFixed(2)} DH</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography color="textSecondary">TVA (Tax)</Typography>
                            <Typography sx={{ fontWeight: 600 }}>{totals.tva.toFixed(2)} DH</Typography>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>Total TTC</Typography>
                            <Typography variant="h5" color="primary" sx={{ fontWeight: 800 }}>{totals.ttc.toFixed(2)} DH</Typography>
                        </Box>
                        
                        <Button 
                            variant="contained" 
                            fullWidth 
                            size="large" 
                            startIcon={<SaveIcon />} 
                            onClick={handleSave}
                            sx={{ mb: 2 }}
                        >
                            Save Invoice
                        </Button>
                        <Button 
                            variant="outlined" 
                            fullWidth 
                            size="large" 
                            startIcon={<PdfIcon />} 
                            onClick={generatePDF}
                        >
                            Download PDF
                        </Button>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Invoices;