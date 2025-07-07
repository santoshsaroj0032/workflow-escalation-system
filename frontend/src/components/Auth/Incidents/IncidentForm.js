import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Button, Typography, Container, Box, TextField, 
  FormControl, InputLabel, Select, MenuItem, Alert 
} from '@mui/material';
// import AuthContext from '../../context/AuthContext';
import AuthContext from '../../../context/AuthContext';
import axios from 'axios';
// import axios from '../../Auth/services/auth';

function IncidentForm() {
  const [formData, setFormData] = useState({
    incident_type: 'Enterprise',
    details: '',
    priority: 'Medium',
    status: 'Open'
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        reporter_name: user.username
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.details) newErrors.details = 'Details are required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    
    if (validate()) {
      try {
        await axios.post('http://localhost:8000/api/incidents/', formData);
        setSuccess(true);
        setTimeout(() => navigate('/incidents'), 2000);
      } catch (error) {
        setApiError(error.response?.data?.error || 'Failed to create incident');
      }
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4">Create New Incident</Typography>
        
        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Incident created successfully! Redirecting...
          </Alert>
        )}
        
        {apiError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {apiError}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Incident Type</InputLabel>
            <Select
              name="incident_type"
              value={formData.incident_type}
              onChange={handleChange}
              label="Incident Type"
            >
              <MenuItem value="Enterprise">Enterprise</MenuItem>
              <MenuItem value="Government">Government</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            margin="normal"
            fullWidth
            label="Reporter Name"
            value={user?.username || ''}
            disabled
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            multiline
            rows={4}
            label="Incident Details"
            name="details"
            value={formData.details}
            onChange={handleChange}
            error={!!errors.details}
            helperText={errors.details}
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel>Priority</InputLabel>
            <Select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              label="Priority"
            >
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              label="Status"
            >
              <MenuItem value="Open">Open</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Closed">Closed</MenuItem>
            </Select>
          </FormControl>
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/incidents')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
            >
              Create Incident
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default IncidentForm;