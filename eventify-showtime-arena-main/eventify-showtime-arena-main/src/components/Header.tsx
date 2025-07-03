
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Menu, X, LogIn, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleLogin = () => {
    console.log('Login button clicked');
    // TODO: Implement login functionality
    alert('Login functionality will be implemented soon');
  };

  const handleSignup = () => {
    console.log('Signup button clicked');
    // TODO: Implement signup functionality
    alert('Signup functionality will be implemented soon');
  };

  return (
    <header className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-lg p-2">
              <span className="text-white font-bold text-xl">BM</span>
            </div>
            <span className="text-white font-bold text-xl hidden sm:block">BookMyShow</span>
          </Link>

          {/* Desktop Navigation - Simplified to only show working links */}
          {!isMobile && (
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-white hover:text-red-400 transition-colors">
                Home
              </Link>
              <span className="text-white/50 text-sm">More features coming soon...</span>
            </nav>
          )}

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Location Badge */}
            <Badge variant="outline" className="text-white border-white/30 hidden sm:block">
              Mumbai
            </Badge>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-2">
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/10" 
                size="sm"
                onClick={handleLogin}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Button>
              <Button 
                className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600" 
                size="sm"
                onClick={handleSignup}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Sign Up
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && isMobile && (
          <div className="md:hidden mt-4 py-4 border-t border-white/10">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-white hover:text-red-400 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              
              <div className="flex flex-col space-y-2 pt-4 border-t border-white/10">
                <Button 
                  variant="ghost" 
                  className="text-white hover:bg-white/10 justify-start"
                  onClick={() => {
                    handleLogin();
                    setIsMenuOpen(false);
                  }}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Button>
                <Button 
                  className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 justify-start"
                  onClick={() => {
                    handleSignup();
                    setIsMenuOpen(false);
                  }}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign Up
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
