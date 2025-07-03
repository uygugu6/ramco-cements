
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { toast } from "@/hooks/use-toast";
import { useCreateBooking } from "@/hooks/useBookings";
import { useUpdateAvailableSeats } from "@/hooks/useShowtimes";
import { PaymentSummary } from "@/components/PaymentSummary";
import { PaymentForm } from "@/components/PaymentForm";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingDetails = location.state;

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);

  const createBookingMutation = useCreateBooking();
  const updateSeatsMutation = useUpdateAvailableSeats();

  // Handle navigation in useEffect to avoid calling navigate during render
  useEffect(() => {
    console.log('Payment page - booking details:', bookingDetails);
    if (!bookingDetails) {
      console.log('No booking details found, redirecting to home');
      navigate('/');
    }
  }, [bookingDetails, navigate]);

  // Don't render anything while navigating
  if (!bookingDetails) {
    return null;
  }

  const { movieId, theater, showtime, showtimeData, selectedSeats, totalPrice } = bookingDetails;

  const convenienceFee = Math.round(totalPrice * 0.02); // 2% convenience fee
  const gst = Math.round((totalPrice + convenienceFee) * 0.18); // 18% GST
  const finalAmount = totalPrice + convenienceFee + gst;

  const handlePayment = async () => {
    console.log('Payment process started');
    console.log('Booking details:', bookingDetails);
    
    setIsProcessing(true);
    
    try {
      console.log('Creating booking with data:', {
        movieId,
        theaterId: showtimeData.theater_id,
        showtimeId: showtimeData.id,
        selectedSeats,
        totalPrice: finalAmount,
        userId: null
      });

      // Create the booking
      const booking = await createBookingMutation.mutateAsync({
        movieId,
        theaterId: showtimeData.theater_id,
        showtimeId: showtimeData.id,
        selectedSeats,
        totalPrice: finalAmount,
        userId: null // For now, we're not using authentication
      });

      console.log('Booking created successfully:', booking);

      // Update available seats
      console.log('Updating available seats:', {
        showtimeId: showtimeData.id,
        seatsToBook: selectedSeats.length
      });

      await updateSeatsMutation.mutateAsync({
        showtimeId: showtimeData.id,
        seatsToBook: selectedSeats.length
      });

      console.log('Seats updated successfully');

      toast({
        title: "Payment Successful!",
        description: "Your tickets have been booked successfully.",
      });

      const confirmationData = {
        bookingId: booking.booking_id,
        movieTitle: showtimeData?.movie?.title || 'Movie',
        theater,
        showtime,
        showtimeData,
        selectedSeats,
        totalPrice,
        finalAmount,
        paymentStatus: 'success'
      };

      console.log('Navigating to booking confirmation with data:', confirmationData);
      
      // Navigate to booking confirmation
      navigate('/booking-confirmation', {
        state: confirmationData
      });
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

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
          Back to Seat Selection
        </Button>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">
            Complete Your Booking
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <PaymentSummary
              showtimeData={showtimeData}
              theater={theater}
              showtime={showtime}
              selectedSeats={selectedSeats}
              totalPrice={totalPrice}
            />

            <PaymentForm
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              onPayment={handlePayment}
              isProcessing={isProcessing || createBookingMutation.isPending}
              finalAmount={finalAmount}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
