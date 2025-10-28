import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Search, Star, BookOpen, TrendingUp, Loader2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion } from 'motion/react';
import { api } from '../services/api';
import { toast } from 'sonner@2.0.3';
import { PostCard } from './PostCard';

interface ExplorePageProps {
  onUsernameClick?: (username: string) => void;
}

export function ExplorePage({ onUsernameClick }: ExplorePageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExplorePosts();
  }, []);

  const fetchExplorePosts = async () => {
    try {
      setLoading(true);
      const result = await api.posts.getExplore();
      setPosts(result.posts || []);
    } catch (error: any) {
      console.error('Failed to fetch explore posts:', error);
      toast.error('Failed to load explore content');
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post =>
    post.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.book?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.book?.author?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const postsByType = {
    all: filteredPosts,
    reviews: filteredPosts.filter(p => p.type === 'review'),
    recommendations: filteredPosts.filter(p => p.type === 'recommendation'),
    discussions: filteredPosts.filter(p => p.type === 'discussion')
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground">Explore</h1>
            <p className="text-muted-foreground">Discover new books and connect with readers</p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Posts</p>
                  <p className="text-2xl font-bold text-foreground">{posts.length}</p>
                </div>
                <BookOpen className="h-8 w-8 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Reviews</p>
                  <p className="text-2xl font-bold text-foreground">{postsByType.reviews.length}</p>
                </div>
                <Star className="h-8 w-8 text-yellow-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Recommendations</p>
                  <p className="text-2xl font-bold text-foreground">{postsByType.recommendations.length}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full max-w-2xl grid-cols-4">
              <TabsTrigger value="all">
                All ({postsByType.all.length})
              </TabsTrigger>
              <TabsTrigger value="reviews">
                Reviews ({postsByType.reviews.length})
              </TabsTrigger>
              <TabsTrigger value="recommendations">
                Recommendations ({postsByType.recommendations.length})
              </TabsTrigger>
              <TabsTrigger value="discussions">
                Discussions ({postsByType.discussions.length})
              </TabsTrigger>
            </TabsList>

            {loading ? (
              <div className="flex items-center justify-center py-12 mt-6">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <TabsContent value="all" className="space-y-4 mt-6">
                  {postsByType.all.length === 0 ? (
                    <div className="text-center py-12">
                      <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <h3 className="text-lg font-semibold mb-2">No posts found</h3>
                      <p className="text-muted-foreground">Try searching for something else</p>
                    </div>
                  ) : (
                    postsByType.all.map((post, index) => (
                      <motion.div
                        key={post._id || post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <PostCard post={post} onUpdate={fetchExplorePosts} onUsernameClick={onUsernameClick} />
                      </motion.div>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="reviews" className="space-y-4 mt-6">
                  {postsByType.reviews.length === 0 ? (
                    <div className="text-center py-12">
                      <Star className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
                      <p className="text-muted-foreground">Be the first to share a book review!</p>
                    </div>
                  ) : (
                    postsByType.reviews.map((post, index) => (
                      <motion.div
                        key={post._id || post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <PostCard post={post} onUpdate={fetchExplorePosts} onUsernameClick={onUsernameClick} />
                      </motion.div>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="recommendations" className="space-y-4 mt-6">
                  {postsByType.recommendations.length === 0 ? (
                    <div className="text-center py-12">
                      <TrendingUp className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <h3 className="text-lg font-semibold mb-2">No recommendations yet</h3>
                      <p className="text-muted-foreground">Share your favorite books with the community!</p>
                    </div>
                  ) : (
                    postsByType.recommendations.map((post, index) => (
                      <motion.div
                        key={post._id || post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <PostCard post={post} onUpdate={fetchExplorePosts} onUsernameClick={onUsernameClick} />
                      </motion.div>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="discussions" className="space-y-4 mt-6">
                  {postsByType.discussions.length === 0 ? (
                    <div className="text-center py-12">
                      <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <h3 className="text-lg font-semibold mb-2">No discussions yet</h3>
                      <p className="text-muted-foreground">Start a conversation about your favorite books!</p>
                    </div>
                  ) : (
                    postsByType.discussions.map((post, index) => (
                      <motion.div
                        key={post._id || post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <PostCard post={post} onUpdate={fetchExplorePosts} onUsernameClick={onUsernameClick} />
                      </motion.div>
                    ))
                  )}
                </TabsContent>
              </>
            )}
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
