import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Box,
  CircularProgress,
  Chip,
  TextField,
  InputAdornment,
  IconButton
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import BookmarkIcon from '@mui/icons-material/Bookmark'

interface Resource {
  id: string
  title: string
  type: string
  difficulty: string
  estimatedTime: number
  roles: string[]
  industries: string[]
  url: string
  description: string
}

const Resources = () => {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [bookmarkedResources, setBookmarkedResources] = useState<Set<string>>(new Set())
  const navigate = useNavigate()

  useEffect(() => {
    fetchResources()
    // Load bookmarked resources from localStorage
    const bookmarks = localStorage.getItem('bookmarkedResources')
    if (bookmarks) {
      setBookmarkedResources(new Set(JSON.parse(bookmarks)))
    }
  }, [])

  const fetchResources = async () => {
    try {
      const response = await fetch('/api/resources')
      const data = await response.json()
      setResources(data)
    } catch (error) {
      console.error('Error fetching resources:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBookmark = async (resourceId: string) => {
    try {
      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resourceId,
          userId: 'current-user' // In a real app, this would come from auth
        }),
      })
      
      if (response.ok) {
        const newBookmarks = new Set(bookmarkedResources)
        if (newBookmarks.has(resourceId)) {
          newBookmarks.delete(resourceId)
        } else {
          newBookmarks.add(resourceId)
        }
        setBookmarkedResources(newBookmarks)
        localStorage.setItem('bookmarkedResources', JSON.stringify([...newBookmarks]))
      }
    } catch (error) {
      console.error('Error bookmarking resource:', error)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'success'
      case 'intermediate': return 'warning'
      case 'advanced': return 'error'
      default: return 'default'
    }
  }

  const filteredResources = resources.filter(resource =>
    resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
        Learning Resources
      </Typography>
      
      <Box mb={3}>
        <TextField
          fullWidth
          placeholder="Search resources..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Grid container spacing={3}>
        {filteredResources.map((resource) => (
          <Grid item xs={12} sm={6} md={4} key={resource.id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Typography variant="h6" component="h2">
                    {resource.title}
                  </Typography>
                  <IconButton
                    onClick={() => handleBookmark(resource.id)}
                    color={bookmarkedResources.has(resource.id) ? 'primary' : 'default'}
                  >
                    {bookmarkedResources.has(resource.id) ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                  </IconButton>
                </Box>
                
                <Typography color="text.secondary" paragraph>
                  {resource.description}
                </Typography>
                
                <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
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
                
                <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                  {resource.roles.slice(0, 2).map((role, idx) => (
                    <Chip key={idx} label={role} size="small" />
                  ))}
                  {resource.roles.length > 2 && (
                    <Chip label={`+${resource.roles.length - 2} more`} size="small" />
                  )}
                </Box>
                
                <Button
                  variant="contained"
                  fullWidth
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Resource
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {filteredResources.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No resources found matching your search.
          </Typography>
        </Box>
      )}
      
      <Box mt={3}>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/')}
        >
          Back to Role Selection
        </Button>
      </Box>
    </Box>
  )
}

export default Resources
