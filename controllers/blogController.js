const Blog = require('../models/blog');

exports.createBlog = async (req, res) => {
    const { title, content } = req.body;

    try {
        const newBlog = await Blog.create(title, content, req.userId);
        res.status(201).json(newBlog);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.likeBlog = async (req, res) => {
    const blogId = req.params.id;

    try {
        await Blog.like(req.userId, blogId);
        res.status(200).json({ message: 'Blog post liked' });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.listBlogs = async (req, res) => {
    try {
        const blogs = await Blog.list();
        res.status(200).json(blogs);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
