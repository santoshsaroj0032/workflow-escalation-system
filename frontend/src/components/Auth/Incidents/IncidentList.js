import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Button, Typography, Container, Box, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Paper,
  TextField, IconButton, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { Add, Edit, Search } from '@mui/icons-material';
// import AuthContext from '../../context/AuthContext';
import AuthContext from '../../../context/AuthContext';
// import axios from '../../services/auth';
import axios from 'axios';

function IncidentList() {
  const [incidents, setIncidents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/incidents/');
        setIncidents(response.data);
      } catch (error) {
        console.error('Failed to fetch incidents', error);
        if (error.response?.status === 401) {
          logout();
        }
      }
    };
    
    fetchIncidents();
  }, [logout]);

  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = incident.incident_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority ? incident.priority === filterPriority : true;
    const matchesStatus = filterStatus ? incident.status === filterStatus : true;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Incidents</Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={() => navigate('/incidents/new')}
        >
          Create Incident
        </Button>
      </Box>
      
      <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          variant="outlined"
          placeholder="Search incidents..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search color="action" />,
          }}
        />
        
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Priority</InputLabel>
          <Select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            label="Priority"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="High">High</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            label="Status"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Open">Open</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Closed">Closed</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Incident ID</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Reported Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredIncidents.map((incident) => (
              <TableRow key={incident.incident_id}>
                <TableCell>{incident.incident_id}</TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {incident.details}
                </TableCell>
                <TableCell>{incident.incident_type}</TableCell>
                <TableCell>{incident.priority}</TableCell>
                <TableCell>{incident.status}</TableCell>
                <TableCell>
                  {new Date(incident.reported_date).toLocaleString()}
                </TableCell>
                <TableCell>
                  <IconButton 
                    onClick={() => navigate(`/incidents/${incident.incident_id}`)}
                    disabled={!incident.can_edit}
                  >
                    <Edit />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default IncidentList;