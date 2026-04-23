// src/pages/Settings.js
import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Typography, 
    Paper, 
    TextField, 
    Button, 
    Grid, 
    Alert 
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { getParametres, updateParametres } from '../services/jsonService';

const Settings = () => {
    const [params, setParams] = useState({
        id: "1",
        tva_informatique: 20,
        tva_services: 10,
        tva_formation: 0
    });
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchParams = async () => {
            const data = await getParametres();
            if (data.id) setParams(data);
        };
        fetchParams();
    }, []);

    const handleSave = async () => {
        await updateParametres(params.id, params);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
    };

    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }} className="gradient-text">Global Settings</Typography>
            
            <Paper className="glass-card" sx={{ p: 4, maxWidth: 600 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>TVA Rates (%)</Typography>
                
                {success && <Alert severity="success" sx={{ mb: 3 }}>Settings saved successfully!</Alert>}
                
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField 
                            label="TVA Informatique" 
                            type="number" 
                            fullWidth 
                            value={params.tva_informatique}
                            onChange={(e) => setParams({...params, tva_informatique: parseInt(e.target.value)})}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField 
                            label="TVA Services" 
                            type="number" 
                            fullWidth 
                            value={params.tva_services}
                            onChange={(e) => setParams({...params, tva_services: parseInt(e.target.value)})}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField 
                            label="TVA Formation" 
                            type="number" 
                            fullWidth 
                            value={params.tva_formation}
                            onChange={(e) => setParams({...params, tva_formation: parseInt(e.target.value)})}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button 
                            variant="contained" 
                            startIcon={<SaveIcon />} 
                            onClick={handleSave}
                            size="large"
                            fullWidth
                        >
                            Save Parameters
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default Settings;
