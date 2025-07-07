import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Button, Typography, Container, Box, TextField, 
  FormControl, InputLabel, Select, MenuItem, Alert 
} from '@mui/material';
 import AuthContext from '../../../context/AuthContext';
 import axios from '../../../services/auth';

function IncidentDetail() {
  const { incidentId } = useParams();
  const [formData, setFormData] = useState({
    incident_type: '',
    details: '',
    priority: '',
    status: '',
    can_edit: true
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIncident = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/incidents/${incidentId}/`);
        setFormData(response.data);
      } catch (error) {
        console.error('Failed to fetch incident', error);
        if (error.response?.status === 404) {
          navigate('/incidents', { replace: true });
        }
      }
    };
    
    fetchIncident();
  }, [incidentId, navigate]);

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
        await axios.put(`http://localhost:8000/api/incidents/${incidentId}/`, formData);
        setSuccess(true);
        setTimeout(() => navigate('/incidents'), 2000);
      } catch (error) {
        setApiError(error.response?.data?.error || 'Failed to update incident');
      }
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/incidents/${incidentId}/`);
      navigate('/incidents');
    } catch (error) {
      setApiError(error.response?.data?.error || 'Failed to delete incident');
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4">Incident Details: {incidentId}</Typography>
        
        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Incident updated successfully! Redirecting...
          </Alert>
        )}
        
        {apiError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {apiError}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <FormControl fullWidth margin="normal" disabled={!formData.can_edit}>
            <InputLabel>Incident Type</InputLabel>
            <Select
              name="incident_type"
              value={formData.incident_type}
              onChange={handleChange}
              label="Incident Type"
              disabled={!formData.can_edit}
            >
              <MenuItem value="Enterprise">Enterprise</MenuItem>
              <MenuItem value="Government">Government</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            margin="normal"
            fullWidth
            label="Reporter Name"
            value={formData.reporter_name || ''}
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
            disabled={!formData.can_edit}
          />
          
          <FormControl fullWidth margin="normal" disabled={!formData.can_edit}>
            <InputLabel>Priority</InputLabel>
            <Select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              label="Priority"
              disabled={!formData.can_edit}
            >
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl fullWidth margin="normal" disabled={!formData.can_edit}>
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              label="Status"
              disabled={!formData.can_edit}
            >
              <MenuItem value="Open">Open</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Closed">Closed</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            margin="normal"
            fullWidth
            label="Reported Date"
            value={new Date(formData.reported_date).toLocaleString()}
            disabled
          />
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              color="error"
              onClick={handleDelete}
              disabled={!formData.can_edit}
            >
              Delete Incident
            </Button>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/incidents')}
              >
                Back to List
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={!formData.can_edit}
              >
                Save Changes
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default IncidentDetail;