const express = require('express');
const router = express.Router();

const careers = require('../models/careers');
const User = require('../models/users');

// ✅ Safe Scoring Function (Non-ML)
function scoreCareer(career, interests, skills, preferences) {
  let score = 0;

  interests.forEach(i => {
    if (career.interests && career.interests.map(x => x.toLowerCase()).includes(i)) {
      score += 3;
    }
  });

  skills.forEach(s => {
    if (career.skills && career.skills.map(x => x.toLowerCase()).includes(s)) {
      score += 2;
    }
  });

  if (
    preferences?.education &&
    career.education &&
    career.education.includes(preferences.education)
  ) {
    score += 1;
  }

  return score;
}

// ✅ POST /api/recommend
router.post('/recommend', async (req, res) => {
  try {
    let { interests = [], skills = [], email = '', preferences = {} } = req.body;

    // ✅ SAFETY: Convert comma-separated strings into arrays
    if (typeof interests === 'string') {
      interests = interests.split(',').map(i => i.trim());
    }

    if (typeof skills === 'string') {
      skills = skills.split(',').map(s => s.trim());
    }

    const normalizedInterests = interests.map(i => i.toLowerCase());
    const normalizedSkills = skills.map(s => s.toLowerCase());

    const scored = careers.map(c => ({
      id: c.id,
      career: c.name,
      score: scoreCareer(c, normalizedInterests, normalizedSkills, preferences),
      description: c.description,
      skills: c.skills,
      resources: c.resources,
      salary: c.salary,
      education: c.education
    }));

    const filtered = scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score);

    if (email) {
      const topForSave = filtered.slice(0, 3).map(c => ({
        id: c.id,
        career: c.career,
        score: c.score
      }));

      await User.create({
        email,
        interests: normalizedInterests,
        skills: normalizedSkills,
        preferences,
        recommendations: topForSave
      });
    }

    res.json(filtered);
  } catch (err) {
    console.error('❌ API Crash:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ GET /api/history/:email
router.get('/history/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email })
      .sort({ createdAt: -1 })
      .lean();

    if (!user) return res.status(404).json({ error: 'No history' });

    res.json(user);
  } catch (err) {
    console.error('❌ History Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
