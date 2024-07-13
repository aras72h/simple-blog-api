const pool = require('../config/db');

class Blog {
    constructor(title, content, userId) {
        this.title = title;
        this.content = content;
        this.userId = userId;
    }

    static async create(title, content, userId) {
        const result = await pool.query(
            'INSERT INTO blogs (user_id, title, content) VALUES ($1, $2, $3) RETURNING *',
            [userId, title, content]
        );
        return result.rows[0];
    }

    static async like(userId, blogId) {
        await pool.query(
            'INSERT INTO user_like_blog (user_id, blog_id) VALUES ($1, $2)',
            [userId, blogId]
        );
    }

    static async list() {
        const result = await pool.query(
            `SELECT blogs.*, COUNT(user_like_blog.blog_id) AS likes
             FROM blogs
             LEFT JOIN user_like_blog ON blogs.id = user_like_blog.blog_id
             GROUP BY blogs.id
             ORDER BY blogs.created_at DESC`
        );
        return result.rows;
    }
}

module.exports = Blog;
