// src/services/postService.ts
import Post, { IPost } from '../models/postModel';

export const getAllPosts = async (page: number, limit: number, filter: any) => {
  return await Post.find(filter)
    .limit(limit)
    .skip((page - 1) * limit)
    .populate('author', 'username');
};

export const getPostById = async (id: string) => {
  return await Post.findById(id).populate('author', 'username');
};

export const createPost = async (postData: Partial<IPost>) => {
  const post = new Post(postData);
  return await post.save();
};

export const updatePost = async (id: string, postData: Partial<IPost>) => {
  return await Post.findByIdAndUpdate(id, postData, { new: true });
};

export const deletePost = async (id: string) => {
  return await Post.findByIdAndDelete(id);
};