# 🚀 VentureTwin: Your AI Digital Twin Portfolio

VentureTwin is an advanced, AI-powered portfolio generator that transforms your static resume into a living, breathing **Digital Twin**. Built for the modern developer, it doesn't just list your skills—it visualizes them in 3D and allows recruiters to interview your AI surrogate in real-time.

## ✨ Killer Features

- 🧠 **Intelligent Resume Parsing:** Upload your PDF or paste your raw text resume, and VentureTwin's Gemini AI engine will automatically extract and categorize your skills, projects, certifications, and achievements.
- 🌌 **Interactive 3D Skills Galaxy:** Ditch the boring bullet points. VentureTwin visualizes your technical stack as an interactive, fully navigable 3D constellation map using React Three Fiber. 
- 🎙️ **AI Mock Interview (Digital Twin Mode):** A highly unique feature that allows recruiters and hackathon judges to literally *interview your portfolio*. By clicking "Interview AI Twin", visitors can chat with an AI configured specifically with your context and experience. It even speaks its answers out loud using native Text-to-Speech!
- 📖 **Skill Evolution Timeline:** Watch your career grow visually. The AI intelligently constructs a chronological storytelling timeline mapping exactly when you learned certain skills and completed projects.
- 🎨 **Modern, Dynamic UI:** Built with Tailwind CSS and Framer Motion for incredibly smooth, glassmorphic, and dynamic page transitions.

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 + Vite
- **State Management:** Zustand
- **Styling:** Tailwind CSS + UI components (Lucide, Radix)
- **Animations:** Framer Motion
- **3D Rendering:** Three.js & React Three Fiber (@react-three/drei)
- **Routing:** React Router DOM

### Backend
- **Runtime:** Node.js + Express
- **Database:** MongoDB (Mongoose)
- **AI Integration:** Google Gemini 2.5 Flash API (`@google/genai`)
- **Authentication:** JWT (JSON Web Tokens)
- **File Parsing:** `pdf-parse` (for parsing uploaded resumes)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas cluster (or local instance)
- Google Gemini API Key

### 1. Clone & Install
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Variables
Create a `.env` file in the **backend** directory:
```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
GEMINI_API_KEY=your_google_gemini_api_key
```

### 3. Run the Development Servers
You will need two terminals running simultaneously.

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:3000`.

## 💡 How to use the AI Features
1. **Register/Login** to your dashboard.
2. Navigate to **Resume & Experience**.
3. Upload a PDF of your resume. The Gemini AI will parse it and auto-fill your profile.
4. Navigate to **Skills** to explore your interactive 3D Galaxy.
5. Click **View Live Portfolio** on your dashboard sidebar to see your public profile (`/p/your-username`).
6. Click the pulsing **Interview AI Twin** button in the bottom right corner of your public portfolio to test the interactive mock interview!

## 🏆 Hackathon Notes
VentureTwin was built to push the boundaries of what a personal portfolio can be by integrating large language models directly into the presentation layer. The combination of 3D visualization and conversational AI makes it a standout project!
