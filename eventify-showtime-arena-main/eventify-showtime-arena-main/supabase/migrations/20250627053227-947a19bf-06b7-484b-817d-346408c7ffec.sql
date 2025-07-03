
-- Create movies table
CREATE TABLE public.movies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  genre TEXT NOT NULL,
  language TEXT NOT NULL,
  duration TEXT NOT NULL,
  rating DECIMAL(2,1) NOT NULL,
  image TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create theaters table
CREATE TABLE public.theaters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create showtimes table
CREATE TABLE public.showtimes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  movie_id UUID REFERENCES public.movies(id) NOT NULL,
  theater_id UUID REFERENCES public.theaters(id) NOT NULL,
  show_date DATE NOT NULL,
  show_time TIME NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  total_seats INTEGER NOT NULL DEFAULT 100,
  available_seats INTEGER NOT NULL DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id),
  movie_id UUID REFERENCES public.movies(id) NOT NULL,
  theater_id UUID REFERENCES public.theaters(id) NOT NULL,
  showtime_id UUID REFERENCES public.showtimes(id) NOT NULL,
  selected_seats TEXT[] NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  booking_status TEXT NOT NULL DEFAULT 'confirmed',
  payment_status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create booking_seats table to track individual seat bookings
CREATE TABLE public.booking_seats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  showtime_id UUID REFERENCES public.showtimes(id) NOT NULL,
  seat_number TEXT NOT NULL,
  seat_type TEXT NOT NULL DEFAULT 'regular',
  seat_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(showtime_id, seat_number)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.theaters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.showtimes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_seats ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for movies (public read access)
CREATE POLICY "Movies are viewable by everyone" 
  ON public.movies 
  FOR SELECT 
  USING (true);

-- Create RLS policies for theaters (public read access)
CREATE POLICY "Theaters are viewable by everyone" 
  ON public.theaters 
  FOR SELECT 
  USING (true);

-- Create RLS policies for showtimes (public read access)
CREATE POLICY "Showtimes are viewable by everyone" 
  ON public.showtimes 
  FOR SELECT 
  USING (true);

-- Create RLS policies for bookings (users can only see their own bookings)
CREATE POLICY "Users can view their own bookings" 
  ON public.bookings 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings" 
  ON public.bookings 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for booking_seats
CREATE POLICY "Booking seats are viewable by booking owner" 
  ON public.booking_seats 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings 
      WHERE bookings.id = booking_seats.booking_id 
      AND bookings.user_id = auth.uid()
    )
  );

CREATE POLICY "Booking seats can be created by booking owner" 
  ON public.booking_seats 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.bookings 
      WHERE bookings.id = booking_seats.booking_id 
      AND bookings.user_id = auth.uid()
    )
  );

-- Insert sample data for movies
INSERT INTO public.movies (title, genre, language, duration, rating, image, description) VALUES
('Oppenheimer', 'Drama', 'English', '3h 0m', 8.3, 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop', 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.'),
('Spider-Man: No Way Home', 'Action', 'English', '2h 28m', 8.4, 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&h=600&fit=crop', 'Spider-Man seeks help from Doctor Strange to restore his secret identity.'),
('RRR', 'Action', 'Hindi', '3h 7m', 7.9, 'https://images.unsplash.com/photo-1594736797933-d0bdb6bfcba5?w=400&h=600&fit=crop', 'A fictitious story about two legendary revolutionaries and their journey away from home.');

-- Insert sample data for theaters
INSERT INTO public.theaters (name, city, address) VALUES
('PVR Cinemas', 'Mumbai', 'Bandra West, Mumbai'),
('INOX Multiplex', 'Mumbai', 'Andheri East, Mumbai'),
('Cinepolis', 'Delhi', 'Connaught Place, Delhi'),
('Carnival Cinemas', 'Bangalore', 'Brigade Road, Bangalore');

-- Insert some sample showtimes
INSERT INTO public.showtimes (movie_id, theater_id, show_date, show_time, price, total_seats, available_seats)
SELECT 
  m.id,
  t.id,
  CURRENT_DATE,
  time_slot,
  CASE 
    WHEN time_slot IN ('10:00', '13:30') THEN 250
    WHEN time_slot IN ('17:00', '20:30') THEN 350
    ELSE 300
  END as price,
  100,
  100
FROM public.movies m
CROSS JOIN public.theaters t
CROSS JOIN (VALUES ('10:00'::time), ('13:30'::time), ('17:00'::time), ('20:30'::time)) AS times(time_slot);
