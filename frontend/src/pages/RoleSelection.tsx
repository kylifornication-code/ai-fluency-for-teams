import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  CircularProgress
} from '@mui/material'

interface Role {
  id: string
  title: string
  industry: string
}

const RoleSelection = () => {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchRoles()
  }, [])

  const fetchRoles = async () => {
    try {
      const response = await fetch('/api/roles')
      const data = await response.json()
      setRoles(data)
    } catch (error) {
      console.error('Error fetching roles:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRoleSelect = (role: Role) => {
    // Store selected role in localStorage for next step
    localStorage.setItem('selectedRole', JSON.stringify(role))
    navigate('/industry')
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
        Select Your Role
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Choose your job role to generate a personalized AI fluency table.
      </Typography>
      
      <Grid container spacing={3}>
        {roles.map((role) => (
          <Grid item xs={12} sm={6} md={4} key={role.id}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                '&:hover': { boxShadow: 3 }
              }}
              onClick={() => handleRoleSelect(role)}
            >
              <CardContent>
                <Typography variant="h6" component="h2">
                  {role.title}
                </Typography>
                <Typography color="text.secondary">
                  {role.industry}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default RoleSelection
