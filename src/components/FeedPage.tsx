import React, { useState, useEffect } from 'react';
import { PostCard } from './PostCard';
import { Sidebar } from './Sidebar';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Plus, BookOpen, Quote, Sparkles, Heart, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../services/api';
import { toast } from 'sonner@2.0.3';

interface FeedPageProps {
  onUsernameClick?: (username: string) => void;
}

export function FeedPage({ onUsernameClick }: FeedPageProps) {
  const [newPost, setNewPost] = useState('');
  const [postType, setPostType] = useState<'update' | 'review' | 'recommendation' | 'discussion'>('update');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      setLoading(true);
      const result = await api.posts.getFeed();
      setPosts(result.posts || []);
    } catch (error: any) {
      console.error('Failed to fetch feed:', error);
      toast.error('Failed to load feed');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;
    
    setCreating(true);
    try {
      const result = await api.posts.createPost({
        content: newPost,
        type: postType as any,
      });
      
      toast.success('Post created successfully!');
      setNewPost('');
      setIsModalOpen(false);
      
      // Refresh feed
      await fetchFeed();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create post');
    } finally {
      setCreating(false);
    }
  };

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'review': return <Heart className="h-4 w-4" />;
      case 'quote': return <Quote className="h-4 w-4" />;
      case 'recommendation': return <Sparkles className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Create Post Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button 
                size="lg" 
                className="w-full justify-start space-x-2 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 border border-primary/20"
              >
                <Plus className="h-5 w-5" />
                <span>Share your reading journey...</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  {getPostTypeIcon(postType)}
                  <span>Create New Post</span>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Select value={postType} onValueChange={(value: any) => setPostType(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select post type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="update">📖 Reading Update</SelectItem>
                    <SelectItem value="review">⭐ Book Review</SelectItem>
                    <SelectItem value="recommendation">✨ Recommendation</SelectItem>
                    <SelectItem value="discussion">💭 Discussion</SelectItem>
                  </SelectContent>
                </Select>
                
                <Textarea
                  placeholder="What's on your mind? Share your thoughts, quotes, or recommendations..."
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="min-h-32 resize-none"
                  maxLength={500}
                />
                
                <div className="flex justify-between items-center">
                  <Badge variant="secondary" className="text-xs">
                    {newPost.length}/500 characters
                  </Badge>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreatePost} disabled={!newPost.trim() || creating}>
                      {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Post
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Feed Posts */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
            <p className="text-muted-foreground mb-4">Be the first to share your reading journey!</p>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Post
            </Button>
          </div>
        ) : (
          <AnimatePresence>
            {posts.map((post, index) => (
              <motion.div
                key={post._id || post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <PostCard post={post} onUpdate={fetchFeed} onUsernameClick={onUsernameClick} />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Sidebar */}
      <Sidebar onUsernameClick={onUsernameClick} />

      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-6 right-6 xl:hidden z-50">
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg" 
                className="rounded-full h-14 w-14 shadow-2xl bg-primary hover:bg-primary/90 border-2 border-primary/20"
              >
                <Plus className="h-6 w-6" />
              </Button>
            </motion.div>
          </DialogTrigger>
        </Dialog>
      </div>
    </div>
  );
}
