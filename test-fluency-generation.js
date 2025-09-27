// Test fluency table generation specifically
const OpenAI = require('openai');
require('dotenv').config({ path: './backend/.env' });

console.log('🧪 Testing Fluency Table Generation');
console.log('===================================');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testFluencyGeneration() {
  try {
    console.log('Generating fluency table for Software Engineer in Technology...');
    
    const prompt = `
Generate a comprehensive AI fluency assessment table for a Software Engineer in the Technology industry.

Create 4 fluency levels:
1. Unskilled - No AI knowledge or usage
2. Capable - Basic AI tool usage and understanding
3. Adoptive - Integrated AI workflows and advanced usage
4. Transformative - AI-first approach and innovation leadership

For each level, provide:
- Specific criteria that define this level
- Real-world examples of what this looks like in practice
- Relevant AI tools and platforms
- Required skills and competencies

Focus on practical, actionable insights specific to Software Engineer roles in Technology. Consider:
- Industry-specific AI applications
- Role-specific AI use cases
- Common challenges and opportunities
- Career progression implications

Format the response as a JSON object with this structure:
{
  "levels": [
    {
      "level": "Unskilled",
      "criteria": ["criterion1", "criterion2"],
      "examples": ["example1", "example2"],
      "tools": ["tool1", "tool2"],
      "skills": ["skill1", "skill2"]
    }
  ]
}
`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an AI fluency assessment expert. Generate detailed, practical fluency levels for different roles and industries. Focus on real-world applications and specific skills.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    console.log('✅ Fluency table generated successfully!');
    console.log('Response length:', completion.choices[0]?.message?.content?.length || 0);
    
    // Try to parse the response
    const response = completion.choices[0]?.message?.content;
    if (response) {
      try {
        const parsed = JSON.parse(response);
        console.log('✅ Response is valid JSON');
        console.log('Number of levels:', parsed.levels?.length || 0);
        
        if (parsed.levels && parsed.levels.length > 0) {
          console.log('First level:', parsed.levels[0].level);
          console.log('First level criteria count:', parsed.levels[0].criteria?.length || 0);
        }
      } catch (parseError) {
        console.error('❌ Response is not valid JSON');
        console.error('Parse error:', parseError.message);
        console.log('Response preview:', response.substring(0, 200) + '...');
      }
    } else {
      console.error('❌ No response content received');
    }
    
  } catch (error) {
    console.error('❌ Error generating fluency table:');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    
    if (error.status) {
      console.error('Status:', error.status);
    }
  }
}

// Add timeout
const timeout = setTimeout(() => {
  console.error('❌ Request timed out after 60 seconds');
  process.exit(1);
}, 60000);

testFluencyGeneration().then(() => {
  clearTimeout(timeout);
  console.log('\n✅ Test completed successfully');
}).catch((error) => {
  clearTimeout(timeout);
  console.error('\n❌ Test failed:', error.message);
  process.exit(1);
});
