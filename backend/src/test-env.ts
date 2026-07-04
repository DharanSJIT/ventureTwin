import dotenv from 'dotenv';
const result = dotenv.config({ override: true });
console.log("Dotenv parsed:", result.parsed);
console.log("GEMINI_API_KEY in process.env:", !!process.env.GEMINI_API_KEY);
if (process.env.GEMINI_API_KEY) {
  console.log("First few chars:", process.env.GEMINI_API_KEY.substring(0, 15));
}
