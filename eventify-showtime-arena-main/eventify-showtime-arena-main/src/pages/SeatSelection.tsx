
import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, Eye, Loader2 } from "lucide-react";
import { Header } from "@/components/Header";
import { toast } from "@/hooks/use-toast";
import { useOccupiedSeats } from "@/hooks/useBookings";

const SeatSelection = () => {
  const { movieId, theater, showtime } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const showtimeData = location.state?.showtime;
  
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  
  const { data: occupiedSeats = [], isLoading: seatsLoading } = useOccupiedSeats(
    showtimeData?.id || ''
  );

  // Mock seat data - in a real app, this would come from the database
  const seatLayout = {
    regular: {
      price: showtimeData?.price || 250,
      rows: ['A', 'B', 'C', 'D', 'E'],
      seatsPerRow: 12
    },
    premium: {
      price: (showtimeData?.price || 250) + 100,
      rows: ['F', 'G', 'H'],
      seatsPerRow: 10
    },
    recliner: {
      price: (showtimeData?.price || 250) + 200,
      rows: ['I', 'J'],
      seatsPerRow: 8
    }
  };

  const getSeatPrice = (seatId: string) => {
    const row = seatId[0];
    if (seatLayout.regular.rows.includes(row)) return seatLayout.regular.price;
    if (seatLayout.premium.rows.includes(row)) return seatLayout.premium.price;
    if (seatLayout.recliner.rows.includes(row)) return seatLayout.recliner.price;
    return 0;
  };

  const getSeatType = (seatId: string) => {
    const row = seatId[0];
    if (seatLayout.regular.rows.includes(row)) return 'Regular';
    if (seatLayout.premium.rows.includes(row)) return 'Premium';
    if (seatLayout.recliner.rows.includes(row)) return 'Recliner';
    return '';
  };

  const toggleSeat = (seatId: string) => {
    if (occupiedSeats.includes(seatId)) return;
    
    setSelectedSeats(prev => 
      prev.includes(seatId) 
        ? prev.filter(id => id !== seatId)
        : [...prev, seatId]
    );
  };

  const getTotalPrice = () => {
    return selectedSeats.reduce((total, seatId) => total + getSeatPrice(seatId), 0);
  };

  const getSeatClass = (seatId: string) => {
    if (occupiedSeats.includes(seatId)) {
      return 'bg-red-500 cursor-not-allowed';
    }
    if (selectedSeats.includes(seatId)) {
      return 'bg-green-500 hover:bg-green-600';
    }
    return 'bg-gray-600 hover:bg-blue-500 cursor-pointer';
  };

  const renderSeatSection = (section: string, sectionData: any) => (
    <div key={section} className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white capitalize">
          {section} - ₹{sectionData.price}
        </h3>
        <Badge variant="outline" className="border-white/30 text-white">
          {sectionData.rows.length} rows
        </Badge>
      </div>
      
      <div className="space-y-3">
        {sectionData.rows.map((row: string) => (
          <div key={row} className="flex items-center justify-center gap-2">
            <span className="text-white font-semibold w-8 text-center">{row}</span>
            
            <div className="flex gap-1">
              {Array.from({ length: sectionData.seatsPerRow }, (_, i) => {
                const seatNumber = i + 1;
                const seatId = `${row}${seatNumber}`;
                
                return (
                  <button
                    key={seatId}
                    onClick={() => toggleSeat(seatId)}
                    className={`w-8 h-8 rounded text-xs font-semibold text-white transition-colors ${getSeatClass(seatId)}`}
                    disabled={occupiedSeats.includes(seatId)}
                    title={`${seatId} - ${getSeatType(seatId)} - ₹${getSeatPrice(seatId)}`}
                  >
                    {seatNumber}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const handleProceedToPayment = () => {
    console.log('Proceed to Payment clicked');
    console.log('Selected seats:', selectedSeats);
    console.log('Showtime data:', showtimeData);
    console.log('Movie ID:', movieId);
    console.log('Theater:', theater);
    console.log('Showtime:', showtime);
    
    if (selectedSeats.length === 0) {
      toast({
        title: "No seats selected",
        description: "Please select at least one seat to continue.",
        variant: "destructive"
      });
      return;
    }

    if (!showtimeData) {
      console.error('Showtime data is missing');
      toast({
        title: "Error",
        description: "Showtime data is missing. Please go back and try again.",
        variant: "destructive"
      });
      return;
    }

    const bookingDetails = {
      movieId,
      theater,
      showtime,
      showtimeData,
      selectedSeats,
      totalPrice: getTotalPrice()
    };

    console.log('Navigating to payment with booking details:', bookingDetails);

    // Navigate to payment page with booking details
    navigate('/payment', {
      state: bookingDetails
    });
  };

  if (seatsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="flex items-center gap-2 text-white">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading seat availability...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      
      {/* Navigation */}
      <div className="container mx-auto px-4 py-4">
        <Button
          variant="ghost"
          className="text-white hover:bg-white/10"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      {/* Booking Info */}
      <section className="py-4 px-4 bg-black/20">
        <div className="container mx-auto">
          <div className="text-center text-white mb-6">
            <h1 className="text-2xl font-bold mb-2">Select Seats</h1>
            <p className="text-white/80">
              {decodeURIComponent(theater || '')} • {showtime}
            </p>
            {showtimeData?.available_seats !== undefined && (
              <p className="text-white/60 text-sm mt-1">
                {showtimeData.available_seats} seats available
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Seat Map */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Screen */}
          <div className="mb-12">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full mb-4 relative">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-yellow-500 text-black flex items-center">
                  <Eye className="mr-1 h-3 w-3" />
                  SCREEN
                </Badge>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-6 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-600 rounded"></div>
              <span className="text-white text-sm">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-white text-sm">Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-white text-sm">Occupied</span>
            </div>
          </div>

          {/* Seat Sections */}
          <div className="mb-8">
            {Object.entries(seatLayout).map(([section, data]) => 
              renderSeatSection(section, data)
            )}
          </div>
        </div>
      </section>

      {/* Booking Summary */}
      {selectedSeats.length > 0 && (
        <section className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-white/20 p-4">
          <div className="container mx-auto">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="text-white">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="h-4 w-4" />
                      <span className="font-semibold">
                        {selectedSeats.length} seat{selectedSeats.length > 1 ? 's' : ''} selected
                      </span>
                    </div>
                    <p className="text-sm text-white/70">
                      Seats: {selectedSeats.join(', ')}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-400">
                      ₹{getTotalPrice()}
                    </p>
                    <Button
                      onClick={handleProceedToPayment}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 mt-2"
                    >
                      Proceed to Payment
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}
    </div>
  );
};

export default SeatSelection;
