import { useState, useMemo } from 'react'
import { Routes, Route } from 'react-router-dom'
import { 
  Container, 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  IconButton,
  Tooltip,
  ThemeProvider,
  createTheme,
  CssBaseline
} from '@mui/material'
import { Brightness4, Brightness7 } from '@mui/icons-material'
import AIFluencyDashboard from './pages/AIFluencyDashboard'

function App() {
  const [darkMode, setDarkMode] = useState(false)

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: {
            main: darkMode ? '#90caf9' : '#1976d2',
          },
          secondary: {
            main: darkMode ? '#f48fb1' : '#dc004e',
          },
          background: {
            default: darkMode ? '#121212' : '#fafafa',
            paper: darkMode ? '#1e1e1e' : '#ffffff',
          },
        },
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          h4: {
            fontWeight: 600,
            letterSpacing: '-0.02em',
          },
          h5: {
            fontWeight: 600,
            letterSpacing: '-0.01em',
          },
          h6: {
            fontWeight: 500,
          },
        },
        shape: {
          borderRadius: 12,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontWeight: 500,
                borderRadius: 8,
                padding: '8px 24px',
              },
              contained: {
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                },
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                boxShadow: darkMode 
                  ? '0 2px 8px rgba(0,0,0,0.3)' 
                  : '0 2px 8px rgba(0,0,0,0.1)',
                border: darkMode ? '1px solid #333' : '1px solid #e0e0e0',
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
              },
            },
          },
        },
      }),
    [darkMode]
  )

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBar 
          position="static" 
          elevation={0}
          sx={{ 
            bgcolor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Toolbar>
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <img 
                src="/logo.png" 
                alt="AI Fluency Logo" 
                style={{ 
                  height: '40px', 
                  width: 'auto',
                  marginRight: '12px'
                }} 
              />
              <Typography 
                variant="h6" 
                component="div" 
                sx={{ 
                  fontWeight: 600,
                  color: 'text.primary',
                  letterSpacing: '-0.01em'
                }}
              >
                AI Fluency for Teams
              </Typography>
            </Box>
            <Tooltip title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}>
              <IconButton onClick={toggleDarkMode} color="inherit">
                {darkMode ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
        
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Routes>
            <Route path="/" element={<AIFluencyDashboard darkMode={darkMode} />} />
            <Route path="*" element={<AIFluencyDashboard darkMode={darkMode} />} />
          </Routes>
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default App
