
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Download, Share2, Calendar, MapPin, Users, Ticket } from "lucide-react";
import { Header } from "@/components/Header";

const BookingConfirmation = () => {
  const location = useLocation();
  const bookingDetails = location.state;

  console.log('BookingConfirmation - received data:', bookingDetails);

  if (!bookingDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Booking not found</h1>
          <Link to="/">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Go to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { 
    bookingId, 
    movieTitle, 
    theater, 
    showtime, 
    selectedSeats, 
    totalPrice, 
    finalAmount 
  } = bookingDetails;
  
  const convenienceFee = Math.round(totalPrice * 0.02);
  const gst = Math.round((totalPrice + convenienceFee) * 0.18);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-4">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Booking Confirmed!</h1>
            <p className="text-white/80">Your tickets have been successfully booked</p>
          </div>

          {/* Booking Details Card */}
          <Card className="bg-white/95 backdrop-blur-md border-gray-200 shadow-xl mb-6">
            <CardHeader className="text-center border-b border-gray-200">
              <CardTitle className="text-gray-800 flex items-center justify-center">
                <Ticket className="mr-2 h-5 w-5" />
                Booking Details
              </CardTitle>
              <Badge className="bg-green-100 text-green-800 border-2 border-green-300 w-fit mx-auto font-bold">
                Booking ID: {bookingId}
              </Badge>
            </CardHeader>
            <CardContent className="p-6 text-gray-800">
              <div className="space-y-6">
                {/* Movie Info */}
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{movieTitle}</h3>
                  <div className="space-y-2 text-gray-700">
                    <div className="flex items-center bg-blue-50 p-3 rounded-lg">
                      <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                      <span className="font-medium text-gray-800">{decodeURIComponent(theater || '')}</span>
                    </div>
                    <div className="flex items-center bg-blue-50 p-3 rounded-lg">
                      <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                      <span className="font-medium text-gray-800">Today • {showtime}</span>
                    </div>
                  </div>
                </div>

                {/* Seats */}
                <div>
                  <h4 className="font-semibold mb-2 flex items-center text-gray-900">
                    <Users className="h-4 w-4 mr-2" />
                    Seats ({selectedSeats.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSeats.map((seat: string) => (
                      <Badge key={seat} className="bg-blue-100 text-blue-800 border-2 border-blue-300 px-3 py-1 font-bold">
                        {seat}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="border-t-2 border-gray-200 pt-4">
                  <h4 className="font-semibold mb-3 text-gray-900">Payment Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-700">
                      <span>Ticket Price ({selectedSeats.length} seats)</span>
                      <span className="font-medium">₹{totalPrice}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Convenience Fee</span>
                      <span className="font-medium">₹{convenienceFee}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>GST (18%)</span>
                      <span className="font-medium">₹{gst}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t-2 border-gray-200 pt-2 text-gray-900">
                      <span>Total Paid</span>
                      <span className="text-green-700">₹{finalAmount}</span>
                    </div>
                  </div>
                </div>

                {/* QR Code Placeholder */}
                <div className="text-center py-6 border-t-2 border-gray-200">
                  <div className="w-32 h-32 bg-gray-100 border-2 border-gray-300 mx-auto mb-4 rounded-lg flex items-center justify-center">
                    <div className="text-gray-800 text-xs text-center font-medium">
                      QR CODE<br />
                      {bookingId}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 font-medium">
                    Show this QR code at the venue for entry
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white border-0 font-bold h-12">
              <Download className="mr-2 h-4 w-4" />
              Download Ticket
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white border-0 font-bold h-12">
              <Share2 className="mr-2 h-4 w-4" />
              Share Booking
            </Button>
          </div>

          {/* Important Notes */}
          <Card className="bg-yellow-50 border-2 border-yellow-300 mb-8">
            <CardContent className="p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">Important Instructions</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Please arrive at the venue 30 minutes before showtime</li>
                <li>• Carry a valid ID proof for verification</li>
                <li>• Outside food and beverages are not allowed</li>
                <li>• Tickets once booked cannot be cancelled or refunded</li>
              </ul>
            </CardContent>
          </Card>

          {/* Back to Home */}
          <div className="text-center mt-8">
            <Link to="/">
              <Button className="bg-gray-700 hover:bg-gray-800 text-white border-0 font-bold h-12 px-8">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
