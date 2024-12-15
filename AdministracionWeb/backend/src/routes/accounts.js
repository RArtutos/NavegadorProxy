import express from 'express';
import Account from '../models/Account.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all accounts (admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const accounts = await Account.find().populate('group');
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's accessible accounts
router.get('/user', auth, async (req, res) => {
  try {
    const accounts = await Account.find({
      group: { $in: req.user.groups }
    }).populate('group');
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new account (admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const account = new Account(req.body);
    await account.save();
    res.status(201).json(account);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get account cookies
router.get('/:id/cookies', auth, async (req, res) => {
  try {
    const account = await Account.findById(req.id);
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }
    res.json({
      domain: account.domain,
      cookies: account.cookies
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update account (admin only)
router.patch('/:id', adminAuth, async (req, res) => {
  try {
    const account = await Account.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }
    res.json(account);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete account (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const account = await Account.findByIdAndDelete(req.params.id);
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;