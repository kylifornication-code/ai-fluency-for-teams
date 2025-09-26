import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Typography,
  Button,
  Box,
  CircularProgress,
  Chip,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

interface FluencyLevel {
  level: string
  criteria: string[]
  examples: string[]
  tools: string[]
  skills: string[]
}

interface FluencyTableData {
  roleId: string
  industry: string
  levels: FluencyLevel[]
  generatedAt: string
  cached: boolean
}

const FluencyTable = () => {
  const [tableData, setTableData] = useState<FluencyTableData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedRole, setSelectedRole] = useState<any>(null)
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Get selected role and industry from localStorage
    const role = localStorage.getItem('selectedRole')
    const industry = localStorage.getItem('selectedIndustry')
    
    if (role && industry) {
      setSelectedRole(JSON.parse(role))
      setSelectedIndustry(industry)
      fetchFluencyTable(JSON.parse(role).id, industry)
    } else {
      navigate('/')
    }
  }, [navigate])

  const fetchFluencyTable = async (roleId: string, industry: string) => {
    try {
      const response = await fetch(`/api/fluency-table/${roleId}/${industry}`)
      const data = await response.json()
      setTableData(data)
    } catch (error) {
      console.error('Error fetching fluency table:', error)
    } finally {
      setLoading(false)
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Unacceptable': return 'error'
      case 'Capable': return 'warning'
      case 'Adoptive': return 'info'
      case 'Transformative': return 'success'
      default: return 'default'
    }
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
        AI Fluency Table
      </Typography>
      
      {selectedRole && selectedIndustry && (
        <Box mb={3}>
          <Chip 
            label={`${selectedRole.title} in ${selectedIndustry}`} 
            color="primary" 
            variant="outlined"
            sx={{ mr: 1 }}
          />
          <Chip 
            label={`Generated: ${new Date(tableData?.generatedAt || '').toLocaleString()}`} 
            color="secondary" 
            variant="outlined"
          />
        </Box>
      )}

      {tableData && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Fluency Levels
          </Typography>
          
          {tableData.levels.map((level, index) => (
            <Accordion key={level.level} defaultExpanded={index === 0}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box display="flex" alignItems="center" width="100%">
                  <Chip 
                    label={level.level} 
                    color={getLevelColor(level.level) as any}
                    sx={{ mr: 2 }}
                  />
                  <Typography variant="h6">
                    {level.level} Level
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Criteria:</strong>
                    </Typography>
                    <ul>
                      {level.criteria.map((criterion, idx) => (
                        <li key={idx}>{criterion}</li>
                      ))}
                    </ul>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Examples:</strong>
                    </Typography>
                    <ul>
                      {level.examples.map((example, idx) => (
                        <li key={idx}>{example}</li>
                      ))}
                    </ul>
                  </Grid>
                  {level.tools.length > 0 && (
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" gutterBottom>
                        <strong>Tools:</strong>
                      </Typography>
                      <Box display="flex" flexWrap="wrap" gap={1}>
                        {level.tools.map((tool, idx) => (
                          <Chip key={idx} label={tool} size="small" />
                        ))}
                      </Box>
                    </Grid>
                  )}
                  {level.skills.length > 0 && (
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" gutterBottom>
                        <strong>Skills:</strong>
                      </Typography>
                      <Box display="flex" flexWrap="wrap" gap={1}>
                        {level.skills.map((skill, idx) => (
                          <Chip key={idx} label={skill} size="small" variant="outlined" />
                        ))}
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))}
          
          <Box mt={3} display="flex" gap={2}>
            <Button 
              variant="contained" 
              onClick={() => navigate('/resources')}
            >
              View Learning Resources
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/')}
            >
              Start Over
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default FluencyTable
