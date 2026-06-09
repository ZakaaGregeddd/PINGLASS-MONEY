// backend/routes/reports.js
// Reports & Analytics Routes

const express = require('express');
const { supabase } = require('../utils/database');
const { generateExcelReport } = require('../utils/excel');

const router = express.Router();

/**
 * GET /api/reports/summary
 * Get monthly summary (income, expense, net)
 * Query params: month (YYYY-MM)
 */
router.get('/summary', async (req, res) => {
  try {
    const userId = req.userId;
    const month = req.query.month || new Date().toISOString().split('T')[0].slice(0, 7);
    
    // Ambil transaksi bulan ini
    const startDate = `${month}-01`;
    const endDate = new Date(month + '-01');
    endDate.setMonth(endDate.getMonth() + 1);
    const endDateStr = endDate.toISOString().split('T')[0];
    
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lt('date', endDateStr);
    
    if (error) {
      return res.status(400).json({
        error: { message: error.message, status: 400 }
      });
    }
    
    // Calculate
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const net = income - expense;
    
    res.json({
      month,
      summary: {
        income: parseFloat(income.toFixed(2)),
        expense: parseFloat(expense.toFixed(2)),
        net: parseFloat(net.toFixed(2)),
        transactionCount: transactions.length
      }
    });
  } catch (err) {
    console.error('Get summary error:', err);
    res.status(500).json({
      error: { message: 'Failed to get summary', status: 500 }
    });
  }
});

/**
 * GET /api/reports/by-category
 * Get expenses grouped by category
 * Query params: month (YYYY-MM)
 */
router.get('/by-category', async (req, res) => {
  try {
    const userId = req.userId;
    const month = req.query.month || new Date().toISOString().split('T')[0].slice(0, 7);
    
    // Ambil transaksi bulan ini
    const startDate = `${month}-01`;
    const endDate = new Date(month + '-01');
    endDate.setMonth(endDate.getMonth() + 1);
    const endDateStr = endDate.toISOString().split('T')[0];
    
    const { data: transactions, error: txError } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lt('date', endDateStr);
    
    if (txError) {
      return res.status(400).json({
        error: { message: txError.message, status: 400 }
      });
    }
    
    // Ambil categories
    const { data: categories } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', userId);
    
    // Group by category
    const byCategory = {};
    
    transactions.forEach(tx => {
      const cat = categories?.find(c => c.id === tx.category_id);
      const categoryName = cat ? cat.name : 'Other';
      
      if (!byCategory[categoryName]) {
        byCategory[categoryName] = {
          category: categoryName,
          income: 0,
          expense: 0
        };
      }
      
      if (tx.type === 'income') {
        byCategory[categoryName].income += parseFloat(tx.amount);
      } else {
        byCategory[categoryName].expense += parseFloat(tx.amount);
      }
    });
    
    const result = Object.values(byCategory).map(item => ({
      category: item.category,
      income: parseFloat(item.income.toFixed(2)),
      expense: parseFloat(item.expense.toFixed(2))
    }));
    
    res.json({
      month,
      byCategory: result
    });
  } catch (err) {
    console.error('Get by-category error:', err);
    res.status(500).json({
      error: { message: 'Failed to get category breakdown', status: 500 }
    });
  }
});

/**
 * GET /api/reports/trends
 * Get monthly trends (last 6 months)
 */
router.get('/trends', async (req, res) => {
  try {
    const userId = req.userId;
    
    // Get last 6 months
    const trends = [];
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const month = date.toISOString().split('T')[0].slice(0, 7);
      
      const startDate = `${month}-01`;
      const endDate = new Date(month + '-01');
      endDate.setMonth(endDate.getMonth() + 1);
      const endDateStr = endDate.toISOString().split('T')[0];
      
      const { data: transactions } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .gte('date', startDate)
        .lt('date', endDateStr);
      
      const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      
      const expense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      
      trends.push({
        month,
        income: parseFloat(income.toFixed(2)),
        expense: parseFloat(expense.toFixed(2)),
        net: parseFloat((income - expense).toFixed(2))
      });
    }
    
    res.json({
      trends
    });
  } catch (err) {
    console.error('Get trends error:', err);
    res.status(500).json({
      error: { message: 'Failed to get trends', status: 500 }
    });
  }
});

/**
 * GET /api/reports/export
 * Export transactions to Excel
 * Query params: month (YYYY-MM)
 */
router.get('/export', async (req, res) => {
  try {
    const userId = req.userId;
    const month = req.query.month || new Date().toISOString().split('T')[0].slice(0, 7);
    
    // Ambil transaksi bulan ini
    const startDate = `${month}-01`;
    const endDate = new Date(month + '-01');
    endDate.setMonth(endDate.getMonth() + 1);
    const endDateStr = endDate.toISOString().split('T')[0];
    
    const { data: transactions, error: txError } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lt('date', endDateStr)
      .order('date', { ascending: false });
    
    if (txError) {
      return res.status(400).json({
        error: { message: txError.message, status: 400 }
      });
    }
    
    // Ambil categories
    const { data: categories } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', userId);
    
    // Generate Excel
    const buffer = await generateExcelReport(transactions, categories || [], month);
    
    // Send file
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="FinGlass_Report_${month}.xlsx"`);
    res.send(buffer);
  } catch (err) {
    console.error('Export error:', err);
    res.status(500).json({
      error: { message: 'Failed to generate export', status: 500 }
    });
  }
});

module.exports = router;
