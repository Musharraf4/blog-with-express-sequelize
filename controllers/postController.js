const { Post, User, Comment } = require('../db/models');
const { Sequelize } = require('sequelize');

// Create a new post
exports.createPost = async (req, res) => {
  const { title, content, category } = req.body;
  try {
    const post = await Post.create({
      title,
      content,
      category,
      UserId: req.user.UserId,
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
  }
};

exports.editPost = async (req, res) => {
  const { id } = req.params;
  const { title, content, category } = req.body;

  try {
    const post = await Post.findByPk(id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.UserId !== req.user.UserId) {
      return res.status(403).json({ error: 'Unauthorized to edit this post' });
    }

    await post.update({
      title,
      content,
      category,
    });

    // Respond with the updated post
    res.status(200).json({ message: "Post updated successfully" });
  } catch (error) {
    console.error('Error editing post:', error);
    res.status(500).json({ error: 'Failed to edit post' });
  }
};

exports.createPost = async (req, res) => {
  const { title, content, category } = req.body;
  try {
    const post = await Post.create({
      title,
      content,
      category,
      UserId: req.user.UserId,
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 6;
    const search = req.query.search || '';

    const offset = (page - 1) * limit;

    const posts = await Post.findAndCountAll({
      where: {
        title: {
          [Sequelize.Op.iLike]: `%${search}%`,
        },
      },
      include: {
        model: User,
        attributes: ['firstName', 'lastName', 'username'],
      },
      limit,
      offset,
      order: [['updatedAt', 'DESC']],
    });

    const totalPages = Math.ceil(posts.count / limit);

    res.status(200).json({
      currentPage: page,
      totalPages: totalPages,
      totalPosts: posts.count,
      posts: posts.rows,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

exports.getMyPosts = async (req, res) => {
  try {
    const UserId = req.user.UserId;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 6;
    const search = req.query.search || '';

    const offset = (page - 1) * limit;

    const posts = await Post.findAndCountAll({
      where: {
        UserId,
        title: {
          [Sequelize.Op.iLike]: `%${search}%`,
        },
      },
      include: {
        model: User,
        attributes: ['firstName', 'lastName', 'username'],
      },
      limit,
      offset,
      order: [['updatedAt', 'DESC']],
    });

    const totalPages = Math.ceil(posts.count / limit);

    res.status(200).json({
      currentPage: page,
      totalPages: totalPages,
      totalPosts: posts.count,
      posts: posts.rows,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

exports.getPost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findOne({
      where: { id },
      include: {
        model: User,
        attributes: ['firstName', 'lastName', 'username'],
      },
    });

    if (!post) {  
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch post' });
  }
};

exports.deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.UserId !== req.user.UserId) {
      return res.status(403).json({ error: 'Unauthorized to delete this post' });
    }
    await post.destroy();
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
};