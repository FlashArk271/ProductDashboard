import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../config/database.js';
import { generateToken } from '../middleware/auth.js';
import { sendOtpEmail } from '../services/email.js';

const router = Router();
const OTP_EXPIRY_MINUTES = Number(process.env.OTP_EXPIRY_MINUTES || 5);

// Send OTP endpoint (simplified - stores OTP in DB)
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const db = getDb();
    const otpCollection = db.collection('otps');

    const activeOtp = await otpCollection.findOne({
      email: normalizedEmail,
      expiresAt: { $gt: new Date() }
    });

    if (activeOtp) {
      return res.status(429).json({
        error: 'OTP already sent. Please wait until it expires.'
      });
    }
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP with expiration (5 minutes)
    await otpCollection.updateOne(
      { email: normalizedEmail },
      { 
        $set: { 
          email: normalizedEmail,
          otp,
          expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
          createdAt: new Date()
        }
      },
      { upsert: true }
    );

    try {
      await sendOtpEmail(normalizedEmail, otp, OTP_EXPIRY_MINUTES);
    } catch (sendError) {
      await otpCollection.deleteOne({ email: normalizedEmail });
      throw sendError;
    }

    res.json({ 
      message: 'OTP sent successfully'
    });
  } catch (error) {
    console.error('OTP send error:', error);
    if (error?.code === 'EAUTH') {
      return res.status(500).json({
        error: 'SMTP authentication failed. Check SMTP_USER and SMTP_PASS (use Gmail App Password).'
      });
    }
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Verify OTP endpoint
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const db = getDb();
    const otpCollection = db.collection('otps');
    const usersCollection = db.collection('users');
    
    const otpRecord = await otpCollection.findOne({ 
      email: normalizedEmail,
      otp,
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Delete used OTP
    await otpCollection.deleteOne({ email: normalizedEmail });

    // Find or create user
    let user = await usersCollection.findOne({ email: normalizedEmail });
    
    if (!user) {
      const userId = uuidv4();
      user = {
        id: userId,
        email: normalizedEmail,
        password: null, // OTP users don't have passwords
        name: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await usersCollection.insertOne(user);
    }

    const token = generateToken(user.id);
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    res.json({ 
      access_token: token,
      user: userWithoutPassword 
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ error: 'Internal server error during OTP verification' });
  }
});

export default router;
