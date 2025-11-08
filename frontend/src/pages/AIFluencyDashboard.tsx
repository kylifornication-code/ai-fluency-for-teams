import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
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
  Divider,
  Fade,
  Zoom,
  LinearProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Link as LinkIcon,
  AutoAwesome as AutoAwesomeIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Lightbulb as LightbulbIcon,
  ContentCopy as ContentCopyIcon
} from '@mui/icons-material';
import axios from 'axios';

// Note: Industry interface removed - using string array directly

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

interface PromptCategory {
  name: string;
  description: string;
  prompts: string[];
}

interface JobPrompts {
  roleTitle: string;
  industry: string;
  categories: PromptCategory[];
  generatedAt: string;
  cached: boolean;
}

interface AIFluencyDashboardProps {
  darkMode: boolean;
}

const AIFluencyDashboard: React.FC<AIFluencyDashboardProps> = ({ darkMode }) => {
  const [jobTitle, setJobTitle] = useState<string>('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');
  const [industries, setIndustries] = useState<string[]>([]);
  const [fluencyTable, setFluencyTable] = useState<FluencyTable | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAttemptedGeneration, setHasAttemptedGeneration] = useState(false);
  const [context, setContext] = useState<string>('');
  const [showContextInput, setShowContextInput] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [jobPrompts, setJobPrompts] = useState<JobPrompts | null>(null);
  const [loadingPrompts, setLoadingPrompts] = useState(false);
  const [promptsError, setPromptsError] = useState<string | null>(null);
  const contextRef = useRef<HTMLDivElement>(null);
  const promptsRef = useRef<HTMLDivElement>(null);

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
      setContext('');
      setShowContextInput(false);
    }
    if (jobPrompts) {
      setJobPrompts(null);
      setPromptsError(null);
    }
  }, [jobTitle, selectedIndustry]);

  const generateFluencyTable = async () => {
    if (!jobTitle.trim() || !selectedIndustry) return;

    setLoading(true);
    setError(null);
    setHasAttemptedGeneration(true);
    setLoadingProgress(0);

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 15;
      });
    }, 200);

    try {
      // Generate with AI using free form job title and optional context
      const response = await axios.post('/api/fluency-table', {
        roleTitle: jobTitle.trim(),
        industry: selectedIndustry,
        context: context.trim() || undefined
      });
      
      setLoadingProgress(100);
      setTimeout(() => {
        setFluencyTable(response.data);
        setLoading(false);
        setLoadingProgress(0);
      }, 500);
    } catch (err) {
      setError('Failed to generate fluency table');
      console.error('Error generating table:', err);
      setLoading(false);
      setLoadingProgress(0);
    } finally {
      clearInterval(progressInterval);
    }
  };

  const scrollToContext = () => {
    contextRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'center'
    });
  };

  const generateJobPrompts = async () => {
    if (!jobTitle.trim() || !selectedIndustry) return;

    setLoadingPrompts(true);
    setPromptsError(null);

    try {
      const response = await axios.post('/api/job-prompts', {
        roleTitle: jobTitle.trim(),
        industry: selectedIndustry,
        context: context.trim() || undefined
      });
      
      setJobPrompts(response.data);
      setLoadingPrompts(false);
      
      // Scroll to prompts section
      setTimeout(() => {
        promptsRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    } catch (err) {
      setPromptsError('Failed to generate job prompts');
      console.error('Error generating prompts:', err);
      setLoadingPrompts(false);
    }
  };

  const copyPromptToClipboard = (prompt: string) => {
    navigator.clipboard.writeText(prompt).then(() => {
      // You could add a toast notification here if desired
    }).catch(err => {
      console.error('Failed to copy prompt:', err);
    });
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
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3 }}>
          <img 
            src="/logo.png" 
            alt="AI Fluency Logo" 
            style={{ 
              height: '80px', 
              width: 'auto',
              marginRight: '16px'
            }} 
          />
          <Typography variant="h3" component="h1" gutterBottom>
            AI Fluency Assessment
          </Typography>
        </Box>
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
                {loading ? <CircularProgress size={24} /> : 'Generate Assessment'}
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
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Generated on {new Date(fluencyTable.generatedAt).toLocaleDateString()}
                </Typography>
                <Tooltip title="Refine this assessment with additional context">
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={scrollToContext}
                    sx={{ 
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 500
                    }}
                  >
                    Refine Assessment
                  </Button>
                </Tooltip>
              </Box>

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
        ) : null}

        {/* Context Enhancement Section - Only show after table is generated */}
        {fluencyTable && (
          <Card sx={{ mb: 4 }} ref={contextRef}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Enhance Your Assessment
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Add more context about your specific role to get a more personalized and relevant assessment.
              </Typography>
              
              {!showContextInput ? (
                <Button
                  variant="outlined"
                  onClick={() => setShowContextInput(true)}
                  startIcon={<EditIcon />}
                  sx={{ 
                    mb: 2,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500
                  }}
                >
                  Add Context to Refine Assessment
                </Button>
              ) : (
                <Fade in timeout={300}>
                  <Box sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Additional Context"
                      placeholder="e.g., I work primarily with cloud infrastructure, manage a team of 5 developers, focus on security compliance, use AWS and Kubernetes daily..."
                      value={context}
                      onChange={(e) => setContext(e.target.value)}
                      helperText="Describe your specific responsibilities, team size, technologies you use, or any other relevant details"
                      sx={{ 
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button
                        variant="contained"
                        onClick={generateFluencyTable}
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} /> : <RefreshIcon />}
                        sx={{ 
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 500,
                          background: darkMode 
                            ? 'linear-gradient(45deg, #90caf9 30%, #f48fb1 90%)'
                            : 'linear-gradient(45deg, #1976d2 30%, #dc004e 90%)',
                        }}
                      >
                        {loading ? 'Regenerating...' : 'Regenerate with Context'}
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setShowContextInput(false);
                          setContext('');
                        }}
                        sx={{ 
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 500
                        }}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                </Fade>
              )}
            </CardContent>
          </Card>
        )}

        {/* Job Prompts Section - Only show after table is generated */}
        {fluencyTable && (
          <Card sx={{ mb: 4 }} ref={promptsRef}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LightbulbIcon color="primary" />
                    AI Prompts for Your Role
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Discover useful AI prompts organized by category to help you in your daily work as a {jobTitle} in {selectedIndustry}
                  </Typography>
                </Box>
                {!jobPrompts && (
                  <Button
                    variant="contained"
                    onClick={generateJobPrompts}
                    disabled={loadingPrompts}
                    startIcon={loadingPrompts ? <CircularProgress size={20} /> : <AutoAwesomeIcon />}
                    sx={{ 
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 500,
                      background: darkMode 
                        ? 'linear-gradient(45deg, #90caf9 30%, #f48fb1 90%)'
                        : 'linear-gradient(45deg, #1976d2 30%, #dc004e 90%)',
                    }}
                  >
                    {loadingPrompts ? 'Generating...' : 'Generate Prompts'}
                  </Button>
                )}
              </Box>

              {promptsError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {promptsError}
                </Alert>
              )}

              {loadingPrompts && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
                  <CircularProgress sx={{ mb: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    Generating personalized prompts for your role...
                  </Typography>
                </Box>
              )}

              {jobPrompts && jobPrompts.categories.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Generated on {new Date(jobPrompts.generatedAt).toLocaleDateString()}
                    {jobPrompts.cached && (
                      <Chip label="Cached" size="small" sx={{ ml: 1 }} color="info" variant="outlined" />
                    )}
                  </Typography>
                  
                  <Grid container spacing={3}>
                    {jobPrompts.categories.map((category, categoryIndex) => (
                      <Grid item xs={12} md={6} key={categoryIndex}>
                        <Fade in timeout={600 + categoryIndex * 100}>
                          <Accordion
                            defaultExpanded={categoryIndex < 2}
                            sx={{
                              borderRadius: 2,
                              '&:before': { display: 'none' },
                              boxShadow: darkMode 
                                ? '0 2px 8px rgba(0,0,0,0.3)' 
                                : '0 2px 8px rgba(0,0,0,0.1)',
                            }}
                          >
                            <AccordionSummary 
                              expandIcon={<ExpandMoreIcon />}
                              sx={{ 
                                borderRadius: 2,
                                '&.Mui-expanded': {
                                  borderRadius: '8px 8px 0 0',
                                }
                              }}
                            >
                              <Box sx={{ width: '100%' }}>
                                <Typography variant="h6" sx={{ fontWeight: 500, mb: 0.5 }}>
                                  {category.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {category.description}
                                </Typography>
                              </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {category.prompts.map((prompt, promptIndex) => (
                                  <Paper
                                    key={promptIndex}
                                    elevation={0}
                                    sx={{
                                      p: 2,
                                      bgcolor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                                      border: '1px solid',
                                      borderColor: darkMode ? '#333' : '#e0e0e0',
                                      borderRadius: 2,
                                      position: 'relative',
                                      '&:hover': {
                                        borderColor: 'primary.main',
                                        bgcolor: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                                      }
                                    }}
                                  >
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                      <Typography 
                                        variant="body2" 
                                        sx={{ 
                                          flex: 1,
                                          lineHeight: 1.6,
                                          pr: 4
                                        }}
                                      >
                                        {prompt}
                                      </Typography>
                                      <Tooltip title="Copy prompt">
                                        <IconButton
                                          size="small"
                                          onClick={() => copyPromptToClipboard(prompt)}
                                          sx={{
                                            position: 'absolute',
                                            top: 8,
                                            right: 8,
                                            color: 'text.secondary',
                                            '&:hover': {
                                              color: 'primary.main',
                                            }
                                          }}
                                        >
                                          <ContentCopyIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                    </Box>
                                  </Paper>
                                ))}
                              </Box>
                            </AccordionDetails>
                          </Accordion>
                        </Fade>
                      </Grid>
                    ))}
                  </Grid>

                  {jobPrompts && (
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                      <Button
                        variant="outlined"
                        onClick={generateJobPrompts}
                        disabled={loadingPrompts}
                        startIcon={loadingPrompts ? <CircularProgress size={20} /> : <RefreshIcon />}
                        sx={{ 
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 500
                        }}
                      >
                        {loadingPrompts ? 'Regenerating...' : 'Regenerate Prompts'}
                      </Button>
                    </Box>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        )}

        {!fluencyTable && (
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
        <Zoom in timeout={1000}>
          <Card 
            elevation={0}
            sx={{ 
              background: darkMode 
                ? 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)'
                : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              border: '1px solid',
              borderColor: darkMode ? '#333' : '#e0e0e0',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography 
                variant="h5" 
                gutterBottom
                sx={{ 
                  fontWeight: 600,
                  mb: 1
                }}
              >
                Learning Resources
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ mb: 4 }}
              >
                Curated resources to help you improve your AI fluency
              </Typography>

              <Grid container spacing={3}>
                {resources.map((resource, index) => (
                  <Grid item xs={12} md={6} key={resource.id}>
                    <Fade in timeout={800 + index * 100}>
                      <Accordion
                        sx={{
                          borderRadius: 2,
                          '&:before': { display: 'none' },
                          boxShadow: darkMode 
                            ? '0 2px 8px rgba(0,0,0,0.3)' 
                            : '0 2px 8px rgba(0,0,0,0.1)',
                        }}
                      >
                        <AccordionSummary 
                          expandIcon={<ExpandMoreIcon />}
                          sx={{ 
                            borderRadius: 2,
                            '&.Mui-expanded': {
                              borderRadius: '8px 8px 0 0',
                            }
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <Box sx={{ mr: 2, color: 'primary.main' }}>
                              {getTypeIcon(resource.type)}
                            </Box>
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                                {resource.title}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                                <Chip
                                  label={resource.type}
                                  size="small"
                                  variant="outlined"
                                  sx={{ borderRadius: 1 }}
                                />
                                <Chip
                                  label={resource.difficulty}
                                  size="small"
                                  color={getDifficultyColor(resource.difficulty) as any}
                                  sx={{ borderRadius: 1 }}
                                />
                                <Chip
                                  label={`${resource.estimatedTime}h`}
                                  size="small"
                                  variant="outlined"
                                  sx={{ borderRadius: 1 }}
                                />
                              </Box>
                            </Box>
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails sx={{ pt: 0 }}>
                          <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>
                            {resource.description}
                          </Typography>
                          <Divider sx={{ my: 2 }} />
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LinkIcon fontSize="small" color="action" />
                            <Link
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              variant="body2"
                              sx={{ 
                                fontWeight: 500,
                                textDecoration: 'none',
                                '&:hover': {
                                  textDecoration: 'underline'
                                }
                              }}
                            >
                              View Resource
                            </Link>
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    </Fade>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Zoom>
      </Box>
    </Container>
  );
};

export default AIFluencyDashboard;
