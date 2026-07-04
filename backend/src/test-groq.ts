import * as dotenv from 'dotenv';
import { Groq } from 'groq-sdk';
import * as path from 'path';

// Load .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function testGroq() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error("❌ GROQ_API_KEY is not defined in .env");
    process.exit(1);
  }

  console.log("✅ GROQ_API_KEY is defined in .env");
  console.log("First few chars:", apiKey.substring(0, 15) + "...");

  try {
    const groq = new Groq({ apiKey });
    console.log("⏳ Sending request to Groq (llama-3.3-70b-versatile)...");
    
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Say "Hello, Groq is working!"' }
      ]
    });

    console.log("✅ Groq response:");
    console.log(response.choices[0]?.message?.content);
  } catch (error) {
    console.error("❌ Error communicating with Groq:", error);
  }
}

testGroq();
