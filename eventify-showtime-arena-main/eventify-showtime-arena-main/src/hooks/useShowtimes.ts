
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Showtime } from "@/types/database";

export const useShowtimes = (movieId?: string) => {
  return useQuery({
    queryKey: ['showtimes', movieId],
    queryFn: async (): Promise<Showtime[]> => {
      let query = supabase
        .from('showtimes')
        .select(`
          *,
          movie:movies(*),
          theater:theaters(*)
        `)
        .order('show_date', { ascending: true })
        .order('show_time', { ascending: true });

      if (movieId) {
        query = query.eq('movie_id', movieId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching showtimes:', error);
        throw error;
      }

      return data || [];
    }
  });
};

export const useUpdateAvailableSeats = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ showtimeId, seatsToBook }: { showtimeId: string; seatsToBook: number }) => {
      // First get the current available seats count
      const { data: currentShowtime, error: fetchError } = await supabase
        .from('showtimes')
        .select('available_seats')
        .eq('id', showtimeId)
        .single();

      if (fetchError) {
        console.error('Error fetching current showtime:', fetchError);
        throw fetchError;
      }

      const newAvailableSeats = currentShowtime.available_seats - seatsToBook;

      // Update with the calculated value
      const { data, error } = await supabase
        .from('showtimes')
        .update({ 
          available_seats: newAvailableSeats
        })
        .eq('id', showtimeId)
        .select();

      if (error) {
        console.error('Error updating available seats:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['showtimes'] });
    }
  });
};
