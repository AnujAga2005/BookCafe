import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { BookOpen, Users, Calendar, Award, ArrowLeft, UserPlus, UserMinus } from 'lucide-react';
import { PostCard } from './PostCard';
import { motion } from 'motion/react';
import { api } from '../services/api';
import { toast } from 'sonner@2.0.3';
import { useAuth } from '../contexts/AuthContext';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface UserProfilePageProps {
  username: string;
  onBack: () => void;
  onUsernameClick: (username: string) => void;
}

export function UserProfilePage({ username, onBack, onUsernameClick }: UserProfilePageProps) {
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, [username]);

  const loadUserProfile = async () => {
    setLoading(true);
    try {
      const [profileResult, postsResult] = await Promise.all([
        api.users.getProfile(username),
        api.posts.getUserPosts(username)
      ]);

      setUser(profileResult.user);
      setPosts(postsResult.posts);
      
      // Check if current user is following this user
      if (currentUser && profileResult.user.id !== currentUser.id) {
        setIsFollowing(currentUser.followingCount && currentUser.following?.includes(profileResult.user.id));
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!user) return;
    
    try {
      if (isFollowing) {
        await api.users.unfollowUser(user.id);
        setIsFollowing(false);
        toast.success(`Unfollowed ${user.displayName}`);
      } else {
        await api.users.followUser(user.id);
        setIsFollowing(true);
        toast.success(`Following ${user.displayName}`);
      }
      loadUserProfile();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update follow status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button onClick={onBack} variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">User not found</p>
          </div>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?.username === username;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button onClick={onBack} variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Profile Header */}
        <Card className="mb-6 border-border/50 bg-gradient-to-br from-card/50 to-card backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="h-24 w-24 ring-4 ring-primary/20">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="text-2xl">{user.displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-1">{user.displayName}</h1>
                    <p className="text-muted-foreground">@{user.username}</p>
                  </div>
                  {!isOwnProfile && (
                    <Button onClick={handleFollow} className="mt-4 md:mt-0">
                      {isFollowing ? (
                        <>
                          <UserMinus className="h-4 w-4 mr-2" />
                          Unfollow
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Follow
                        </>
                      )}
                    </Button>
                  )}
                </div>

                {user.bio && (
                  <p className="text-foreground mb-4">{user.bio}</p>
                )}

                {user.favoriteGenres && user.favoriteGenres.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                    {user.favoriteGenres.map((genre: string) => (
                      <Badge key={genre} variant="secondary">{genre}</Badge>
                    ))}
                  </div>
                )}

                {/* Stats */}
                <div className="flex flex-wrap gap-6 justify-center md:justify-start text-sm">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">
                      <span className="font-semibold text-foreground">{user.booksRead || 0}</span> books read
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">
                      <span className="font-semibold text-foreground">{user.followersCount || 0}</span> followers
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">
                      <span className="font-semibold text-foreground">{user.followingCount || 0}</span> following
                    </span>
                  </div>
                  {user.readingStreak && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">
                        <span className="font-semibold text-foreground">{user.readingStreak.current || 0}</span> day streak
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="posts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="reading">Reading</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
          </TabsList>

          {/* Posts Tab */}
          <TabsContent value="posts" className="space-y-4">
            {posts.length > 0 ? (
              posts.map((post) => (
                <PostCard 
                  key={post._id} 
                  post={post} 
                  onUsernameClick={onUsernameClick}
                />
              ))
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No posts yet</p>
              </Card>
            )}
          </TabsContent>

          {/* Reading Tab */}
          <TabsContent value="reading" className="space-y-6">
            {/* Currently Reading */}
            {user.currentlyReading && user.currentlyReading.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Currently Reading</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {user.currentlyReading.map((book: any) => (
                    <motion.div
                      key={book.bookId}
                      whileHover={{ scale: 1.05 }}
                      className="group cursor-pointer"
                    >
                      <div className="relative">
                        <ImageWithFallback
                          src={book.coverImage}
                          alt={book.title}
                          className="w-full aspect-[2/3] object-cover rounded-md shadow-md group-hover:shadow-xl transition-shadow"
                        />
                      </div>
                      <p className="text-sm mt-2 text-foreground line-clamp-2">{book.title}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Read Books */}
            {user.readBooks && user.readBooks.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Finished Books</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {user.readBooks.map((book: any) => (
                    <motion.div
                      key={book.bookId}
                      whileHover={{ scale: 1.05 }}
                      className="group cursor-pointer"
                    >
                      <div className="relative">
                        <ImageWithFallback
                          src={book.coverImage}
                          alt={book.title}
                          className="w-full aspect-[2/3] object-cover rounded-md shadow-md group-hover:shadow-xl transition-shadow"
                        />
                      </div>
                      <p className="text-sm mt-2 text-foreground line-clamp-2">{book.title}</p>
                      {book.rating && (
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-xs ${i < book.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                              ★
                            </span>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Badges Tab */}
          <TabsContent value="badges">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {user.badges && user.badges.length > 0 ? (
                user.badges.map((badge: any, index: number) => (
                  <motion.div
                    key={badge.id || index}
                    whileHover={{ scale: 1.02 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-4 text-center hover:shadow-lg transition-shadow">
                      <div className="text-4xl mb-2">{badge.icon}</div>
                      <h4 className="font-semibold mb-1">{badge.name}</h4>
                      <p className="text-sm text-muted-foreground">{badge.description}</p>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <Card className="p-8 text-center col-span-full">
                  <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No badges earned yet</p>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
