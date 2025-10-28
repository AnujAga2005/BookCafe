import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog';
import { Search, Users, BookOpen, MessageCircle, Calendar, Plus, Crown, Flame, Loader2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion } from 'motion/react';
import { api } from '../services/api';
import { toast } from 'sonner@2.0.3';
import { useAuth } from '../contexts/AuthContext';

// Club categories matching the backend enum
const CLUB_CATEGORIES = [
  { value: 'general', label: 'General' },
  { value: 'fiction', label: 'Fiction' },
  { value: 'non-fiction', label: 'Non-Fiction' },
  { value: 'mystery', label: 'Mystery' },
  { value: 'romance', label: 'Romance' },
  { value: 'sci-fi', label: 'Sci-Fi' },
  { value: 'fantasy', label: 'Fantasy' },
  { value: 'biography', label: 'Biography' },
];

export function BookClubsPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [clubs, setClubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  // Create club form state
  const [newClubName, setNewClubName] = useState('');
  const [newClubDescription, setNewClubDescription] = useState('');
  const [newClubCategory, setNewClubCategory] = useState('general');

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      setLoading(true);
      const result = await api.clubs.getAll();
      setClubs(result.clubs || []);
    } catch (error: any) {
      console.error('Failed to fetch clubs:', error);
      toast.error('Failed to load clubs');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClub = async () => {
    if (!newClubName.trim() || !newClubDescription.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setCreating(true);
    try {
      await api.clubs.create({
        name: newClubName,
        description: newClubDescription,
        category: newClubCategory,
      });

      toast.success('Club created successfully!');
      setNewClubName('');
      setNewClubDescription('');
      setNewClubCategory('general');
      setCreateDialogOpen(false);

      // Refresh clubs
      await fetchClubs();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create club');
    } finally {
      setCreating(false);
    }
  };

  const handleJoinClub = async (clubId: string) => {
    try {
      await api.clubs.join(clubId);
      toast.success('Joined club successfully!');
      await fetchClubs();
    } catch (error: any) {
      toast.error(error.message || 'Failed to join club');
    }
  };

  const handleLeaveClub = async (clubId: string) => {
    try {
      await api.clubs.leave(clubId);
      toast.success('Left club successfully');
      await fetchClubs();
    } catch (error: any) {
      toast.error(error.message || 'Failed to leave club');
    }
  };

  const isUserMember = (club: any) => {
    if (!user || !club.members) return false;
    return club.members.some((m: any) => {
      // Handle both populated and unpopulated members
      const memberId = m.userId?._id || m.userId || m._id || m;
      return memberId.toString() === user.id.toString();
    });
  };

  const filteredClubs = clubs.filter(club =>
    club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    club.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const myClubs = filteredClubs.filter(club => isUserMember(club));
  const discoverClubs = filteredClubs.filter(club => !isUserMember(club));

  const ClubCard = ({ club, isJoined }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <CardTitle className="text-lg">{club.name}</CardTitle>
                {club.creator === user?.id && <Crown className="h-4 w-4 text-yellow-500" />}
              </div>
              <p className="text-sm text-muted-foreground mb-3">{club.description}</p>
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <span className="flex items-center space-x-1">
                  <Users className="h-3 w-3" />
                  <span>{club.members?.length || 0} members</span>
                </span>
                {club.category && (
                  <Badge variant="outline" className="text-xs capitalize">
                    {club.category}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {club.currentBook && (
            <div className="flex items-center space-x-3 mb-4">
              <motion.div
                whileHover={{ scale: 1.05, rotate: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <ImageWithFallback
                  src={club.currentBook.coverImage}
                  alt={club.currentBook.title}
                  className="w-12 h-16 object-cover rounded shadow-sm"
                />
              </motion.div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">Currently Reading:</p>
                <p className="text-sm font-semibold truncate">{club.currentBook.title}</p>
                <p className="text-xs text-muted-foreground truncate">by {club.currentBook.author}</p>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                {new Date(club.createdAt).toLocaleDateString()}
              </Badge>
            </div>
            <div className="flex space-x-2">
              {isJoined ? (
                <Button variant="secondary" size="sm" onClick={() => handleLeaveClub(club._id)}>
                  Joined
                </Button>
              ) : (
                <Button size="sm" onClick={() => handleJoinClub(club._id)}>
                  Join
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground">Book Clubs</h1>
            <p className="text-muted-foreground">Connect with fellow readers and discover your next favorite book</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search clubs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Club
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create a New Book Club</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="clubName">Club Name *</Label>
                    <Input
                      id="clubName"
                      value={newClubName}
                      onChange={(e) => setNewClubName(e.target.value)}
                      placeholder="e.g., Mystery Lovers"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clubDescription">Description *</Label>
                    <Textarea
                      id="clubDescription"
                      value={newClubDescription}
                      onChange={(e) => setNewClubDescription(e.target.value)}
                      placeholder="Tell us about your club..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clubCategory">Category</Label>
                    <Select value={newClubCategory} onValueChange={setNewClubCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CLUB_CATEGORIES.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateClub} disabled={creating}>
                    {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Club
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs defaultValue="discover" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="my-clubs">
                My Clubs ({myClubs.length})
              </TabsTrigger>
              <TabsTrigger value="discover">
                Discover ({discoverClubs.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="my-clubs" className="mt-6">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : myClubs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myClubs.map((club) => (
                    <ClubCard key={club._id} club={club} isJoined={true} />
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">No clubs joined yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Discover and join book clubs to connect with fellow readers
                  </p>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="discover" className="mt-6">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : discoverClubs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {discoverClubs.map((club) => (
                    <ClubCard key={club._id} club={club} isJoined={false} />
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">No clubs found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery ? 'Try a different search term' : 'Be the first to create a club!'}
                  </p>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
