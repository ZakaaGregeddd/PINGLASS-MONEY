// backend/routes/transactions.js
// Transaction Management Routes

const express = require('express');
const { supabase } = require('../utils/database');

const router = express.Router();

/**
 * GET /api/transactions
 * Get all transactions untuk user
 * Query params: month (YYYY-MM), type (income/expense), limit, offset
 */
router.get('/', async (req, res) => {
  try {
    const userId = req.userId;
    const { month, type, limit = 50, offset = 0 } = req.query;
    
    let query = supabase
      .from('transactions')
      .select('*', { count: 'exact' })
      .eq('user_id', userId);
    
    // Filter by month if provided
    if (month) {
      const startDate = `${month}-01`;
      const endDate = new Date(month + '-01');
      endDate.setMonth(endDate.getMonth() + 1);
      const endDateStr = endDate.toISOString().split('T')[0];
      
      query = query
        .gte('date', startDate)
        .lt('date', endDateStr);
    }
    
    // Filter by type if provided
    if (type && ['income', 'expense'].includes(type)) {
      query = query.eq('type', type);
    }
    
    // Execute query
    const { data, error, count } = await query
      .order('date', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) {
      return res.status(400).json({
        error: { message: error.message, status: 400 }
      });
    }
    
    res.json({
      transactions: data || [],
      pagination: {
        total: count || 0,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (err) {
    console.error('Get transactions error:', err);
    res.status(500).json({
      error: { message: 'Failed to fetch transactions', status: 500 }
    });
  }
});

/**
 * GET /api/transactions/:id
 * Get single transaction
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    
    if (error || !data) {
      return res.status(404).json({
        error: { message: 'Transaction not found', status: 404 }
      });
    }
    
    res.json({
      transaction: data
    });
  } catch (err) {
    console.error('Get transaction error:', err);
    res.status(500).json({
      error: { message: 'Failed to fetch transaction', status: 500 }
    });
  }
});

/**
 * POST /api/transactions
 * Create new transaction
 */
router.post('/', async (req, res) => {
  try {
    const { amount, type, category_id, description, date } = req.body;
    const userId = req.userId;
    
    // Validation
    if (!amount || !type || !date) {
      return res.status(400).json({
        error: { message: 'Amount, type, dan date harus diisi', status: 400 }
      });
    }
    
    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({
        error: { message: 'Type harus income atau expense', status: 400 }
      });
    }
    
    // Validate amount is positive number
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({
        error: { message: 'Amount harus angka positif', status: 400 }
      });
    }
    
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        amount: numAmount,
        type,
        category_id: category_id || null,
        description: description || null,
        date
      })
      .select();
    
    if (error) {
      return res.status(400).json({
        error: { message: error.message, status: 400 }
      });
    }
    
    res.status(201).json({
      message: 'Transaction berhasil dibuat',
      transaction: data[0]
    });
  } catch (err) {
    console.error('Create transaction error:', err);
    res.status(500).json({
      error: { message: 'Failed to create transaction', status: 500 }
    });
  }
});

/**
 * PUT /api/transactions/:id
 * Update transaction
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { amount, type, category_id, description, date } = req.body;
    
    // Verify ownership
    const { data: existing } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    
    if (!existing) {
      return res.status(404).json({
        error: { message: 'Transaction not found', status: 404 }
      });
    }
    
    // Prepare update data
    const updateData = {};
    if (amount !== undefined) updateData.amount = parseFloat(amount);
    if (type !== undefined) updateData.type = type;
    if (category_id !== undefined) updateData.category_id = category_id;
    if (description !== undefined) updateData.description = description;
    if (date !== undefined) updateData.date = date;
    updateData.updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('transactions')
      .update(updateData)
      .eq('id', id)
      .select();
    
    if (error) {
      return res.status(400).json({
        error: { message: error.message, status: 400 }
      });
    }
    
    res.json({
      message: 'Transaction berhasil diupdate',
      transaction: data[0]
    });
  } catch (err) {
    console.error('Update transaction error:', err);
    res.status(500).json({
      error: { message: 'Failed to update transaction', status: 500 }
    });
  }
});

/**
 * DELETE /api/transactions/:id
 * Delete transaction
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    
    // Verify ownership
    const { data: existing } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    
    if (!existing) {
      return res.status(404).json({
        error: { message: 'Transaction not found', status: 404 }
      });
    }
    
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);
    
    if (error) {
      return res.status(400).json({
        error: { message: error.message, status: 400 }
      });
    }
    
    res.json({
      message: 'Transaction berhasil dihapus'
    });
  } catch (err) {
    console.error('Delete transaction error:', err);
    res.status(500).json({
      error: { message: 'Failed to delete transaction', status: 500 }
    });
  }
});

module.exports = router;
