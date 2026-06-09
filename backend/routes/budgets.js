// backend/routes/budgets.js
// Budget Management Routes

const express = require('express');
const { supabase } = require('../utils/database');

const router = express.Router();

/**
 * GET /api/budgets
 * Get all budgets untuk user
 * Query params: month (YYYY-MM)
 */
router.get('/', async (req, res) => {
  try {
    const userId = req.userId;
    const { month } = req.query;
    
    let query = supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userId);
    
    // Filter by month if provided
    if (month) {
      query = query.eq('month', month);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      return res.status(400).json({
        error: { message: error.message, status: 400 }
      });
    }
    
    res.json({
      budgets: data || []
    });
  } catch (err) {
    console.error('Get budgets error:', err);
    res.status(500).json({
      error: { message: 'Failed to fetch budgets', status: 500 }
    });
  }
});

/**
 * GET /api/budgets/:id
 * Get single budget
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    
    if (error || !data) {
      return res.status(404).json({
        error: { message: 'Budget not found', status: 404 }
      });
    }
    
    res.json({
      budget: data
    });
  } catch (err) {
    console.error('Get budget error:', err);
    res.status(500).json({
      error: { message: 'Failed to fetch budget', status: 500 }
    });
  }
});

/**
 * POST /api/budgets
 * Create new budget
 */
router.post('/', async (req, res) => {
  try {
    const { limit_amount, category_id, month } = req.body;
    const userId = req.userId;
    
    // Validation
    if (!limit_amount || !month) {
      return res.status(400).json({
        error: { message: 'limit_amount dan month harus diisi', status: 400 }
      });
    }
    
    // Validate month format (YYYY-MM)
    if (!/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({
        error: { message: 'Month harus format YYYY-MM', status: 400 }
      });
    }
    
    const { data, error } = await supabase
      .from('budgets')
      .insert({
        user_id: userId,
        limit_amount: parseFloat(limit_amount),
        category_id: category_id || null,
        month
      })
      .select();
    
    if (error) {
      return res.status(400).json({
        error: { message: error.message, status: 400 }
      });
    }
    
    res.status(201).json({
      message: 'Budget berhasil dibuat',
      budget: data[0]
    });
  } catch (err) {
    console.error('Create budget error:', err);
    res.status(500).json({
      error: { message: 'Failed to create budget', status: 500 }
    });
  }
});

/**
 * PUT /api/budgets/:id
 * Update budget
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { limit_amount, category_id, month } = req.body;
    
    // Verify ownership
    const { data: existing } = await supabase
      .from('budgets')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    
    if (!existing) {
      return res.status(404).json({
        error: { message: 'Budget not found', status: 404 }
      });
    }
    
    const updateData = {};
    if (limit_amount !== undefined) updateData.limit_amount = parseFloat(limit_amount);
    if (category_id !== undefined) updateData.category_id = category_id;
    if (month !== undefined) updateData.month = month;
    
    const { data, error } = await supabase
      .from('budgets')
      .update(updateData)
      .eq('id', id)
      .select();
    
    if (error) {
      return res.status(400).json({
        error: { message: error.message, status: 400 }
      });
    }
    
    res.json({
      message: 'Budget berhasil diupdate',
      budget: data[0]
    });
  } catch (err) {
    console.error('Update budget error:', err);
    res.status(500).json({
      error: { message: 'Failed to update budget', status: 500 }
    });
  }
});

/**
 * DELETE /api/budgets/:id
 * Delete budget
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    
    // Verify ownership
    const { data: existing } = await supabase
      .from('budgets')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    
    if (!existing) {
      return res.status(404).json({
        error: { message: 'Budget not found', status: 404 }
      });
    }
    
    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', id);
    
    if (error) {
      return res.status(400).json({
        error: { message: error.message, status: 400 }
      });
    }
    
    res.json({
      message: 'Budget berhasil dihapus'
    });
  } catch (err) {
    console.error('Delete budget error:', err);
    res.status(500).json({
      error: { message: 'Failed to delete budget', status: 500 }
    });
  }
});

module.exports = router;
