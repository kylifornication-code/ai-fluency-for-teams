// Simple OpenAI API test script
const OpenAI = require('openai');
require('dotenv').config({ path: './backend/.env' });

console.log('🔍 Debugging OpenAI Integration');
console.log('===============================');

// Check environment
console.log('Environment check:');
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'Set' : 'Not set');
console.log('OPENAI_MODEL:', process.env.OPENAI_MODEL || 'gpt-4');
console.log('OPENAI_MAX_TOKENS:', process.env.OPENAI_MAX_TOKENS || '2000');

if (!process.env.OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY not found in environment');
  process.exit(1);
}

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

console.log('\n🧪 Testing OpenAI API connection...');

// Test with a simple request
async function testOpenAI() {
  try {
    console.log('Sending test request to OpenAI...');
    
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4',
      messages: [
        {
          role: 'user',
          content: 'Say "Hello, this is a test" and nothing else.'
        }
      ],
      max_tokens: 50,
      temperature: 0.7,
    });

    console.log('✅ OpenAI API working!');
    console.log('Response:', completion.choices[0]?.message?.content);
    
  } catch (error) {
    console.error('❌ OpenAI API error:');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    
    if (error.status) {
      console.error('Status:', error.status);
    }
    
    if (error.code) {
      console.error('Code:', error.code);
    }
    
    if (error.type) {
      console.error('Type:', error.type);
    }
  }
}

// Add timeout
const timeout = setTimeout(() => {
  console.error('❌ Request timed out after 30 seconds');
  process.exit(1);
}, 30000);

testOpenAI().then(() => {
  clearTimeout(timeout);
  console.log('\n✅ Test completed successfully');
}).catch((error) => {
  clearTimeout(timeout);
  console.error('\n❌ Test failed:', error.message);
  process.exit(1);
});
