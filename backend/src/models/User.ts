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
    technologies: [{ type: String }]
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
  activeTemplate: {
    type: String,
    default: 'modern'
  }
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
