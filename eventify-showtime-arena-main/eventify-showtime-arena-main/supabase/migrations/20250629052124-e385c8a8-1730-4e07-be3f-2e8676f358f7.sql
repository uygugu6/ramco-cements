
-- Create RLS policies for the bookings table to allow public access
-- This allows anyone to insert bookings (for guest bookings)
CREATE POLICY "Allow public booking creation" ON public.bookings
  FOR INSERT 
  WITH CHECK (true);

-- Allow users to view their own bookings if they have a user_id, or allow public viewing
CREATE POLICY "Allow booking viewing" ON public.bookings
  FOR SELECT 
  USING (true);

-- Create RLS policies for booking_seats table to allow public access
CREATE POLICY "Allow public booking seats creation" ON public.booking_seats
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow booking seats viewing" ON public.booking_seats
  FOR SELECT 
  USING (true);

-- Ensure RLS is enabled on both tables
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_seats ENABLE ROW LEVEL SECURITY;
