import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../config/database.js';
import { generateToken } from '../middleware/auth.js';

const router = Router();

// Sign up endpoint
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const db = getDb();
    const usersCollection = db.collection('users');
    
    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const userId = uuidv4();
    const user = {
      id: userId,
      email: email.toLowerCase(),
      password: hashedPassword,
      name: name || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await usersCollection.insertOne(user);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({ 
      user: userWithoutPassword, 
      message: 'User created successfully' 
    });
  } catch (error) {
    console.error('Sign up error:', error);
    res.status(500).json({ error: 'Internal server error during sign up' });
  }
});

// Sign in with password
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const db = getDb();
    const usersCollection = db.collection('users');
    
    const user = await usersCollection.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user.id);
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    res.json({ 
      access_token: token,
      user: userWithoutPassword 
    });
  } catch (error) {
    console.error('Sign in error:', error);
    res.status(500).json({ error: 'Internal server error during sign in' });
  }
});

// Send OTP endpoint (simplified - stores OTP in DB)
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const db = getDb();
    const otpCollection = db.collection('otps');
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP with expiration (5 minutes)
    await otpCollection.updateOne(
      { email: email.toLowerCase() },
      { 
        $set: { 
          email: email.toLowerCase(),
          otp,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000),
          createdAt: new Date()
        }
      },
      { upsert: true }
    );

    // In production, send OTP via email service
    console.log(`OTP for ${email}: ${otp}`);

    res.json({ 
      message: 'OTP sent successfully',
      // Only for demo - remove in production
      demo_otp: otp 
    });
  } catch (error) {
    console.error('OTP send error:', error);
    res.status(500).json({ error: 'Internal server error while sending OTP' });
  }
});

// Verify OTP endpoint
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    const db = getDb();
    const otpCollection = db.collection('otps');
    const usersCollection = db.collection('users');
    
    const otpRecord = await otpCollection.findOne({ 
      email: email.toLowerCase(),
      otp,
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Delete used OTP
    await otpCollection.deleteOne({ email: email.toLowerCase() });

    // Find or create user
    let user = await usersCollection.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      const userId = uuidv4();
      user = {
        id: userId,
        email: email.toLowerCase(),
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
