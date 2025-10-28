import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { BookOpen, Target, TrendingUp, Calendar, Clock, Star, Award, Flame, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';

export function AnalyticsPage() {
  const { user } = useAuth();
  const readingProgressData = [
    { month: 'Jan', books: 3, pages: 892 },
    { month: 'Feb', books: 4, pages: 1123 },
    { month: 'Mar', books: 2, pages: 654 },
    { month: 'Apr', books: 5, pages: 1456 },
    { month: 'May', books: 3, pages: 987 },
    { month: 'Jun', books: 6, pages: 1834 },
    { month: 'Jul', books: 4, pages: 1245 },
    { month: 'Aug', books: 5, pages: 1567 },
    { month: 'Sep', books: 7, pages: 2134 },
    { month: 'Oct', books: 3, pages: 894 },
    { month: 'Nov', books: 6, pages: 1789 },
    { month: 'Dec', books: 9, pages: 2992 }
  ];

  const genreData = [
    { name: 'Fantasy', value: 35, color: '#8b5cf6' },
    { name: 'Mystery/Thriller', value: 25, color: '#3b82f6' },
    { name: 'Romance', value: 15, color: '#ec4899' },
    { name: 'Sci-Fi', value: 12, color: '#10b981' },
    { name: 'Non-Fiction', value: 8, color: '#f59e0b' },
    { name: 'Literary Fiction', value: 5, color: '#6b7280' }
  ];

  const dailyReadingData = [
    { day: 'Mon', minutes: 45 },
    { day: 'Tue', minutes: 32 },
    { day: 'Wed', minutes: 67 },
    { day: 'Thu', minutes: 23 },
    { day: 'Fri', minutes: 54 },
    { day: 'Sat', minutes: 89 },
    { day: 'Sun', minutes: 76 }
  ];

  // Use real user data from MongoDB
  const yearlyGoals = {
    booksGoal: user?.readingGoal || 50,
    booksRead: user?.booksRead || 0,
    pagesGoal: (user?.readingGoal || 50) * 300, // Estimate 300 pages per book
    pagesRead: (user?.booksRead || 0) * 300, // Estimate
    minutesGoal: 21900, // 60 minutes * 365 days
    minutesRead: (user?.booksRead || 0) * 360 // Estimate 6 hours per book
  };

  const readingStreaks = [
    { period: 'Current Streak', days: user?.readingStreak?.current || 0, icon: '🔥' },
    { period: 'Longest Streak', days: user?.readingStreak?.longest || 0, icon: '⚡' },
    { period: 'This Month', days: Math.min(user?.readingStreak?.current || 0, 30), icon: '📅' },
    { period: 'This Year', days: (user?.readingStreak?.current || 0) * 12, icon: '🎯' } // Rough estimate
  ];

  const monthlyMilestones = [
    { milestone: 'Completed 5+ books', achieved: true, month: 'Sep' },
    { milestone: 'Read 2000+ pages', achieved: true, month: 'Sep' },
    { milestone: 'Maintained daily streak', achieved: false, month: 'Sep' },
    { milestone: 'Tried new genre', achieved: true, month: 'Sep' }
  ];

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h1 className="text-3xl font-bold text-foreground">Reading Analytics</h1>
          <p className="text-muted-foreground">Track your reading journey and celebrate your progress</p>
        </motion.div>

        {/* Yearly Goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-primary" />
                <span>2024 Reading Goals</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Books Read</span>
                    <span className="text-sm text-muted-foreground">
                      {yearlyGoals.booksRead} / {yearlyGoals.booksGoal}
                    </span>
                  </div>
                  <Progress 
                    value={(yearlyGoals.booksRead / yearlyGoals.booksGoal) * 100} 
                    className="h-3"
                  />
                  <p className="text-xs text-muted-foreground">
                    {yearlyGoals.booksGoal - yearlyGoals.booksRead} books to go
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Pages Read</span>
                    <span className="text-sm text-muted-foreground">
                      {yearlyGoals.pagesRead.toLocaleString()} / {yearlyGoals.pagesGoal.toLocaleString()}
                    </span>
                  </div>
                  <Progress 
                    value={(yearlyGoals.pagesRead / yearlyGoals.pagesGoal) * 100} 
                    className="h-3"
                  />
                  <p className="text-xs text-muted-foreground">
                    {(yearlyGoals.pagesGoal - yearlyGoals.pagesRead).toLocaleString()} pages to go
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Reading Minutes</span>
                    <span className="text-sm text-muted-foreground">
                      {yearlyGoals.minutesRead.toLocaleString()} / {yearlyGoals.minutesGoal.toLocaleString()}
                    </span>
                  </div>
                  <Progress 
                    value={(yearlyGoals.minutesRead / yearlyGoals.minutesGoal) * 100} 
                    className="h-3"
                  />
                  <p className="text-xs text-muted-foreground">
                    {Math.round((yearlyGoals.minutesGoal - yearlyGoals.minutesRead) / 60)} hours to go
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Reading Streaks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {readingStreaks.map((streak, index) => (
            <Card key={streak.period} className="text-center border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                  className="space-y-2"
                >
                  <div className="text-2xl">{streak.icon}</div>
                  <div className="text-2xl font-bold text-primary">{streak.days}</div>
                  <p className="text-sm text-muted-foreground">{streak.period}</p>
                </motion.div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Reading Progress Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span>Reading Progress This Year</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={readingProgressData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" className="text-muted-foreground" />
                    <YAxis className="text-muted-foreground" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="books" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Genre Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span>Genre Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-4">
                  <ResponsiveContainer width="100%" height={200} className="lg:w-1/2">
                    <PieChart>
                      <Pie
                        data={genreData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {genreData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex-1 space-y-2">
                    {genreData.map((genre, index) => (
                      <motion.div
                        key={genre.name}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.05 }}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: genre.color }}
                          />
                          <span className="text-sm">{genre.name}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{genre.value}%</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Reading Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span>Daily Reading Time (This Week)</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={dailyReadingData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="day" className="text-muted-foreground" />
                    <YAxis className="text-muted-foreground" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar 
                      dataKey="minutes" 
                      fill="hsl(var(--primary))" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Average: {Math.round(dailyReadingData.reduce((acc, day) => acc + day.minutes, 0) / dailyReadingData.length)} minutes per day
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Monthly Milestones */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-primary" />
                  <span>September Milestones</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {monthlyMilestones.map((milestone, index) => (
                  <motion.div
                    key={milestone.milestone}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/20"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        milestone.achieved 
                          ? 'bg-green-500 text-white' 
                          : 'bg-muted border-2 border-muted-foreground'
                      }`}>
                        {milestone.achieved && <span className="text-xs">✓</span>}
                      </div>
                      <span className="text-sm font-medium">{milestone.milestone}</span>
                    </div>
                    <Badge 
                      variant={milestone.achieved ? "default" : "secondary"}
                      className={milestone.achieved ? "bg-green-500 text-white" : ""}
                    >
                      {milestone.achieved ? "Completed" : "In Progress"}
                    </Badge>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Year in Review */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="border-border/50 bg-gradient-to-r from-primary/10 to-accent/10 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="space-y-4">
                <div className="text-6xl">🎉</div>
                <h2 className="text-2xl font-bold text-foreground">
                  {user?.booksRead && user.booksRead > 0 ? 'Amazing Reading Year!' : 'Start Your Reading Journey!'}
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  {user?.booksRead && user.booksRead > 0 ? (
                    <>
                      You've read <span className="font-bold text-primary">{user.booksRead} books</span> and 
                      <span className="font-bold text-primary"> {(user.booksRead * 300).toLocaleString()} pages</span> this year! 
                      That's equivalent to reading for <span className="font-bold text-primary">{Math.round((user.booksRead * 6))} hours</span> - 
                      almost {Math.round((user.booksRead * 6) / 24)} full days of pure reading bliss! 📚✨
                    </>
                  ) : (
                    'Start adding books to your reading list to see your amazing statistics!'
                  )}
                </p>
                <div className="flex justify-center space-x-8 mt-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{user?.readingStreak?.longest || 0}</p>
                    <p className="text-sm text-muted-foreground">Longest Streak</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{user?.avgRating?.toFixed(1) || '0.0'}</p>
                    <p className="text-sm text-muted-foreground">Avg Rating</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{user?.readBooks?.length || 0}</p>
                    <p className="text-sm text-muted-foreground">Books Finished</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}