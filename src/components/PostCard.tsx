import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Heart, MessageCircle, Share2, Send } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../services/api';
import { toast } from 'sonner@2.0.3';
import { useAuth } from '../contexts/AuthContext';

interface PostCardProps {
  post: any;
  onUpdate?: () => void;
  onUsernameClick?: (username: string) => void;
}

export function PostCard({ post, onUpdate, onUsernameClick }: PostCardProps) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(post.likes?.includes(user?.id) || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || post.likes?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const handleLike = async () => {
    try {
      if (isLiked) {
        await api.posts.unlikePost(post._id);
        setIsLiked(false);
        setLikesCount(prev => prev - 1);
      } else {
        await api.posts.likePost(post._id);
        setIsLiked(true);
        setLikesCount(prev => prev + 1);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update like');
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    
    setIsSubmittingComment(true);
    try {
      const result = await api.posts.addComment(post._id, commentText);
      setComments(result.comments);
      setCommentText('');
      toast.success('Comment added!');
      if (onUpdate) onUpdate();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add comment');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'review': return 'bg-blue-500/10 text-blue-700 dark:text-blue-300';
      case 'quote': return 'bg-purple-500/10 text-purple-700 dark:text-purple-300';
      case 'update': return 'bg-green-500/10 text-green-700 dark:text-green-300';
      case 'recommendation': return 'bg-orange-500/10 text-orange-700 dark:text-orange-300';
      case 'discussion': return 'bg-pink-500/10 text-pink-700 dark:text-pink-300';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatTimestamp = (timestamp: string | Date) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const author = post.author || post.user;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="mb-4 hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Avatar 
                className="h-10 w-10 ring-2 ring-primary/10 cursor-pointer hover:ring-primary/30 transition-all"
                onClick={() => onUsernameClick?.(author?.username)}
              >
                <AvatarImage src={author?.avatar} />
                <AvatarFallback>{author?.displayName?.substring(0, 2).toUpperCase() || 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <p 
                  className="font-semibold text-foreground cursor-pointer hover:text-primary transition-colors"
                  onClick={() => onUsernameClick?.(author?.username)}
                >
                  {author?.displayName || 'Unknown User'}
                </p>
                <p className="text-sm text-muted-foreground">
                  <span 
                    className="cursor-pointer hover:text-primary transition-colors"
                    onClick={() => onUsernameClick?.(author?.username)}
                  >
                    @{author?.username || 'unknown'}
                  </span> · {formatTimestamp(post.createdAt || post.timestamp)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className={getTypeColor(post.type)}>
                {post.type}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {post.book && (
            <div className="flex items-start space-x-3 mb-4 p-3 bg-muted/30 rounded-lg border border-border/30">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <ImageWithFallback
                  src={post.book.coverImage || post.book.cover}
                  alt={post.book.title}
                  className="w-16 h-20 object-cover rounded-md shadow-sm"
                />
              </motion.div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-foreground truncate">{post.book.title}</h4>
                <p className="text-sm text-muted-foreground">by {post.book.author}</p>
                {post.rating && (
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-sm ${i < post.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                        ★
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="text-foreground whitespace-pre-wrap mb-4">
            {post.content}
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-border/30">
            <div className="flex items-center space-x-6">
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className={`space-x-2 ${isLiked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-red-500'}`}
                >
                  <motion.div
                    animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                  </motion.div>
                  <span>{likesCount}</span>
                </Button>
              </motion.div>

              <Button 
                variant="ghost" 
                size="sm" 
                className="space-x-2 text-muted-foreground hover:text-primary"
                onClick={() => setShowComments(!showComments)}
              >
                <MessageCircle className="h-4 w-4" />
                <span>{comments.length}</span>
              </Button>

              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Comments Section */}
          <AnimatePresence>
            {showComments && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t border-border/30"
              >
                {/* Comment Input */}
                <div className="flex items-center space-x-2 mb-4">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback>{user?.displayName?.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 flex space-x-2">
                    <Input
                      placeholder="Write a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                      className="flex-1"
                    />
                    <Button
                      size="sm"
                      onClick={handleAddComment}
                      disabled={!commentText.trim() || isSubmittingComment}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-3">
                  {comments.map((comment: any, index: number) => (
                    <motion.div
                      key={comment._id || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-2"
                    >
                      <Avatar 
                        className="h-8 w-8 cursor-pointer" 
                        onClick={() => onUsernameClick?.(comment.author?.username)}
                      >
                        <AvatarImage src={comment.author?.avatar} />
                        <AvatarFallback>
                          {comment.author?.displayName?.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 bg-muted/30 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-1">
                          <p 
                            className="font-medium text-sm cursor-pointer hover:text-primary transition-colors"
                            onClick={() => onUsernameClick?.(comment.author?.username)}
                          >
                            {comment.author?.displayName}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-foreground">{comment.content}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
