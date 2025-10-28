import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { TrendingUp, Users, BookOpen, Coffee, Sparkles } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { toast } from 'sonner@2.0.3';

interface SidebarProps {
  onUsernameClick?: (username: string) => void;
}

export function Sidebar({ onUsernameClick }: SidebarProps) {
  const { user } = useAuth();
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [bookModalOpen, setBookModalOpen] = useState(false);

  const trendingBooks = [
    {
      title: "The Seven Husbands of Evelyn Hugo",
      author: "Taylor Jenkins Reid",
      cover: "https://images.unsplash.com/photo-1595123336219-5eedd543bc4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwYm9vayUyMGNvdmVyJTIwbm92ZWx8ZW58MXx8fHwxNzU4ODc5NDA4fDA&ixlib=rb-4.1.0&q=80&w=200",
      genre: "Romance"
    },
    {
      title: "Project Hail Mary",
      author: "Andy Weir",
      cover: "https://images.unsplash.com/photo-1567939466634-a04995d14c87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbmNlJTIwZmljdGlvbiUyMGJvb2t8ZW58MXx8fHwxNzU4NzY0MzE3fDA&ixlib=rb-4.1.0&q=80&w=200",
      genre: "Sci-Fi"
    },
    {
      title: "The Silent Patient",
      author: "Alex Michaelides",
      cover: "https://images.unsplash.com/photo-1698954634383-eba274a1b1c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxteXN0ZXJ5JTIwdGhyaWxsZXIlMjBib29rfGVufDF8fHx8MTc1ODgwODIyN3ww&ixlib=rb-4.1.0&q=80&w=200",
      genre: "Thriller"
    }
  ];

  const suggestedFriends = [
    {
      name: "Sarah Chen",
      username: "bookworm_sarah",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b1a7?w=32&h=32&fit=crop&crop=face",
      mutualBooks: 12
    },
    {
      name: "Marcus Johnson",
      username: "lit_lover_marcus",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
      mutualBooks: 8
    },
    {
      name: "Elena Rodriguez",
      username: "elena_reads",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=32&h=32&fit=crop&crop=face",
      mutualBooks: 15
    }
  ];

  const popularGenres = [
    { name: "Romance", count: 2847, color: "bg-pink-500" },
    { name: "Fantasy", count: 2456, color: "bg-purple-500" },
    { name: "Mystery", count: 1923, color: "bg-blue-500" },
    { name: "Sci-Fi", count: 1756, color: "bg-green-500" },
    { name: "Literary Fiction", count: 1532, color: "bg-amber-500" }
  ];

  // Get currently reading book from user data
  const currentlyReadingBook = user?.currentlyReading?.[0];

  const handleFollowUser = async (username: string) => {
    try {
      // For now, just show a toast - in production, you'd call the API
      toast.success(`Followed ${username}!`);
    } catch (error: any) {
      toast.error('Failed to follow user');
    }
  };

  const handleBookClick = (book: any) => {
    setSelectedBook(book);
    setBookModalOpen(true);
  };

  return (
    <div className="w-80 space-y-6 hidden xl:block">
      {/* Current Reading Progress - FROM DATABASE */}
      {currentlyReadingBook && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <span>Currently Reading</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-3">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <ImageWithFallback
                    src={currentlyReadingBook.coverImage}
                    alt={currentlyReadingBook.title}
                    className="w-16 h-20 object-cover rounded-md shadow-sm"
                  />
                </motion.div>
                <div className="flex-1 space-y-2">
                  <h4 className="font-semibold text-sm line-clamp-2">{currentlyReadingBook.title}</h4>
                  <p className="text-xs text-muted-foreground">by {currentlyReadingBook.author}</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Progress</span>
                      <span>{currentlyReadingBook.progress || 0}%</span>
                    </div>
                    <Progress value={currentlyReadingBook.progress || 0} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Trending Books */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>Trending This Week</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {trendingBooks.map((book, index) => (
              <motion.div
                key={book.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
                onClick={() => handleBookClick(book)}
              >
                <span className="text-sm font-bold text-muted-foreground w-4">#{index + 1}</span>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <ImageWithFallback
                    src={book.cover}
                    alt={book.title}
                    className="w-8 h-10 object-cover rounded"
                  />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{book.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{book.author}</p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {book.genre}
                </Badge>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Popular Genres */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span>Popular Genres</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {popularGenres.map((genre, index) => (
              <motion.div
                key={genre.name}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${genre.color}`} />
                  <span className="text-sm">{genre.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">{genre.count.toLocaleString()}</span>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Suggested Friends */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <span>Suggested Friends</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {suggestedFriends.map((friend, index) => (
              <motion.div
                key={friend.username}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center justify-between"
              >
                <div 
                  className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => onUsernameClick?.(friend.username)}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={friend.avatar} />
                    <AvatarFallback>{friend.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium hover:text-primary transition-colors">{friend.name}</p>
                    <p className="text-xs text-muted-foreground">{friend.mutualBooks} mutual books</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-xs"
                  onClick={() => handleFollowUser(friend.username)}
                >
                  Follow
                </Button>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Cozy Quote */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-accent/5 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-start space-x-2">
              <Coffee className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm italic text-foreground/80 mb-2">
                  "A reader lives a thousand lives before he dies. The man who never reads lives only one."
                </p>
                <p className="text-xs text-muted-foreground">— George R.R. Martin</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Book Detail Modal */}
      <Dialog open={bookModalOpen} onOpenChange={setBookModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Book Details</DialogTitle>
          </DialogHeader>
          {selectedBook && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <ImageWithFallback
                  src={selectedBook.cover}
                  alt={selectedBook.title}
                  className="w-24 h-32 object-cover rounded-lg shadow-md"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{selectedBook.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">by {selectedBook.author}</p>
                  <Badge variant="secondary">{selectedBook.genre}</Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" size="sm">
                  Add to Reading List
                </Button>
                <Button variant="outline" className="flex-1" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
