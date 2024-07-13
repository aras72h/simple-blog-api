const express = require('express');
const blogController = require('../controllers/blogController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware.verifyToken, blogController.createBlog);
router.post('/:id/like', authMiddleware.verifyToken, blogController.likeBlog);
router.get('/', blogController.listBlogs);

module.exports = router;