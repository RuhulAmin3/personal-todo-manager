import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.render('pages/home');
});

router.get('/login', (req, res) => {
  res.render('pages/login');
});

router.get('/signup', (req, res) => {
  res.render('pages/signup');
});

router.get('/dashboard', (req, res) => {
  res.render('pages/dashboard');
});

router.get('/profile', (req, res) => {
  res.render('pages/profile');
});

export default router;