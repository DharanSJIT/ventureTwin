import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    sparse: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    default: '',
  },
  resumeUrl: {
    type: String,
    default: '',
  },
  resumeText: {
    type: String,
    default: '',
  },
  skills: {
    type: [String],
    default: [],
  },
  projects: [{
    title: { type: String, required: true },
    description: { type: String, default: '' },
    technologies: [{ type: String }],
    date: { type: String, default: '' }
  }],
  certifications: [{
    name: { type: String, required: true },
    issuer: { type: String, default: 'Unknown' },
    date: { type: String, default: '' }
  }],
  achievements: [{
    title: { type: String, required: true },
    description: { type: String, default: '' }
  }],
  careerPath: {
    type: String,
    default: 'software_engineering',
    enum: ['software_engineering', 'startup_founder', 'product_design', 'data_science']
  },
  activeTemplate: {
    type: String,
    default: 'modern'
  },
  startupBlueprints: [{
    idea: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    marketSize: { type: String, default: '' },
    estMRR: { type: String, default: '' },
    competitors: { type: String, default: 'Low' },
    innovationScore: { type: String, default: '5/10' },
    status: { type: String, default: 'Evaluating' },
    details: {
      validation: { type: String, default: '' },
      businessModel: { type: String, default: '' },
      investorSimulation: { type: String, default: '' },
      revenueForecasting: { type: String, default: '' },
      fundingReadiness: { type: String, default: '' }
    },
    revenueData: [{
      month: { type: String },
      revenue: { type: Number }
    }],
    competitorData: [{
      name: { type: String },
      score: { type: Number }
    }],
    createdAt: { type: Date, default: Date.now }
  }],
  learningRoadmaps: [{
    title: { type: String, required: true },
    description: { type: String, required: true },
    targetRole: { type: String, required: true },
    overallProgress: { type: Number, default: 0 },
    steps: [{
      title: { type: String, required: true },
      status: { type: String, enum: ['mastered', 'learning', 'locked'], default: 'locked' },
      description: { type: String, default: '' },
      recommendedResources: [{
        title: { type: String },
        type: { type: String, enum: ['doc', 'video', 'course', 'book'] }
      }]
    }],
    skillGoals: [{
      name: { type: String },
      progress: { type: Number, default: 0 }
    }],
    createdAt: { type: Date, default: Date.now }
  }],
  decisions: [{
    dilemma: { type: String, required: true },
    pros: [{ type: String }],
    cons: [{ type: String }],
    recommendation: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
  }],
  opportunities: [{
    role: { type: String, required: true },
    company: { type: String, default: 'Matching Network' },
    type: { type: String, default: 'Full-time' },
    salary: { type: String, default: 'Market Rate' },
    matchReason: { type: String, default: '' },
    matchScore: { type: Number, default: 85 },
    url: { type: String, default: '#' },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
