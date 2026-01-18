import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../config/database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// All product routes require authentication
router.use(authMiddleware);

// Get all products for a user
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const productsCollection = db.collection('products');
    
    const products = await productsCollection
      .find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .toArray();
    
    res.json({ products: products || [] });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error while fetching products' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const db = getDb();
    const productsCollection = db.collection('products');
    
    const product = await productsCollection.findOne({ 
      id: req.params.id,
      userId: req.userId 
    });
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ product });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal server error while fetching product' });
  }
});

// Create product
router.post('/', async (req, res) => {
  try {
    const { name, description, price, category, isPublished, images } = req.body;
    
    if (!name || price === undefined) {
      return res.status(400).json({ error: 'Name and price are required' });
    }

    const db = getDb();
    const productsCollection = db.collection('products');
    
    const productId = uuidv4();
    const product = {
      id: productId,
      userId: req.userId,
      name,
      description: description || '',
      price: parseFloat(price),
      category: category || '',
      isPublished: isPublished || false,
      images: images || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await productsCollection.insertOne(product);
    
    res.json({ product });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal server error while creating product' });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const db = getDb();
    const productsCollection = db.collection('products');
    
    const existingProduct = await productsCollection.findOne({ 
      id: req.params.id,
      userId: req.userId 
    });
    
    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const updates = req.body;
    const updatedProduct = {
      ...existingProduct,
      ...updates,
      id: req.params.id,
      userId: req.userId,
      updatedAt: new Date().toISOString(),
    };

    // Remove MongoDB _id from response
    delete updatedProduct._id;

    await productsCollection.updateOne(
      { id: req.params.id, userId: req.userId },
      { $set: updatedProduct }
    );
    
    res.json({ product: updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal server error while updating product' });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const db = getDb();
    const productsCollection = db.collection('products');
    
    const existingProduct = await productsCollection.findOne({ 
      id: req.params.id,
      userId: req.userId 
    });
    
    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await productsCollection.deleteOne({ 
      id: req.params.id, 
      userId: req.userId 
    });
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal server error while deleting product' });
  }
});

export default router;
