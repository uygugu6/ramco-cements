
export interface Movie {
  id: string;
  title: string;
  genre: string;
  language: string;
  duration: string;
  rating: number;
  image: string | null;
  description: string | null;
  created_at: string;
}

export interface Theater {
  id: string;
  name: string;
  city: string;
  address: string | null;
  created_at: string;
}

export interface Showtime {
  id: string;
  movie_id: string;
  theater_id: string;
  show_date: string;
  show_time: string;
  price: number;
  total_seats: number;
  available_seats: number;
  created_at: string;
  movie?: Movie;
  theater?: Theater;
}

export interface Booking {
  id: string;
  booking_id: string;
  user_id: string | null;
  movie_id: string;
  theater_id: string;
  showtime_id: string;
  selected_seats: string[];
  total_price: number;
  booking_status: string;
  payment_status: string;
  created_at: string;
  movie?: Movie;
  theater?: Theater;
  showtime?: Showtime;
}

export interface BookingSeat {
  id: string;
  booking_id: string;
  showtime_id: string;
  seat_number: string;
  seat_type: string;
  seat_price: number;
  created_at: string;
}
