import dotenv from 'dotenv';
dotenv.config({ override: true });
import { GoogleGenAI } from '@google/genai';

async function testKeys() {
  const keysStr = process.env.GEMINI_API_KEY || '';
  const keys = keysStr.split(',').map(k => k.trim()).filter(k => k);
  
  console.log(`Found ${keys.length} keys`);
  
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    console.log(`Testing key ${i + 1}/${keys.length} ending in ${key.slice(-5)}`);
    try {
      const ai = new GoogleGenAI({ apiKey: key });
      await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: 'hi' }] }]
      });
      console.log(`✅ Key ${i + 1} SUCCESS!`);
    } catch (err: any) {
      console.log(`❌ Key ${i + 1} FAILED with status: ${err?.status} / ${err?.message?.slice(0, 50)}`);
    }
  }
}

testKeys();
