// backend/routes/auth.js
// Authentication Routes

const express = require('express');
const { supabase } = require('../utils/database');

const router = express.Router();

/**
 * POST /api/auth/signup
 * Register user baru
 */
router.post('/signup', async (req, res) => {
  try {
    const { email, password, fullName } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: { message: 'Email dan password harus diisi', status: 400 }
      });
    }
    
    if (password.length < 6) {
      return res.status(400).json({
        error: { message: 'Password minimal 6 karakter', status: 400 }
      });
    }
    
    // Create user di Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || null
        }
      }
    });
    
    if (authError) {
      return res.status(400).json({
        error: { message: authError.message, status: 400 }
      });
    }
    
    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email,
        full_name: fullName || null
      });
    
    if (profileError) {
      console.error('Profile creation error:', profileError);
    }
    
    // Return success
    res.status(201).json({
      message: 'User berhasil didaftarkan',
      user: {
        id: authData.user.id,
        email: authData.user.email
      }
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({
      error: { message: 'Signup gagal', status: 500 }
    });
  }
});

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: { message: 'Email dan password harus diisi', status: 400 }
      });
    }
    
    // Authenticate dengan Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      return res.status(401).json({
        error: { message: 'Email atau password salah', status: 401 }
      });
    }
    
    // Return token & user
    res.json({
      message: 'Login berhasil',
      user: {
        id: data.user.id,
        email: data.user.email
      },
      session: {
        accessToken: data.session.access_token,
        expiresIn: data.session.expires_in,
        expiresAt: data.session.expires_at
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      error: { message: 'Login gagal', status: 500 }
    });
  }
});

/**
 * POST /api/auth/logout
 * Logout user (client-side only, token invalidation)
 */
router.post('/logout', (req, res) => {
  // In Supabase, just remove token from client
  // Server doesn't need to do anything
  res.json({
    message: 'Logout berhasil'
  });
});

/**
 * GET /api/auth/me
 * Get current user info (requires auth token)
 */
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: { message: 'Missing authorization header', status: 401 }
      });
    }
    
    const token = authHeader.substring(7);
    
    const { data, error } = await supabase.auth.getUser(token);
    
    if (error || !data.user) {
      return res.status(401).json({
        error: { message: 'Invalid token', status: 401 }
      });
    }
    
    // Get profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();
    
    res.json({
      user: {
        id: data.user.id,
        email: data.user.email,
        full_name: profile?.full_name
      }
    });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({
      error: { message: 'Failed to get user', status: 500 }
    });
  }
});

module.exports = router;
