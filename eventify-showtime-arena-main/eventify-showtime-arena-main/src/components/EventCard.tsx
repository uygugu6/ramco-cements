
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Tag } from "lucide-react";
import { Link } from "react-router-dom";

interface Event {
  id: number;
  title: string;
  category: string;
  venue: string;
  date: string;
  time: string;
  price: string;
  image: string;
  city: string;
}

interface EventCardProps {
  event: Event;
}

export const EventCard = ({ event }: EventCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <Card className="group bg-white/10 backdrop-blur-md border-white/20 overflow-hidden hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      <div className="relative overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4">
          <Badge className="bg-purple-500/90 text-white">
            {event.category}
          </Badge>
        </div>
        <div className="absolute bottom-4 left-4">
          <Badge className="bg-green-500/90 text-white flex items-center">
            <Tag className="mr-1 h-3 w-3" />
            {event.price}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-6 text-white">
        <h3 className="text-xl font-bold mb-3 group-hover:text-purple-400 transition-colors">
          {event.title}
        </h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-white/70">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="text-sm">{formatDate(event.date)}</span>
          </div>
          
          <div className="flex items-center text-white/70">
            <Clock className="h-4 w-4 mr-2" />
            <span className="text-sm">{event.time}</span>
          </div>
          
          <div className="flex items-center text-white/70">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="text-sm">{event.venue}, {event.city}</span>
          </div>
        </div>
        
        <Link to={`/event/${event.id}`}>
          <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
            Book Now
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};
