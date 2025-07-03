
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Booking, BookingSeat } from "@/types/database";

interface CreateBookingData {
  movieId: string;
  theaterId: string;
  showtimeId: string;
  selectedSeats: string[];
  totalPrice: number;
  userId?: string;
}

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingData: CreateBookingData): Promise<Booking> => {
      const bookingId = `BMS${Date.now()}`;
      
      // First create the booking
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          booking_id: bookingId,
          user_id: bookingData.userId || null,
          movie_id: bookingData.movieId,
          theater_id: bookingData.theaterId,
          showtime_id: bookingData.showtimeId,
          selected_seats: bookingData.selectedSeats,
          total_price: bookingData.totalPrice,
          booking_status: 'confirmed',
          payment_status: 'completed'
        })
        .select()
        .single();

      if (bookingError) {
        console.error('Error creating booking:', bookingError);
        throw bookingError;
      }

      // Then create booking seats records
      const seatRecords = bookingData.selectedSeats.map(seatNumber => ({
        booking_id: booking.id,
        showtime_id: bookingData.showtimeId,
        seat_number: seatNumber,
        seat_type: 'regular', // Default seat type
        seat_price: bookingData.totalPrice / bookingData.selectedSeats.length
      }));

      const { error: seatsError } = await supabase
        .from('booking_seats')
        .insert(seatRecords);

      if (seatsError) {
        console.error('Error creating booking seats:', seatsError);
        // Note: In production, you'd want to rollback the booking here
        throw seatsError;
      }

      return booking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['showtimes'] });
    }
  });
};

export const useUserBookings = (userId?: string) => {
  return useQuery({
    queryKey: ['bookings', userId],
    queryFn: async (): Promise<Booking[]> => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          movie:movies(*),
          theater:theaters(*),
          showtime:showtimes(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user bookings:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!userId
  });
};

export const useOccupiedSeats = (showtimeId: string) => {
  return useQuery({
    queryKey: ['occupied-seats', showtimeId],
    queryFn: async (): Promise<string[]> => {
      const { data, error } = await supabase
        .from('booking_seats')
        .select('seat_number')
        .eq('showtime_id', showtimeId);

      if (error) {
        console.error('Error fetching occupied seats:', error);
        throw error;
      }

      return data?.map(seat => seat.seat_number) || [];
    },
    enabled: !!showtimeId
  });
};
