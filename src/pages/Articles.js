// src/pages/Articles.js
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
    MenuItem,
    CircularProgress
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { getArticles, addArticle, updateArticle, deleteArticle, getCategories } from '../services/jsonService';

const Articles = () => {
    const [articles, setArticles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [currentArticle, setCurrentArticle] = useState({ designation: '', prix_unitaire: '', categorie_id: '' });
    const [isEditing, setIsEditing] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        const [articlesData, categoriesData] = await Promise.all([getArticles(), getCategories()]);
        setArticles(articlesData);
        setCategories(categoriesData);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpen = (article = { designation: '', prix_unitaire: '', categorie_id: '' }) => {
        setCurrentArticle(article);
        setIsEditing(!!article.id);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentArticle({ designation: '', prix_unitaire: '', categorie_id: '' });
    };

    const handleSubmit = async () => {
        if (isEditing) {
            await updateArticle(currentArticle.id, currentArticle);
        } else {
            await addArticle(currentArticle);
        }
        handleClose();
        fetchData();
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            await deleteArticle(id);
            fetchData();
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }} className="gradient-text">Articles</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>Add Article</Button>
            </Box>

            <TableContainer component={Paper} className="glass-card" sx={{ p: 0 }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Designation</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Price (DH)</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {articles.map((article) => (
                                <TableRow key={article.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell>{article.designation}</TableCell>
                                    <TableCell>{article.prix_unitaire}</TableCell>
                                    <TableCell>{categories.find(c => c.id === article.categorie_id)?.nom || 'N/A'}</TableCell>
                                    <TableCell align="right">
                                        <IconButton onClick={() => handleOpen(article)} color="primary"><EditIcon /></IconButton>
                                        <IconButton onClick={() => handleDelete(article.id)} color="error"><DeleteIcon /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>

            <Dialog open={open} onClose={handleClose} PaperProps={{ className: 'glass-card', sx: { minWidth: 400 } }}>
                <DialogTitle sx={{ fontWeight: 700 }}>{isEditing ? 'Edit Article' : 'Add New Article'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Designation"
                        fullWidth
                        value={currentArticle.designation}
                        onChange={(e) => setCurrentArticle({ ...currentArticle, designation: e.target.value })}
                        sx={{ mt: 1 }}
                    />
                    <TextField
                        margin="dense"
                        label="Unit Price"
                        fullWidth
                        type="number"
                        value={currentArticle.prix_unitaire}
                        onChange={(e) => setCurrentArticle({ ...currentArticle, prix_unitaire: e.target.value })}
                    />
                    <TextField
                        select
                        margin="dense"
                        label="Category"
                        fullWidth
                        value={currentArticle.categorie_id}
                        onChange={(e) => setCurrentArticle({ ...currentArticle, categorie_id: e.target.value })}
                    >
                        {categories.map((cat) => (
                            <MenuItem key={cat.id} value={cat.id}>{cat.nom}</MenuItem>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={handleClose} color="inherit">Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">{isEditing ? 'Update' : 'Create'}</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Articles;