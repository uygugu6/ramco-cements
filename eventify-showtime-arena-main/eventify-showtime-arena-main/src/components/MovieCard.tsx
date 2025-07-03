
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Movie } from "@/types/database";

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard = ({ movie }: MovieCardProps) => {
  return (
    <Card className="group bg-white/10 backdrop-blur-md border-white/20 overflow-hidden hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      <div className="relative overflow-hidden">
        <img
          src={movie.image || 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop'}
          alt={movie.title}
          className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4">
          <Badge className="bg-green-500/90 text-white flex items-center">
            <Star className="mr-1 h-3 w-3 fill-current" />
            {movie.rating}
          </Badge>
        </div>
        <div className="absolute bottom-4 left-4">
          <Badge variant="secondary" className="bg-black/70 text-white">
            {movie.language}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-6 text-white">
        <h3 className="text-xl font-bold mb-2 group-hover:text-red-400 transition-colors">
          {movie.title}
        </h3>
        
        <div className="flex items-center text-white/70 mb-3">
          <span className="text-sm">{movie.genre}</span>
          <span className="mx-2">•</span>
          <Clock className="h-4 w-4 mr-1" />
          <span className="text-sm">{movie.duration}</span>
        </div>
        
        {movie.description && (
          <p className="text-sm text-white/70 mb-4 line-clamp-2">
            {movie.description}
          </p>
        )}
        
        <Link to={`/movie/${movie.id}`}>
          <Button className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600">
            Book Tickets
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};
