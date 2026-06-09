// backend/routes/categories.js
// Category Management Routes

const express = require('express');
const { supabase } = require('../utils/database');

const router = express.Router();

/**
 * GET /api/categories
 * Get all categories untuk user
 */
router.get('/', async (req, res) => {
  try {
    const userId = req.userId;
    
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });
    
    if (error) {
      return res.status(400).json({
        error: { message: error.message, status: 400 }
      });
    }
    
    res.json({
      categories: data || []
    });
  } catch (err) {
    console.error('Get categories error:', err);
    res.status(500).json({
      error: { message: 'Failed to fetch categories', status: 500 }
    });
  }
});

/**
 * GET /api/categories/:id
 * Get single category
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    
    if (error || !data) {
      return res.status(404).json({
        error: { message: 'Category not found', status: 404 }
      });
    }
    
    res.json({
      category: data
    });
  } catch (err) {
    console.error('Get category error:', err);
    res.status(500).json({
      error: { message: 'Failed to fetch category', status: 500 }
    });
  }
});

/**
 * POST /api/categories
 * Create new category
 */
router.post('/', async (req, res) => {
  try {
    const { name, icon, color, type } = req.body;
    const userId = req.userId;
    
    // Validation
    if (!name || !type) {
      return res.status(400).json({
        error: { message: 'Name dan type harus diisi', status: 400 }
      });
    }
    
    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({
        error: { message: 'Type harus income atau expense', status: 400 }
      });
    }
    
    const { data, error } = await supabase
      .from('categories')
      .insert({
        user_id: userId,
        name,
        icon: icon || '📁',
        color: color || '#6366f1',
        type
      })
      .select();
    
    if (error) {
      return res.status(400).json({
        error: { message: error.message, status: 400 }
      });
    }
    
    res.status(201).json({
      message: 'Category berhasil dibuat',
      category: data[0]
    });
  } catch (err) {
    console.error('Create category error:', err);
    res.status(500).json({
      error: { message: 'Failed to create category', status: 500 }
    });
  }
});

/**
 * PUT /api/categories/:id
 * Update category
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { name, icon, color, type } = req.body;
    
    // Verify ownership
    const { data: existing } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    
    if (!existing) {
      return res.status(404).json({
        error: { message: 'Category not found', status: 404 }
      });
    }
    
    const { data, error } = await supabase
      .from('categories')
      .update({
        name: name || existing.name,
        icon: icon || existing.icon,
        color: color || existing.color,
        type: type || existing.type
      })
      .eq('id', id)
      .select();
    
    if (error) {
      return res.status(400).json({
        error: { message: error.message, status: 400 }
      });
    }
    
    res.json({
      message: 'Category berhasil diupdate',
      category: data[0]
    });
  } catch (err) {
    console.error('Update category error:', err);
    res.status(500).json({
      error: { message: 'Failed to update category', status: 500 }
    });
  }
});

/**
 * DELETE /api/categories/:id
 * Delete category
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    
    // Verify ownership
    const { data: existing } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    
    if (!existing) {
      return res.status(404).json({
        error: { message: 'Category not found', status: 404 }
      });
    }
    
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) {
      return res.status(400).json({
        error: { message: error.message, status: 400 }
      });
    }
    
    res.json({
      message: 'Category berhasil dihapus'
    });
  } catch (err) {
    console.error('Delete category error:', err);
    res.status(500).json({
      error: { message: 'Failed to delete category', status: 500 }
    });
  }
});

module.exports = router;
