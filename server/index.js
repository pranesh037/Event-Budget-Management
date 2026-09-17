const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const path = require('path');
const { 
  getAdminByEmail, 
  getAdminById, 
  createAdmin, 
  getFacultyByEmail, 
  addFaculty, 
  getAllFaculty 
} = require('./db');
const { generateToken, authMiddleware } = require('./auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Simple email regex validator
const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

// ----------------------------------------------------
// ADMIN ROUTES
// ----------------------------------------------------

/**
 * 1. Admin Create Account (Register)
 */
app.post('/api/admin/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Admin Name is required.' });
    }
    if (!email || !email.trim() || !isValidEmail(email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid Admin Email ID.' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Password and Confirm Password do not match.' });
    }

    // Check if email already registered
    const existingAdmin = getAdminByEmail(email);
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: 'An Admin account with this email ID already exists.' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Save Admin
    const newAdmin = createAdmin(name.trim(), email.trim().toLowerCase(), hashedPassword);

    return res.status(201).json({
      success: true,
      message: 'Admin account created successfully! Please log in with your credentials.',
      admin: { id: newAdmin.id, name: newAdmin.name, email: newAdmin.email }
    });
  } catch (error) {
    console.error('Error in /api/admin/register:', error);
    return res.status(500).json({ success: false, message: 'Server error during admin registration.' });
  }
});

/**
 * 2. Admin Login
 */
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Admin Email ID is required.' });
    }
    if (!password) {
      return res.status(400).json({ success: false, message: 'Password is required.' });
    }

    // Fetch Admin
    const admin = getAdminByEmail(email.trim());
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid Admin credentials. Email not found.' });
    }

    // Verify Password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid Admin credentials. Incorrect password.' });
    }

    // Generate JWT
    const token = generateToken({ id: admin.id, name: admin.name, email: admin.email, role: 'admin' });

    return res.status(200).json({
      success: true,
      message: 'Admin login successful!',
      token,
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: 'admin'
      }
    });
  } catch (error) {
    console.error('Error in /api/admin/login:', error);
    return res.status(500).json({ success: false, message: 'Server error during admin login.' });
  }
});

/**
 * 3. Add Faculty (Admin only)
 */
app.post('/api/admin/add-faculty', authMiddleware('admin'), async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim() || !isValidEmail(email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid Faculty Email ID.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if faculty already exists
    const existingFaculty = getFacultyByEmail(cleanEmail);
    if (existingFaculty) {
      return res.status(400).json({
        success: false,
        message: `Faculty email '${cleanEmail}' has already been added to the system.`
      });
    }

    // Hash default password 'kongu@123'
    const defaultPassword = 'kongu@123';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // Save faculty in DB
    const newFaculty = addFaculty(cleanEmail, hashedPassword);

    return res.status(201).json({
      success: true,
      message: `Faculty member '${cleanEmail}' successfully added with default password 'kongu@123'.`,
      faculty: newFaculty
    });
  } catch (error) {
    console.error('Error in /api/admin/add-faculty:', error);
    return res.status(500).json({ success: false, message: 'Server error while adding faculty.' });
  }
});

/**
 * 4. Get Faculty List (Admin only)
 */
app.get('/api/admin/faculty-list', authMiddleware('admin'), (req, res) => {
  try {
    const facultyList = getAllFaculty();
    return res.status(200).json({
      success: true,
      faculty: facultyList
    });
  } catch (error) {
    console.error('Error in /api/admin/faculty-list:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching faculty list.' });
  }
});

// ----------------------------------------------------
// FACULTY ROUTES
// ----------------------------------------------------

/**
 * 5. Faculty Login
 */
app.post('/api/faculty/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Faculty Email ID (Username) is required.' });
    }
    if (!password) {
      return res.status(400).json({ success: false, message: 'Password is required.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Check if email was added by Admin
    const faculty = getFacultyByEmail(cleanEmail);
    if (!faculty) {
      return res.status(403).json({
        success: false,
        message: `Login rejected: Email '${cleanEmail}' has NOT been added by an Admin. Please contact your Admin to get authorized.`
      });
    }

    // 2. Check Password against stored hash
    const isMatch = await bcrypt.compare(password, faculty.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Login rejected: Incorrect password. Default password for authorized faculty is kongu@123.'
      });
    }

    // 3. Login successful
    const token = generateToken({ id: faculty.id, email: faculty.email, role: 'faculty' });

    return res.status(200).json({
      success: true,
      message: 'Faculty authentication successful!',
      token,
      user: {
        id: faculty.id,
        email: faculty.email,
        role: 'faculty',
        created_at: faculty.created_at
      }
    });
  } catch (error) {
    console.error('Error in /api/faculty/login:', error);
    return res.status(500).json({ success: false, message: 'Server error during faculty login.' });
  }
});

/**
 * 6. Get Current User Info
 */
app.get('/api/auth/me', authMiddleware(), (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user
  });
});

// Serve frontend assets in production build if needed
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`[Backend Server] Running on http://localhost:${PORT}`);
});
