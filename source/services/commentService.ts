import Comment, { IComment } from '../models/commentModel';
import Post from '../models/postModel';

// Get all comments for a post
export const getCommentsForPost = async (postId: string): Promise<IComment[]> => {
  return await Comment.find({ post: postId }).populate('author', 'username');
};

// Add a comment to a post
export const addCommentToPost = async (
  postId: string,
  content: string,
  authorId: string
): Promise<IComment> => {
  const comment = new Comment({ content, post: postId, author: authorId });
  return await comment.save();
};

// Delete a comment by ID
export const deleteComment = async (commentId: string): Promise<void> => {
  await Comment.findByIdAndDelete(commentId);
};