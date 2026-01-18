import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Ensure uploads directory exists
const uploadsDir = './uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userDir = path.join(uploadsDir, req.userId);
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }
    cb(null, userDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'));
    }
  }
});

// Upload image endpoint
router.post('/', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const filePath = `${req.userId}/${req.file.filename}`;
    
    // In production, you might want to:
    // 1. Upload to cloud storage (S3, Cloudinary, etc.)
    // 2. Generate CDN URLs
    // For now, we return a local path that can be served statically
    
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3001}`;
    const url = `${baseUrl}/uploads/${filePath}`;

    res.json({ 
      path: filePath,
      url: url
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Internal server error while uploading image' });
  }
});

// Delete image endpoint
router.delete('/:filename', authMiddleware, async (req, res) => {
  try {
    const filePath = path.join(uploadsDir, req.userId, req.params.filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ message: 'Image deleted successfully' });
    } else {
      res.status(404).json({ error: 'Image not found' });
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Internal server error while deleting image' });
  }
});

export default router;
