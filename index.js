const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('./db'); // Import the database connection

const app = express();
const port = 3000;
const secret = 'mysecret'; // Simple secret for JWT

// Middleware
app.use(bodyParser.json());

// User Registration
app.post('/auth/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const result = await pool.query(
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
            [username, hashedPassword]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(400).json({ error: 'Username already exists' });
    }
});

// User Login
app.post('/auth/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];
        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Middleware to Verify JWT
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    if (!authHeader) {
        return res.status(403).json({ error: 'No token provided' });
    }

    // Check if the token starts with 'Bearer '
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7, authHeader.length) : authHeader;

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to authenticate token' });
        }

        req.userId = decoded.userId;
        next();
    });
};

// Create Blog Post (Protected)
app.post('/blog', verifyToken, async (req, res) => {
    const { title, content } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO blogs (user_id, title, content) VALUES ($1, $2, $3) RETURNING *',
            [req.userId, title, content]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Like Blog Post (Protected)
app.post('/blog/:id/like', verifyToken, async (req, res) => {
    const blogId = req.params.id;

    try {
        await pool.query(
            'INSERT INTO user_like_blog (user_id, blog_id) VALUES ($1, $2)',
            [req.userId, blogId]
        );
        res.status(200).json({ message: 'Blog post liked' });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// List Blog Posts with Number of Likes
app.get('/blog', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT blogs.*, COUNT(user_like_blog.blog_id) AS likes
       FROM blogs
       LEFT JOIN user_like_blog ON blogs.id = user_like_blog.blog_id
       GROUP BY blogs.id
       ORDER BY blogs.created_at DESC`
        );
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the Server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
