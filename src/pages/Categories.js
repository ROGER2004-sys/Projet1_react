// src/pages/Categories.js
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
import { getCategories, addCategory, updateCategory, deleteCategory } from '../services/jsonService';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState({ nom: '' });
    const [isEditing, setIsEditing] = useState(false);

    const fetchCategories = async () => {
        setLoading(true);
        const data = await getCategories();
        setCategories(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleOpen = (cat = { nom: '' }) => {
        setCurrentCategory(cat);
        setIsEditing(!!cat.id);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentCategory({ nom: '' });
    };

    const handleSubmit = async () => {
        if (isEditing) {
            await updateCategory(currentCategory.id, currentCategory);
        } else {
            await addCategory(currentCategory);
        }
        handleClose();
        fetchCategories();
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            await deleteCategory(id);
            fetchCategories();
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }} className="gradient-text">Categories</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>Add Category</Button>
            </Box>

            <TableContainer component={Paper} className="glass-card" sx={{ p: 0 }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {categories.map((cat) => (
                                <TableRow key={cat.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell>{cat.nom}</TableCell>
                                    <TableCell align="right">
                                        <IconButton onClick={() => handleOpen(cat)} color="primary"><EditIcon /></IconButton>
                                        <IconButton onClick={() => handleDelete(cat.id)} color="error"><DeleteIcon /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>

            <Dialog open={open} onClose={handleClose} PaperProps={{ className: 'glass-card', sx: { minWidth: 400 } }}>
                <DialogTitle sx={{ fontWeight: 700 }}>{isEditing ? 'Edit Category' : 'Add New Category'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Category Name"
                        fullWidth
                        value={currentCategory.nom}
                        onChange={(e) => setCurrentCategory({ ...currentCategory, nom: e.target.value })}
                        sx={{ mt: 1 }}
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

export default Categories;