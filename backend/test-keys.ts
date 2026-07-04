import dotenv from 'dotenv';
dotenv.config({ override: true });
const keysStr = process.env.GEMINI_API_KEY || '';
const keys = keysStr.split(',').map(k => k.trim()).filter(k => k);
console.log("Keys loaded:", keys.length);
console.log("Keys:", keys);
