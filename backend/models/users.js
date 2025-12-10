const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema(
  {
    id: String,
    career: String,
    score: Number
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    interests: [String],
    skills: [String],
    preferences: {
      type: Object,
      default: {}
    },
    recommendations: [recommendationSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
