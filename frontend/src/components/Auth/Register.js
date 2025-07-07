import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TextField, Button, Typography, Container, Box, Link, 
  FormControl, InputLabel, Select, MenuItem, Alert 
} from '@mui/material';
import AuthContext from '../../context/AuthContext';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone_number: '',
    address: '',
    pincode: '',
    city: '',
    country: ''
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

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

  const handlePincodeChange = async (e) => {
    const pincode = e.target.value;
    handleChange(e);
    
    if (pincode.length === 6) {
      try {
        // Mock implementation - in production, call an actual API
        const mockData = {
          '110001': { city: 'New Delhi', country: 'India' },
          '400001': { city: 'Mumbai', country: 'India' },
          '600001': { city: 'Chennai', country: 'India' },
          '700001': { city: 'Kolkata', country: 'India' },
          '560001': { city: 'Bangalore', country: 'India' },
        };
        
        const location = mockData[pincode] || { city: '', country: '' };
        setFormData(prev => ({
          ...prev,
          city: location.city,
          country: location.country
        }));
      } catch (error) {
        console.error('Failed to fetch location data', error);
      }
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.phone_number) newErrors.phone_number = 'Phone number is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.pincode) newErrors.pincode = 'Pincode is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.country) newErrors.country = 'Country is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    
    if (validate()) {
      const result = await register(formData);
      if (result.success) {
        navigate('/login');
      } else {
        setApiError(result.message.error || 'Registration failed');
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          User Registration
        </Typography>
        {apiError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {apiError}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={formData.username}
            onChange={handleChange}
            error={!!errors.username}
            helperText={errors.username}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="phone_number"
            label="Phone Number"
            autoComplete="tel"
            value={formData.phone_number}
            onChange={handleChange}
            error={!!errors.phone_number}
            helperText={errors.phone_number}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="address"
            label="Address"
            multiline
            rows={2}
            value={formData.address}
            onChange={handleChange}
            error={!!errors.address}
            helperText={errors.address}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="pincode"
            label="Pincode"
            value={formData.pincode}
            onChange={handlePincodeChange}
            error={!!errors.pincode}
            helperText={errors.pincode}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="city"
            label="City"
            value={formData.city}
            onChange={handleChange}
            error={!!errors.city}
            helperText={errors.city}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="country"
            label="Country"
            value={formData.country}
            onChange={handleChange}
            error={!!errors.country}
            helperText={errors.country}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <Link href="/login" variant="body2">
              Already have an account? Sign in
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default Register;