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

// No longer need Role interface since we're using free form search

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
  const [jobTitle, setJobTitle] = useState<string>('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');
  const [industries, setIndustries] = useState<string[]>([]);
  const [fluencyTable, setFluencyTable] = useState<FluencyTable | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAttemptedGeneration, setHasAttemptedGeneration] = useState(false);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [industriesResponse, resourcesResponse] = await Promise.all([
          axios.get('/api/industries'),
          axios.get('/api/resources')
        ]);
        
        setIndustries(industriesResponse.data);
        setResources(resourcesResponse.data);
      } catch (err) {
        setError('Failed to load initial data');
        console.error('Error loading data:', err);
      }
    };

    loadInitialData();
  }, []);

  // Reset table when job title or industry changes
  useEffect(() => {
    if (fluencyTable) {
      setFluencyTable(null);
      setHasAttemptedGeneration(false);
      setError(null);
    }
  }, [jobTitle, selectedIndustry]);

  const generateFluencyTable = async () => {
    if (!jobTitle.trim() || !selectedIndustry) return;

    setLoading(true);
    setError(null);
    setHasAttemptedGeneration(true);

    try {
      // Generate with AI using free form job title
      const response = await axios.post('/api/fluency-table', {
        roleTitle: jobTitle.trim(),
        industry: selectedIndustry
      });
      setFluencyTable(response.data);
    } catch (err) {
      setError('Failed to generate fluency table');
      console.error('Error generating table:', err);
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
              <TextField
                fullWidth
                label="Your Job Title"
                placeholder="e.g., Software Engineer, Data Scientist, Marketing Manager..."
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
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
                disabled={!jobTitle.trim() || !selectedIndustry || loading}
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
        {fluencyTable ? (
          <Card sx={{ mb: 4 }}>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                  AI Fluency Assessment for {jobTitle} in {selectedIndustry}
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
        ) : (
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                AI Fluency Assessment
              </Typography>
                <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
                  {!jobTitle.trim() || !selectedIndustry 
                    ? 'Please enter your job title and select your industry above, then click "Generate Table" to see your personalized AI fluency assessment.'
                    : hasAttemptedGeneration && !fluencyTable
                    ? 'Click "Generate Table" to create your personalized AI fluency assessment.'
                    : `Ready to generate your AI fluency assessment for ${jobTitle} in ${selectedIndustry}. Click "Generate Table" to begin.`
                  }
                </Typography>
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
