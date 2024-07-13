const pool = require('../config/db');

exports.createBlog = async (req, res) => {
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
};

exports.likeBlog = async (req, res) => {
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
};

exports.listBlogs = async (req, res) => {
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
};
