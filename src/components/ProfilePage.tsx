import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Calendar, BookOpen, Star, Target, Award, Users, Loader2, Upload, Camera, X, Plus, Trash2, Flame, Check } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { toast } from 'sonner@2.0.3';

export function ProfilePage() {
  const { user: currentUser, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('currently-reading');
  const [profileUser, setProfileUser] = useState(currentUser);
  const [loading, setLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addBookDialogOpen, setAddBookDialogOpen] = useState(false);
  const [bookShelfType, setBookShelfType] = useState<'current' | 'finished' | 'wishlist'>('current');
  
  // Edit form state
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [readingGoal, setReadingGoal] = useState(currentUser?.readingGoal || 12);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Add book form state
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookAuthor, setNewBookAuthor] = useState('');
  const [newBookPages, setNewBookPages] = useState(0);
  const [newBookRating, setNewBookRating] = useState(0);
  const [newBookReview, setNewBookReview] = useState('');
  const [uploadingBookCover, setUploadingBookCover] = useState(false);
  const [bookCoverUrl, setBookCoverUrl] = useState('');

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bookCoverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setProfileUser(currentUser);
    if (currentUser) {
      setDisplayName(currentUser.displayName);
      setBio(currentUser.bio || '');
      setReadingGoal(currentUser.readingGoal || 12);
    }
  }, [currentUser]);

  useEffect(() => {
    // Update streak on component mount
    if (currentUser) {
      api.user.updateStreak().catch(err => console.log('Streak update failed:', err));
    }
  }, [currentUser]);

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'bookcafe'); // You'll need to create this in Cloudinary
    formData.append('cloud_name', 'dqroknlpz'); // Replace with your Cloudinary cloud name

    try {
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/dqroknlpz/image/upload', // Replace your_cloud_name
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      if (data.secure_url) {
        return data.secure_url;
      }
      throw new Error('Upload failed');
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error('Failed to upload image');
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setUploadingAvatar(true);
    try {
      const imageUrl = await uploadToCloudinary(file);
      
      const result = await api.users.updateProfile({
        avatar: imageUrl,
      });
      
      if (result.user) {
        updateUser(result.user);
        toast.success('Profile picture updated!');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload profile picture');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleBookCoverUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setUploadingBookCover(true);
    try {
      const imageUrl = await uploadToCloudinary(file);
      setBookCoverUrl(imageUrl);
      toast.success('Cover uploaded!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload cover image');
    } finally {
      setUploadingBookCover(false);
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const result = await api.users.updateProfile({
        displayName,
        bio,
        readingGoal,
      });
      
      if (result.user) {
        updateUser(result.user);
        toast.success('Profile updated successfully!');
        setEditDialogOpen(false);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async () => {
    if (!newBookTitle.trim() || !newBookAuthor.trim()) {
      toast.error('Please enter book title and author');
      return;
    }

    setLoading(true);
    try {
      const bookData = {
        bookId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: newBookTitle,
        author: newBookAuthor,
        coverImage: bookCoverUrl || 'https://via.placeholder.com/400x600?text=No+Cover',
        pages: newBookPages || 0,
        ...(bookShelfType === 'finished' && {
          rating: newBookRating,
          review: newBookReview,
        }),
      };

      if (bookShelfType === 'current') {
        await api.users.addCurrentlyReading(bookData);
        toast.success('Added to Currently Reading!');
      } else if (bookShelfType === 'finished') {
        await api.users.markAsRead(bookData);
        // Recalculate average rating
        await api.user.calculateAvgRating();
        toast.success('Added to Finished!');
      } else {
        await api.users.addToWishlist(bookData);
        toast.success('Added to Want to Read!');
      }

      // Refresh user data
      const updatedUser = await api.auth.getMe();
      updateUser(updatedUser.user);

      // Reset form
      setNewBookTitle('');
      setNewBookAuthor('');
      setNewBookPages(0);
      setNewBookRating(0);
      setNewBookReview('');
      setBookCoverUrl('');
      setAddBookDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to add book');
    } finally {
      setLoading(false);
    }
  };

  const handleFinishBook = async (book: any) => {
    setLoading(true);
    try {
      // Add to finished books
      await api.users.markAsRead({
        bookId: book.bookId,
        title: book.title,
        author: book.author,
        coverImage: book.coverImage,
        rating: 0, // User can rate later
        pages: book.pages || 0
      });

      // Remove from currently reading
      await api.users.removeFromCurrentlyReading(book.bookId);

      // Refresh user data
      const updatedUser = await api.auth.getMe();
      updateUser(updatedUser.user);
      toast.success('Book marked as finished! 🎉');
    } catch (error: any) {
      toast.error(error.message || 'Failed to finish book');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBook = async (bookId: string, type: 'current' | 'finished' | 'wishlist') => {
    setLoading(true);
    try {
      if (type === 'current') {
        await api.users.removeFromCurrentlyReading(bookId);
      } else if (type === 'finished') {
        await api.users.removeFromFinished(bookId);
        // Recalculate average rating
        await api.user.calculateAvgRating();
      } else {
        await api.users.removeFromWishlist(bookId);
      }

      // Refresh user data
      const updatedUser = await api.auth.getMe();
      updateUser(updatedUser.user);
      toast.success('Book removed');
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove book');
    } finally {
      setLoading(false);
    }
  };

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const readingProgress = profileUser.booksRead || 0;
  const goalProgress = (readingProgress / (profileUser.readingGoal || 12)) * 100;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Profile Header */}
        <Card className="border-border/50 bg-gradient-to-br from-card/50 to-card backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              {/* Avatar with Upload */}
              <div className="relative group">
                <Avatar className="h-24 w-24 ring-4 ring-primary/20">
                  <AvatarImage src={profileUser.avatar} />
                  <AvatarFallback className="text-2xl">
                    {profileUser.displayName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={uploadingAvatar}
                >
                  {uploadingAvatar ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                </Button>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-1">
                      {profileUser.displayName}
                    </h1>
                    <p className="text-muted-foreground">@{profileUser.username}</p>
                  </div>
                  <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="mt-4 md:mt-0">Edit Profile</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="displayName">Display Name</Label>
                          <Input
                            id="displayName"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows={3}
                            maxLength={500}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="readingGoal">Yearly Reading Goal</Label>
                          <Input
                            id="readingGoal"
                            type="number"
                            value={readingGoal}
                            onChange={(e) => setReadingGoal(parseInt(e.target.value) || 12)}
                            min={1}
                            max={999}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleUpdateProfile} disabled={loading}>
                          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Save Changes
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                {profileUser.bio && (
                  <p className="text-foreground mb-4">{profileUser.bio}</p>
                )}

                {/* Stats */}
                <div className="flex flex-wrap gap-6 justify-center md:justify-start text-sm mb-4">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">
                      <span className="font-semibold text-foreground">{profileUser.booksRead || 0}</span> books read
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">
                      <span className="font-semibold text-foreground">{profileUser.followersCount || 0}</span> followers
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">
                      <span className="font-semibold text-foreground">{profileUser.followingCount || 0}</span> following
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Flame className="h-4 w-4 text-orange-500" />
                    <span className="text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        {profileUser.readingStreak?.current || 0}
                      </span> day streak
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        {profileUser.avgRating?.toFixed(1) || '0.0'}
                      </span> avg rating
                    </span>
                  </div>
                </div>

                {/* Reading Goal Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      <Target className="inline h-4 w-4 mr-1 text-primary" />
                      Reading Goal Progress
                    </span>
                    <span className="font-semibold text-foreground">
                      {readingProgress} / {profileUser.readingGoal || 12} books
                    </span>
                  </div>
                  <Progress value={Math.min(goalProgress, 100)} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
            <TabsTrigger value="currently-reading">Currently Reading</TabsTrigger>
            <TabsTrigger value="finished">Finished</TabsTrigger>
            <TabsTrigger value="want-to-read">Want to Read</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
          </TabsList>

          {/* Currently Reading Tab */}
          <TabsContent value="currently-reading" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Currently Reading</h3>
              <Dialog open={addBookDialogOpen && bookShelfType === 'current'} onOpenChange={(open) => {
                setAddBookDialogOpen(open);
                if (open) setBookShelfType('current');
              }}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Book
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add to Currently Reading</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Book Title *</Label>
                      <Input
                        value={newBookTitle}
                        onChange={(e) => setNewBookTitle(e.target.value)}
                        placeholder="Enter book title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Author *</Label>
                      <Input
                        value={newBookAuthor}
                        onChange={(e) => setNewBookAuthor(e.target.value)}
                        placeholder="Enter author name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Number of Pages (Optional)</Label>
                      <Input
                        type="number"
                        value={newBookPages || ''}
                        onChange={(e) => setNewBookPages(parseInt(e.target.value) || 0)}
                        placeholder="Enter number of pages"
                        min="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Cover Image (Optional)</Label>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => bookCoverInputRef.current?.click()}
                          disabled={uploadingBookCover}
                          className="flex-1"
                        >
                          {uploadingBookCover ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Upload className="h-4 w-4 mr-2" />
                          )}
                          Upload Cover
                        </Button>
                        {bookCoverUrl && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setBookCoverUrl('')}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      {bookCoverUrl && (
                        <img src={bookCoverUrl} alt="Cover preview" className="w-20 h-28 object-cover rounded mt-2" />
                      )}
                      <input
                        ref={bookCoverInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleBookCoverUpload}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setAddBookDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddBook} disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Add Book
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {profileUser.currentlyReading && profileUser.currentlyReading.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {profileUser.currentlyReading.map((book: any) => (
                  <motion.div
                    key={book.bookId}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative group"
                  >
                    <ImageWithFallback
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full aspect-[2/3] object-cover rounded-md shadow-md group-hover:shadow-xl transition-shadow"
                    />
                    <p className="text-sm mt-2 text-foreground line-clamp-2">{book.title}</p>
                    <p className="text-xs text-muted-foreground mb-2">{book.author}</p>
                    <div className="flex gap-1 mt-2">
                      <Button
                        size="sm"
                        // I am removing variant="default" AND adding !important modifiers 
                        // to the className to ensure color is applied.
                        className="h-7 flex-1 **!bg-green-600 hover:!bg-green-700 !text-white**" 
                        onClick={() => handleFinishBook(book)}
                        title="Mark as finished"
                        disabled={loading}
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Finish
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-7 px-2"
                        onClick={() => handleRemoveBook(book.bookId, 'current')}
                        title="Remove"
                        disabled={loading}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No books currently reading</p>
              </Card>
            )}
          </TabsContent>

          {/* Finished Tab */}
          <TabsContent value="finished" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Finished Books</h3>
              <Dialog open={addBookDialogOpen && bookShelfType === 'finished'} onOpenChange={(open) => {
                setAddBookDialogOpen(open);
                if (open) setBookShelfType('finished');
              }}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Book
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add to Finished Books</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Book Title *</Label>
                      <Input
                        value={newBookTitle}
                        onChange={(e) => setNewBookTitle(e.target.value)}
                        placeholder="Enter book title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Author *</Label>
                      <Input
                        value={newBookAuthor}
                        onChange={(e) => setNewBookAuthor(e.target.value)}
                        placeholder="Enter author name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Number of Pages (Optional)</Label>
                      <Input
                        type="number"
                        value={newBookPages || ''}
                        onChange={(e) => setNewBookPages(parseInt(e.target.value) || 0)}
                        placeholder="Enter number of pages"
                        min="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Rating (Optional)</Label>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Button
                            key={star}
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setNewBookRating(star)}
                          >
                            <Star
                              className={`h-6 w-6 ${
                                star <= newBookRating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Review (Optional)</Label>
                      <Textarea
                        value={newBookReview}
                        onChange={(e) => setNewBookReview(e.target.value)}
                        placeholder="Write your review..."
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Cover Image (Optional)</Label>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => bookCoverInputRef.current?.click()}
                          disabled={uploadingBookCover}
                          className="flex-1"
                        >
                          {uploadingBookCover ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Upload className="h-4 w-4 mr-2" />
                          )}
                          Upload Cover
                        </Button>
                        {bookCoverUrl && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setBookCoverUrl('')}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      {bookCoverUrl && (
                        <img src={bookCoverUrl} alt="Cover preview" className="w-20 h-28 object-cover rounded mt-2" />
                      )}
                      <input
                        ref={bookCoverInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleBookCoverUpload}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setAddBookDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddBook} disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Add Book
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {profileUser.readBooks && profileUser.readBooks.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {profileUser.readBooks.map((book: any) => (
                  <motion.div
                    key={book.bookId}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative group"
                  >
                    <ImageWithFallback
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full aspect-[2/3] object-cover rounded-md shadow-md group-hover:shadow-xl transition-shadow"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveBook(book.bookId, 'finished')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    <p className="text-sm mt-2 text-foreground line-clamp-2">{book.title}</p>
                    <p className="text-xs text-muted-foreground">{book.author}</p>
                    {book.rating && (
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-xs ${i < book.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No finished books yet</p>
              </Card>
            )}
          </TabsContent>

          {/* Want to Read Tab */}
          <TabsContent value="want-to-read" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Want to Read</h3>
              <Dialog open={addBookDialogOpen && bookShelfType === 'wishlist'} onOpenChange={(open) => {
                setAddBookDialogOpen(open);
                if (open) setBookShelfType('wishlist');
              }}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Book
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add to Want to Read</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Book Title *</Label>
                      <Input
                        value={newBookTitle}
                        onChange={(e) => setNewBookTitle(e.target.value)}
                        placeholder="Enter book title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Author *</Label>
                      <Input
                        value={newBookAuthor}
                        onChange={(e) => setNewBookAuthor(e.target.value)}
                        placeholder="Enter author name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Number of Pages (Optional)</Label>
                      <Input
                        type="number"
                        value={newBookPages || ''}
                        onChange={(e) => setNewBookPages(parseInt(e.target.value) || 0)}
                        placeholder="Enter number of pages"
                        min="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Cover Image (Optional)</Label>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => bookCoverInputRef.current?.click()}
                          disabled={uploadingBookCover}
                          className="flex-1"
                        >
                          {uploadingBookCover ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Upload className="h-4 w-4 mr-2" />
                          )}
                          Upload Cover
                        </Button>
                        {bookCoverUrl && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setBookCoverUrl('')}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      {bookCoverUrl && (
                        <img src={bookCoverUrl} alt="Cover preview" className="w-20 h-28 object-cover rounded mt-2" />
                      )}
                      <input
                        ref={bookCoverInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleBookCoverUpload}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setAddBookDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddBook} disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Add Book
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {profileUser.wantToRead && profileUser.wantToRead.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {profileUser.wantToRead.map((book: any) => (
                  <motion.div
                    key={book.bookId}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative group"
                  >
                    <ImageWithFallback
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full aspect-[2/3] object-cover rounded-md shadow-md group-hover:shadow-xl transition-shadow"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveBook(book.bookId, 'wishlist')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    <p className="text-sm mt-2 text-foreground line-clamp-2">{book.title}</p>
                    <p className="text-xs text-muted-foreground">{book.author}</p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No books in wishlist</p>
              </Card>
            )}
          </TabsContent>

          {/* Badges Tab */}
          <TabsContent value="badges">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {profileUser.badges && profileUser.badges.length > 0 ? (
                profileUser.badges.map((badge: any, index: number) => (
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
                  <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No badges earned yet</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Keep reading to earn badges!
                  </p>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
