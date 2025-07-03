
import { Header } from "@/components/Header";
import { MovieCard } from "@/components/MovieCard";
import { useMovies } from "@/hooks/useMovies";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { data: movies, isLoading, error } = useMovies();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="flex items-center gap-2 text-white">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading movies...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Error loading movies</h2>
          <p className="text-white/70">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent z-10"></div>
        <div className="container mx-auto text-center relative z-20">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Book Your Movie
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500"> Experience</span>
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Discover the latest movies, find showtimes, and book your tickets with ease. 
            Your next cinematic adventure awaits!
          </p>
        </div>
        
        {/* Floating movie posters background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {movies?.slice(0, 6).map((movie, index) => (
            <div
              key={movie.id}
              className={`absolute opacity-10 animate-float ${
                index % 2 === 0 ? 'animate-delay-1000' : ''
              }`}
              style={{
                left: `${Math.random() * 80}%`,
                top: `${Math.random() * 80}%`,
                animationDelay: `${index * 2}s`,
              }}
            >
              <img
                src={movie.image || 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=200&h=300&fit=crop'}
                alt=""
                className="w-32 h-48 object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Movies Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Now Showing</h2>
            <p className="text-white/70 text-lg">Choose from our latest collection of movies</p>
          </div>
          
          {movies && movies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="text-center text-white/70">
              <p>No movies available at the moment.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;
