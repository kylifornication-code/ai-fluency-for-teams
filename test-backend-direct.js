// Test backend API directly
const axios = require('axios');

console.log('🧪 Testing Backend API Directly');
console.log('================================');

async function testBackendAPI() {
  try {
    // First, start the backend
    console.log('Starting backend...');
    const { spawn } = require('child_process');
    
    const backend = spawn('npm', ['run', 'dev'], {
      cwd: './backend',
      stdio: 'pipe'
    });
    
    // Wait for backend to start
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('Testing health endpoint...');
    const healthResponse = await axios.get('http://localhost:5001/health');
    console.log('✅ Health check:', healthResponse.data);
    
    console.log('Testing fluency table generation...');
    const fluencyResponse = await axios.post('http://localhost:5001/api/fluency-table', {
      roleTitle: 'Software Engineer',
      industry: 'Technology'
    }, {
      timeout: 30000 // 30 second timeout
    });
    
    console.log('✅ Fluency table generated successfully!');
    console.log('Response keys:', Object.keys(fluencyResponse.data));
    console.log('Number of levels:', fluencyResponse.data.levels?.length || 0);
    
    backend.kill();
    
  } catch (error) {
    console.error('❌ Error testing backend:');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('Backend is not running on port 5001');
    } else if (error.code === 'ECONNABORTED') {
      console.error('Request timed out - this suggests the API call is hanging');
    }
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testBackendAPI();
