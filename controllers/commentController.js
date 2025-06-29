const { Comment, Post, User } = require('../db/models');

exports.addComment = async (req, res) => {
  const { content } = req.body;
  const { id } = req.params

  try {

    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const comment = await Comment.create({
      content,
      UserId: req.user.UserId,
      PostId: id,
    });

    const commentWithUserInfo = await Comment.findOne({
      where: { id: comment.id },
      include: [
        {
          model: User,
          as: 'user', 
          attributes: ['username', 'firstName', 'lastName'],
        },
      ],
    });

    res.status(201).json({data:commentWithUserInfo});
  } catch (error) {
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

exports.deleteComment = async (req, res) => {
  const { id } = req.body; // Comment ID from URL parameters

  try {
    // Find the comment by primary key
    const comment = await Comment.findByPk(id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Check if the authenticated user is the owner of the comment
    if (comment.UserId !== req.user.UserId) {
      return res.status(403).json({ error: 'Unauthorized to delete this comment' });
    }

    // Delete the comment
    await comment.destroy();

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete comment' });
  }
};

exports.getComments = async (req, res) => {
  const { id } = req.params;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 6;
  const offset = (page - 1) * limit;
  try {
    const comments = await Comment.findAll({
      where: {
        PostId: id,
      },
      include: {
        model: User,
        as: 'user',
        attributes: ['firstName', 'lastName', 'username'],
      },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });
    res.json({ comments });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};