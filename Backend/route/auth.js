const express = require('express');
const router = express.Router();

router.post('/forget-password', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  // Simulate sending email
  console.log(`Password reset instructions sent to ${email}`);

  return res.status(200).json({ success: true, message: 'Reset email sent' });
});

module.exports = router;
