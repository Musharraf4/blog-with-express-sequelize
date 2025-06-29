const express = require('express');
const { createPost, getPosts, getPost, getMyPosts, deletePost, editPost } = require('../controllers/postController');
const auth = require('../controllers/middleware');
const router = express.Router();

router.post('/', auth, createPost);
router.get('/myPosts', auth, getMyPosts);
router.delete('/:id', auth, deletePost);
router.put('/:id', auth, editPost);

// public routes
router.get('/', getPosts);
router.get('/:id', getPost);

module.exports = router;
