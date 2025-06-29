const express = require('express');
const { addComment, deleteComment, getComments } = require('../controllers/commentController');
const auth = require('../controllers/middleware');
const router = express.Router();

router.post('/:id', auth, addComment);
router.delete('/', auth, deleteComment);
router.get('/:id', getComments);

module.exports = router;
