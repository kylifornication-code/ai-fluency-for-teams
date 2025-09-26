import { Routes, Route } from 'react-router-dom'
import { Container, AppBar, Toolbar, Typography, Box } from '@mui/material'
import AIFluencyDashboard from './pages/AIFluencyDashboard'

function App() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            AI Fluency for Teams
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/" element={<AIFluencyDashboard />} />
          <Route path="*" element={<AIFluencyDashboard />} />
        </Routes>
      </Container>
    </Box>
  )
}

export default App
