
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, MapPin, Clock } from "lucide-react";

interface PaymentSummaryProps {
  showtimeData: any;
  theater: string;
  showtime: string;
  selectedSeats: string[];
  totalPrice: number;
}

export const PaymentSummary = ({ 
  showtimeData, 
  theater, 
  showtime, 
  selectedSeats, 
  totalPrice 
}: PaymentSummaryProps) => {
  const convenienceFee = Math.round(totalPrice * 0.02); // 2% convenience fee
  const gst = Math.round((totalPrice + convenienceFee) * 0.18); // 18% GST
  const finalAmount = totalPrice + convenienceFee + gst;

  return (
    <Card className="bg-white/95 backdrop-blur-md border-gray-200 shadow-xl">
      <CardHeader>
        <CardTitle className="text-gray-800 flex items-center text-xl">
          <Users className="mr-2 h-5 w-5" />
          Booking Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="text-gray-800 space-y-4">
        <div>
          <h3 className="font-bold text-lg mb-2 text-gray-900">Movie Details</h3>
          <p className="text-gray-700 font-medium">{showtimeData?.movie?.title || 'Movie Title'}</p>
        </div>

        <div className="flex items-center text-gray-600 bg-gray-50 p-3 rounded-lg">
          <MapPin className="h-5 w-5 mr-2 text-blue-600" />
          <span className="font-medium">{decodeURIComponent(theater || '')}</span>
        </div>

        <div className="flex items-center text-gray-600 bg-gray-50 p-3 rounded-lg">
          <Clock className="h-5 w-5 mr-2 text-blue-600" />
          <span className="font-medium">{showtime}</span>
        </div>

        <div>
          <h4 className="font-bold mb-3 text-gray-900">Selected Seats</h4>
          <div className="flex flex-wrap gap-2">
            {selectedSeats.map((seat: string) => (
              <Badge key={seat} className="bg-green-100 text-green-800 border-2 border-green-300 px-3 py-1 text-sm font-bold">
                {seat}
              </Badge>
            ))}
          </div>
        </div>

        <div className="border-t-2 border-gray-200 pt-4">
          <div className="space-y-3">
            <div className="flex justify-between text-gray-700">
              <span className="font-medium">Ticket Price ({selectedSeats.length} seats)</span>
              <span className="font-bold">₹{totalPrice}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Convenience Fee</span>
              <span className="font-medium">₹{convenienceFee}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>GST (18%)</span>
              <span className="font-medium">₹{gst}</span>
            </div>
            <div className="flex justify-between font-bold text-xl border-t-2 border-gray-200 pt-3 text-gray-900">
              <span>Total Amount</span>
              <span className="text-green-700">₹{finalAmount}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
