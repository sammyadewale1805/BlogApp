// src/controllers/postController.ts
import { Request, Response } from 'express';
import { Types } from 'mongoose'; // Import Types from mongoose
import Post, { IPost } from '../models/postModel'; // Import IPost and Post
import { isValidObjectIdString } from '../utils/typeGuards'; // Import type guard

// Service functions (inline types)
const getAllPosts = async (page: number, limit: number, filter: any): Promise<IPost[]> => {
  return await Post.find(filter)
    .limit(limit)
    .skip((page - 1) * limit)
    .populate('author', 'username');
};

const getPostById = async (id: string): Promise<IPost | null> => {
  return await Post.findById(id).populate('author', 'username');
};

const createPost = async (postData: Partial<IPost>): Promise<IPost> => {
  const post = new Post(postData);
  return await post.save();
};

const updatePost = async (id: string, postData: Partial<IPost>): Promise<IPost | null> => {
  return await Post.findByIdAndUpdate(id, postData, { new: true });
};

const deletePost = async (id: string): Promise<void> => {
  await Post.findByIdAndDelete(id);
};

// Controller handlers
export const getAllPostsHandler = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { page = 1, limit = 10, title } = req.query;
    const filter: { title?: { $regex: string; $options: string } } = {};
    if (title) filter.title = { $regex: title as string, $options: 'i' };

    const posts = await getAllPosts(Number(page), Number(limit), filter);
    return res.json(posts);
  } catch (err) {
    return res.status(500).json({ message: err instanceof Error ? err.message : 'Server error' });
  }
};

export const getPostByIdHandler = async (req: Request, res: Response): Promise<Response> => {
  try {
    const post = await getPostById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    return res.json(post);
  } catch (err) {
    return res.status(500).json({ message: err instanceof Error ? err.message : 'Server error' });
  }
};

// src/controllers/postController.ts
export const createPostHandler = async (req: Request, res: Response): Promise<Response> => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!Types.ObjectId.isValid(req.user._id)) {
      return res.status(400).json({ message: 'Invalid user ID.' });
    }

    const postData: Partial<IPost> = {
      title: req.body.title,
      content: req.body.content,
      author: req.user.id as unknown as any
    };

    const newPost = await createPost(postData);
    return res.status(201).json(newPost);
  } catch (err) {
    return res.status(400).json({ message: err instanceof Error ? err.message : 'Bad request' });
  }
};

export const updatePostHandler = async (req: Request, res: Response): Promise<Response> => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const post = await getPostById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (!isValidObjectIdString(req.user.id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to update this post' });
    }

    const updatedPost = await updatePost(req.params.id, {
      title: req.body.title || post.title,
      content: req.body.content || post.content,
    });
    return res.json(updatedPost);
  } catch (err) {
    return res.status(400).json({ message: err instanceof Error ? err.message : 'Bad request' });
  }
};

export const deletePostHandler = async (req: Request, res: Response): Promise<Response> => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const post = await getPostById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Ensure req.user._id is a valid ObjectId string
    if (!isValidObjectIdString(req.user.id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to delete this post' });
    }

    await deletePost(req.params.id);
    return res.json({ message: 'Post deleted' });
  } catch (err) {
    return res.status(500).json({ message: err instanceof Error ? err.message : 'Server error' });
  }
};