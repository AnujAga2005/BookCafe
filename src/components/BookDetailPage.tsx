import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { ArrowLeft, Star, BookOpen, Heart, MessageCircle, Share2, Plus, Loader2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion } from 'motion/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { api } from '../services/api';
import { toast } from 'sonner@2.0.3';
import { useAuth } from '../contexts/AuthContext';

interface BookDetailPageProps {
  bookId: string;
  onBack: () => void;
}

export function BookDetailPage({ bookId, onBack }: BookDetailPageProps) {
  const { user } = useAuth();
  const [book, setBook] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addReviewDialogOpen, setAddReviewDialogOpen] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadBookDetails();
  }, [bookId]);

  const loadBookDetails = async () => {
    setLoading(true);
    try {
      // For now, use mock data
      // In production, you'd call: const result = await api.books.getById(bookId);
      
      // Mock book data
      setBook({
        id: bookId,
        title: 'The Name of the Wind',
        author: 'Patrick Rothfuss',
        coverImage: 'https://images.unsplash.com/photo-1711185892188-13f35959d3ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW50YXN5JTIwYm9vayUyMGNvdmVyfGVufDF8fHx8MTc1ODc5MDY4OHww&ixlib=rb-4.1.0&q=80&w=400',
        description: 'Told in Kvothe\'s own voice, this is the tale of the magically gifted young man who grows to be the most notorious wizard his world has ever seen. A high-action story written with a poet\'s hand, The Name of the Wind is a masterpiece that will transport readers into the body and mind of a wizard.',
        genre: ['Fantasy', 'Adventure'],
        pages: 662,
        publishedYear: 2007,
        isbn: '978-0756404079',
        avgRating: 4.5,
        totalReviews: 1234,
      });

      // Mock reviews
      setReviews([
        {
          id: '1',
          author: {
            displayName: 'Sarah Chen',
            username: 'sarah_reads',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1a7?w=32&h=32&fit=crop&crop=face',
          },
          rating: 5,
          content: 'Absolutely mesmerizing! Patrick Rothfuss has created a world so vivid and characters so compelling that I couldn\'t put this book down. The prose is beautiful and the storytelling is masterful.',
          createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
          likes: 42,
        },
        {
          id: '2',
          author: {
            displayName: 'Marcus Johnson',
            username: 'marcus_lit',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
          },
          rating: 4,
          content: 'Great start to a series. The magic system is interesting and Kvothe is a fascinating protagonist. Can\'t wait to read the rest!',
          createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
          likes: 28,
        },
      ]);
    } catch (error: any) {
      toast.error('Failed to load book details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddReview = async () => {
    if (!reviewText.trim() || rating === 0) {
      toast.error('Please provide a rating and review');
      return;
    }

    setSubmitting(true);
    try {
      // Create a post with the review
      await api.posts.createPost({
        content: reviewText,
        type: 'review',
        book: {
          bookId: book.id,
          title: book.title,
          author: book.author,
          coverImage: book.coverImage,
        },
        rating,
      });

      toast.success('Review posted!');
      setReviewText('');
      setRating(0);
      setAddReviewDialogOpen(false);
      
      // Reload reviews
      await loadBookDetails();
    } catch (error: any) {
      toast.error(error.message || 'Failed to post review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddToShelf = async (type: 'current' | 'finished' | 'wishlist') => {
    if (!book) return;

    try {
      const bookData = {
        bookId: book.id,
        title: book.title,
        author: book.author,
        coverImage: book.coverImage,
      };

      if (type === 'current') {
        await api.users.addCurrentlyReading(bookData);
        toast.success('Added to Currently Reading!');
      } else if (type === 'finished') {
        await api.users.markAsRead(bookData);
        toast.success('Added to Finished Books!');
      } else {
        await api.users.addToWishlist(bookData);
        toast.success('Added to Want to Read!');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to add book');
    }
  };

  const formatTimestamp = (timestamp: string | Date) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 30) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button onClick={onBack} variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Book not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button onClick={onBack} variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Book Header */}
        <Card className="mb-6 border-border/50 bg-gradient-to-br from-card/50 to-card backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Book Cover */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="flex-shrink-0"
              >
                <ImageWithFallback
                  src={book.coverImage}
                  alt={book.title}
                  className="w-64 h-96 object-cover rounded-lg shadow-2xl mx-auto md:mx-0"
                />
              </motion.div>

              {/* Book Info */}
              <div className="flex-1">
                <div className="mb-4">
                  <h1 className="text-4xl font-bold text-foreground mb-2">{book.title}</h1>
                  <p className="text-xl text-muted-foreground mb-4">by {book.author}</p>
                  
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(book.avgRating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-2 font-semibold">{book.avgRating}</span>
                    </div>
                    <span className="text-muted-foreground">
                      {book.totalReviews.toLocaleString()} reviews
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {book.genre.map((g: string) => (
                      <Badge key={g} variant="secondary">{g}</Badge>
                    ))}
                  </div>

                  <p className="text-foreground mb-6 leading-relaxed">{book.description}</p>

                  {/* Book Metadata */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 text-sm">
                    <div>
                      <p className="text-muted-foreground">Pages</p>
                      <p className="font-semibold">{book.pages}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Published</p>
                      <p className="font-semibold">{book.publishedYear}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">ISBN</p>
                      <p className="font-semibold">{book.isbn}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Button onClick={() => handleAddToShelf('current')}>
                    <BookOpen className="h-4 w-4 mr-2" />
                    Currently Reading
                  </Button>
                  <Button variant="secondary" onClick={() => handleAddToShelf('finished')}>
                    <Star className="h-4 w-4 mr-2" />
                    Finished
                  </Button>
                  <Button variant="outline" onClick={() => handleAddToShelf('wishlist')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Want to Read
                  </Button>
                  <Dialog open={addReviewDialogOpen} onOpenChange={setAddReviewDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Write Review
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Write a Review</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Your Rating *</Label>
                          <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Button
                                key={star}
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setRating(star)}
                              >
                                <Star
                                  className={`h-8 w-8 ${
                                    star <= rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              </Button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Your Review *</Label>
                          <Textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="Share your thoughts about this book..."
                            rows={5}
                            maxLength={2000}
                          />
                          <p className="text-xs text-muted-foreground">
                            {reviewText.length}/2000 characters
                          </p>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setAddReviewDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddReview} disabled={submitting}>
                          {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Post Review
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reviews Section */}
        <Card>
          <CardHeader>
            <CardTitle>Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList>
                <TabsTrigger value="all">All Reviews</TabsTrigger>
                <TabsTrigger value="recent">Most Recent</TabsTrigger>
                <TabsTrigger value="helpful">Most Helpful</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 border border-border/50 rounded-lg"
                    >
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={review.author.avatar} />
                          <AvatarFallback>
                            {review.author.displayName.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="font-semibold">{review.author.displayName}</p>
                              <p className="text-sm text-muted-foreground">
                                @{review.author.username} · {formatTimestamp(review.createdAt)}
                              </p>
                            </div>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-foreground mb-3">{review.content}</p>
                          <div className="flex items-center space-x-4 text-sm">
                            <Button variant="ghost" size="sm">
                              <Heart className="h-4 w-4 mr-1" />
                              {review.likes}
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MessageCircle className="h-4 w-4 mr-1" />
                              Reply
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Share2 className="h-4 w-4 mr-1" />
                              Share
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground mb-4">No reviews yet</p>
                    <Button onClick={() => setAddReviewDialogOpen(true)}>
                      Be the first to review
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="recent">
                <p className="text-center text-muted-foreground py-12">
                  Showing most recent reviews
                </p>
              </TabsContent>

              <TabsContent value="helpful">
                <p className="text-center text-muted-foreground py-12">
                  Showing most helpful reviews
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
