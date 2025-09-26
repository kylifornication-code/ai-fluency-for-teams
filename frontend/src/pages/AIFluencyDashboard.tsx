import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link,
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Link as LinkIcon
} from '@mui/icons-material';
import axios from 'axios';

interface Role {
  id: string;
  title: string;
  industry: string;
}

interface Industry {
  name: string;
}

interface FluencyLevel {
  level: string;
  criteria: string[];
  examples: string[];
  tools: string[];
  skills: string[];
}

interface FluencyTable {
  roleId: string;
  industry: string;
  levels: FluencyLevel[];
  generatedAt: string;
  cached: boolean;
}

interface Resource {
  id: string;
  title: string;
  type: string;
  difficulty: string;
  estimatedTime: number;
  url: string;
  description: string;
}

const AIFluencyDashboard: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');
  const [roles, setRoles] = useState<Role[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [fluencyTable, setFluencyTable] = useState<FluencyTable | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [rolesResponse, industriesResponse, resourcesResponse] = await Promise.all([
          axios.get('/api/roles'),
          axios.get('/api/industries'),
          axios.get('/api/resources')
        ]);
        
        setRoles(rolesResponse.data);
        setIndustries(industriesResponse.data);
        setResources(resourcesResponse.data);
      } catch (err) {
        setError('Failed to load initial data');
        console.error('Error loading data:', err);
      }
    };

    loadInitialData();
  }, []);

  // Generate fluency table when both role and industry are selected
  useEffect(() => {
    if (selectedRole && selectedIndustry) {
      generateFluencyTable();
    }
  }, [selectedRole, selectedIndustry]);

  const generateFluencyTable = async () => {
    if (!selectedRole || !selectedIndustry) return;

    setLoading(true);
    setError(null);

    try {
      // Try AI-powered generation first
      const response = await axios.post('/api/fluency-table', {
        roleTitle: selectedRole.title,
        industry: selectedIndustry
      });
      setFluencyTable(response.data);
    } catch (err) {
      console.warn('AI generation failed, falling back to mock data:', err);
      try {
        // Fallback to mock data
        const fallbackResponse = await axios.get(
          `/api/fluency-table/${selectedRole.id}/${selectedIndustry}`
        );
        setFluencyTable(fallbackResponse.data);
      } catch (fallbackErr) {
        setError('Failed to generate fluency table');
        console.error('Error generating table:', fallbackErr);
      }
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'success';
      case 'beginner-intermediate':
        return 'info';
      case 'intermediate':
        return 'warning';
      case 'intermediate-advanced':
        return 'warning';
      case 'advanced':
        return 'error';
      default:
        return 'default';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'course':
        return <SchoolIcon />;
      case 'tutorial':
        return <WorkIcon />;
      case 'guide':
        return <WorkIcon />;
      case 'documentation':
        return <WorkIcon />;
      default:
        return <WorkIcon />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          AI Fluency Assessment
        </Typography>
        <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 4 }}>
          Discover your AI fluency level and find resources to improve
        </Typography>

        {/* Search and Selection */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Autocomplete
                options={roles}
                getOptionLabel={(option) => option.title}
                value={selectedRole}
                onChange={(_, newValue) => setSelectedRole(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search for your job title"
                    placeholder="e.g., Software Engineer, Marketing Manager"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Box>
                      <Typography variant="body1">{option.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {option.industry}
                      </Typography>
                    </Box>
                  </Box>
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Industry</InputLabel>
                <Select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  label="Industry"
                >
                  {industries.map((industry) => (
                    <MenuItem key={industry} value={industry}>
                      {industry}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                variant="contained"
                fullWidth
                onClick={generateFluencyTable}
                disabled={!selectedRole || !selectedIndustry || loading}
                sx={{ height: '56px' }}
              >
                {loading ? <CircularProgress size={24} /> : 'Generate Table'}
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Fluency Table */}
        {fluencyTable && (
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                AI Fluency Assessment for {selectedRole?.title} in {selectedIndustry}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Generated on {new Date(fluencyTable.generatedAt).toLocaleDateString()}
              </Typography>

              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Level</strong></TableCell>
                      <TableCell><strong>Criteria</strong></TableCell>
                      <TableCell><strong>Examples</strong></TableCell>
                      <TableCell><strong>Tools</strong></TableCell>
                      <TableCell><strong>Skills</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fluencyTable.levels.map((level, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Chip
                            label={level.level}
                            color={
                              level.level === 'Unskilled' ? 'error' :
                              level.level === 'Capable' ? 'warning' :
                              level.level === 'Adoptive' ? 'info' : 'success'
                            }
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <ul style={{ margin: 0, paddingLeft: '20px' }}>
                            {level.criteria.map((criterion, idx) => (
                              <li key={idx}>{criterion}</li>
                            ))}
                          </ul>
                        </TableCell>
                        <TableCell>
                          <ul style={{ margin: 0, paddingLeft: '20px' }}>
                            {level.examples.map((example, idx) => (
                              <li key={idx}>{example}</li>
                            ))}
                          </ul>
                        </TableCell>
                        <TableCell>
                          {level.tools.length > 0 ? (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {level.tools.map((tool, idx) => (
                                <Chip key={idx} label={tool} size="small" />
                              ))}
                            </Box>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              None
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          {level.skills.length > 0 ? (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {level.skills.map((skill, idx) => (
                                <Chip key={idx} label={skill} size="small" variant="outlined" />
                              ))}
                            </Box>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              None
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}

        {/* Learning Resources */}
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Learning Resources
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Curated resources to help you improve your AI fluency
            </Typography>

            <Grid container spacing={2}>
              {resources.map((resource) => (
                <Grid item xs={12} md={6} key={resource.id}>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Box sx={{ mr: 2, color: 'primary.main' }}>
                          {getTypeIcon(resource.type)}
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="h6">{resource.title}</Typography>
                          <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                            <Chip
                              label={resource.type}
                              size="small"
                              variant="outlined"
                            />
                            <Chip
                              label={resource.difficulty}
                              size="small"
                              color={getDifficultyColor(resource.difficulty) as any}
                            />
                            <Chip
                              label={`${resource.estimatedTime}h`}
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                        </Box>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        {resource.description}
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinkIcon fontSize="small" color="action" />
                        <Link
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          variant="body2"
                        >
                          View Resource
                        </Link>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default AIFluencyDashboard;
