
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star, Clock, Calendar, MapPin, Loader2 } from "lucide-react";
import { Header } from "@/components/Header";
import { useMovie } from "@/hooks/useMovies";
import { useShowtimes } from "@/hooks/useShowtimes";

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data: movie, isLoading: movieLoading, error: movieError } = useMovie(id!);
  const { data: showtimes, isLoading: showtimesLoading } = useShowtimes(id);

  if (movieLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="flex items-center gap-2 text-white">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading movie details...</span>
        </div>
      </div>
    );
  }

  if (movieError || !movie) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Movie not found</h2>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Group showtimes by theater
  const showtimesByTheater = showtimes?.reduce((acc, showtime) => {
    const theaterName = showtime.theater?.name || 'Unknown Theater';
    if (!acc[theaterName]) {
      acc[theaterName] = {
        theater: showtime.theater,
        times: []
      };
    }
    acc[theaterName].times.push(showtime);
    return acc;
  }, {} as Record<string, { theater: any; times: any[] }>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      
      {/* Navigation */}
      <div className="container mx-auto px-4 py-4">
        <Link to="/">
          <Button variant="ghost" className="text-white hover:bg-white/10">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Movies
          </Button>
        </Link>
      </div>

      {/* Movie Details */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Movie Poster */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <img
                  src={movie.image || 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop'}
                  alt={movie.title}
                  className="w-full rounded-xl shadow-2xl"
                />
              </div>
            </div>

            {/* Movie Info */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  {movie.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <Badge className="bg-green-500/90 text-white flex items-center text-lg px-3 py-1">
                    <Star className="mr-1 h-4 w-4 fill-current" />
                    {movie.rating}
                  </Badge>
                  <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 text-lg px-3 py-1">
                    {movie.genre}
                  </Badge>
                  <Badge variant="outline" className="border-white/30 text-white text-lg px-3 py-1">
                    {movie.language}
                  </Badge>
                  <div className="flex items-center text-white/70">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{movie.duration}</span>
                  </div>
                </div>

                {movie.description && (
                  <p className="text-white/80 text-lg leading-relaxed">
                    {movie.description}
                  </p>
                )}
              </div>

              {/* Showtimes */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Calendar className="mr-2 h-6 w-6" />
                  Book Tickets
                </h2>

                {showtimesLoading ? (
                  <div className="flex items-center gap-2 text-white">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading showtimes...</span>
                  </div>
                ) : showtimesByTheater && Object.keys(showtimesByTheater).length > 0 ? (
                  <div className="space-y-6">
                    {Object.entries(showtimesByTheater).map(([theaterName, { theater, times }]) => (
                      <Card key={theaterName} className="bg-white/10 backdrop-blur-md border-white/20">
                        <CardHeader>
                          <CardTitle className="text-white flex items-center">
                            <MapPin className="mr-2 h-5 w-5" />
                            {theaterName}
                          </CardTitle>
                          {theater?.address && (
                            <p className="text-white/70 text-sm">{theater.address}</p>
                          )}
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {times.map((showtime) => (
                              <Link
                                key={showtime.id}
                                to={`/seat-selection/${movie.id}/${encodeURIComponent(theaterName)}/${showtime.show_time}`}
                                state={{ showtime }}
                              >
                                <Button
                                  variant="outline"
                                  className="w-full border-white/30 text-white hover:bg-red-500 hover:border-red-500 hover:text-white transition-colors"
                                >
                                  <div className="text-center">
                                    <div className="font-semibold">{showtime.show_time}</div>
                                    <div className="text-xs opacity-75">₹{showtime.price}</div>
                                  </div>
                                </Button>
                              </Link>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="bg-white/10 backdrop-blur-md border-white/20">
                    <CardContent className="p-6 text-center text-white/70">
                      <p>No showtimes available for this movie.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MovieDetails;
