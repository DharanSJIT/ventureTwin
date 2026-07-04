const pdfParse = require('pdf-parse');
async function run() {
  const cloudinaryUrl = 'https://res.cloudinary.com/dikdbeufl/raw/upload/v1783158927/venturetwin/resumes/6a48a629269eea2617740447_resume.pdf';
  console.log("Fetching", cloudinaryUrl);
  try {
    const response = await fetch(cloudinaryUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const pdfData = await pdfParse(buffer);
    console.log("Success! Extracted characters:", pdfData.text.length);
  } catch (e) {
    console.error("Failed to parse:", e);
  }
}
run();
