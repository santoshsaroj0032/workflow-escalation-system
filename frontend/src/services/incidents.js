// import axios from './auth';
import axios from 'axios';

export const getIncidents = () => axios.get('/incidents/');
export const getIncident = (id) => axios.get(`/incidents/${id}/`);
export const createIncident = (data) => axios.post('/incidents/', data);
export const updateIncident = (id, data) => axios.put(`/incidents/${id}/`, data);
export const deleteIncident = (id) => axios.delete(`/incidents/${id}/`);