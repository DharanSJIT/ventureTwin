const mongoose = require('mongoose');
require('dotenv').config();
const uri = process.env.MONGO_URI;

mongoose.connect(uri).then(async () => {
  const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
  const users = await User.find({});
  console.log("Users:", users.map(u => ({ id: u._id, email: u.email, resumeUrl: u.resumeUrl, resumeTextLen: u.resumeText ? u.resumeText.length : 0 })));
  process.exit(0);
});
