import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  CircularProgress,
  Chip
} from '@mui/material'

const IndustrySelection = () => {
  const [industries, setIndustries] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRole, setSelectedRole] = useState<any>(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Get selected role from localStorage
    const role = localStorage.getItem('selectedRole')
    if (role) {
      setSelectedRole(JSON.parse(role))
    } else {
      navigate('/')
    }
    
    fetchIndustries()
  }, [navigate])

  const fetchIndustries = async () => {
    try {
      const response = await fetch('/api/industries')
      const data = await response.json()
      setIndustries(data)
    } catch (error) {
      console.error('Error fetching industries:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleIndustrySelect = (industry: string) => {
    // Store selected industry and navigate to fluency table
    localStorage.setItem('selectedIndustry', industry)
    navigate('/fluency-table')
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Select Your Industry
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Choose your industry to generate a personalized AI fluency table for {selectedRole?.title}.
      </Typography>
      
      {selectedRole && (
        <Box mb={3}>
          <Chip 
            label={`Selected Role: ${selectedRole.title}`} 
            color="primary" 
            variant="outlined"
          />
        </Box>
      )}
      
      <Grid container spacing={3}>
        {industries.map((industry) => (
          <Grid item xs={12} sm={6} md={4} key={industry}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                '&:hover': { boxShadow: 3 }
              }}
              onClick={() => handleIndustrySelect(industry)}
            >
              <CardContent>
                <Typography variant="h6" component="h2">
                  {industry}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default IndustrySelection
