import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { BookOpen, Search, Home, Calendar, Users, Sun, Moon, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

export function Navigation({ currentPage, onPageChange, isDarkMode, onThemeToggle }: NavigationProps) {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navItems = [
    { id: 'feed', label: 'Feed', icon: Home },
    { id: 'clubs', label: 'Clubs', icon: Users },
    { id: 'explore', label: 'Explore', icon: Search },
    { id: 'analytics', label: 'Analytics', icon: Calendar }
  ];

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-card/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">BookCafe</h1>
            <Badge variant="secondary" className="hidden sm:inline-flex">
              Beta
            </Badge>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search books, authors, or friends..."
                className="pl-10 bg-input-background border-border"
              />
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-1">
            {navItems.map(({ id, label, icon: Icon }) => (
              <Button
                key={id}
                variant={currentPage === id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onPageChange(id)}
                className="hidden sm:inline-flex items-center space-x-1"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden lg:inline">{label}</span>
              </Button>
            ))}

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onThemeToggle}
              className="ml-2"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {/* Profile Avatar - Clickable */}
            {user && (
              <Button
                variant="ghost"
                className="h-8 w-8 rounded-full p-0 ml-2"
                onClick={() => onPageChange('profile')}
              >
                <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </Button>
            )}

            {/* Logout Button */}
            {user && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleLogout}
                className="ml-2 hidden sm:inline-flex"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="sm:hidden flex justify-around py-2 border-t border-border">
          {navItems.map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant={currentPage === id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onPageChange(id)}
              className="flex flex-col items-center space-y-1 min-w-0"
            >
              <Icon className="h-4 w-4" />
              <span className="text-xs">{label}</span>
            </Button>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange('profile')}
            className="flex flex-col items-center space-y-1 min-w-0"
          >
            <Avatar className="h-4 w-4">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="text-[8px]">{user?.displayName?.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="text-xs">Profile</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="flex flex-col items-center space-y-1 min-w-0 text-destructive"
          >
            <LogOut className="h-4 w-4" />
            <span className="text-xs">Logout</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}
