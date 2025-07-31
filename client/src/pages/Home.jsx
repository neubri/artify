import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import itemsService from "../services/itemsService";
import {
  formatCurrency,
  formatTimeRemaining,
  getPlaceholderImage,
} from "../utils/helpers";
import { LoadingCard } from "../components/Loading";

const Home = () => {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [endingSoonItems, setEndingSoonItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { isAuthenticated } = useAuth();

  // Yoshitomo Nara artworks for carousel
  const carouselArtworks = [
    {
      id: 1,
      image: "https://artlogic-res.cloudinary.com/w_1400,c_limit,f_auto,fl_lossy,q_auto/ws-guyhepner2/usr/images/feature_panels/image/items/93/93214a4d6b1547e1a22481c3202a85c2/ebf28df2c88fdde7522402a96e7ad7ae.jpg",
      title: "Big Eyes",
      artist: "Yoshitomo Nara",
      price: "Rp 750.000.000 - Rp 1.050.000.000",
      gallery: "Pace Gallery",
      description: "Acrylic on canvas, 2001",
      year: "2001"
    },
    {
      id: 2,
      image: "https://artlogic-res.cloudinary.com/w_1600,h_1600,c_limit,f_auto,fl_lossy,q_auto/artlogicstorage/guyhepner/images/view/3a5a14b0dcdd5f22a8c71e56bb4bc464j/guyhepner-takashi-murakami-dob-in-pure-white-robe-navy-vermilion-2013.jpg",
      title: "DOB in Pure White Robe (Navy & Vermilion)",
      artist: "Takashi Murakami",
      price: "Rp 1.200.000.000 - Rp 1.800.000.000",
      gallery: "David Zwirner",
      description: "Acrylic on canvas, 2013",
      year: "2013"
    },
    {
      id: 3,
      image: "https://artlogic-res.cloudinary.com/w_1600,h_1600,c_limit,f_auto,fl_lossy,q_auto/artlogicstorage/guyhepner/images/view/c0ab55356820f79b1fff3db3b4671fedp/guyhepner-kenny-scharf-felix-on-a-pedestal-1998.png",
      title: "Felix On A Pedestal",
      artist: "Kenny Scharf",
      price: "Rp 3.000.000.000 - Rp 4.500.000.000",
      gallery: "Pace Gallery",
      description: "Acrylic on canvas, 1998",
      year: "1998"
    },
    {
      id: 4,
      image: "https://artlogic-res.cloudinary.com/w_1600,h_1600,c_limit,f_auto,fl_lossy,q_auto/artlogicstorage/guyhepner/images/view/38b0fffc56abd2dadc5a0ac699a928b8j/guyhepner-andy-warhol-marilyn-monroe-f.s.-ii-31-1967.jpg",
      title: "Marilyn Monroe F.S. II 31",
      artist: "Andy Warhol",
      price: "Rp 2.250.000.000 - Rp 3.000.000.000",
      gallery: "Blum & Poe",
      description: "Acrylic on canvas, 1967",
      year: "1967"
    },
    {
      id: 5,
      image: "https://artlogic-res.cloudinary.com/w_1600,h_1600,c_limit,f_auto,fl_lossy,q_auto/artlogicstorage/guyhepner/images/view/ff76e2e795ee8a4308db6f202b1eeda4p/guyhepner-yoshitomo-nara-cosmic-girl-eyes-closed-2008.png",
      title: "Cosmic Girl",
      artist: "Yoshitomo Nara",
      price: "Rp 900.000.000 - Rp 1.350.000.000",
      gallery: "Tomio Koyama Gallery",
      description: "Acrylic on canvas, 2008",
      year: "2008"
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        if (isAuthenticated) {
          const response = await itemsService.getItems({
            status: "active",
            limit: 10,
          });

          const items = response.items || [];
          setFeaturedItems(items.slice(0, 6));
          setEndingSoonItems(items.slice(0, 4));
        } else {
          setFeaturedItems([]);
          setEndingSoonItems([]);
        }
      } catch (error) {
        console.error("Error fetching home data:", error);
        setFeaturedItems([]);
        setEndingSoonItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  // Auto-rotate carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => 
        prev === carouselArtworks.length - 1 ? 0 : prev + 1
      );
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [carouselArtworks.length]);

  const ArtworkCard = ({ item, showTimer = false }) => (
    <Link to={`/items/${item.id}`} className="group block">
      <div className="bg-artsy-white hover:bg-artsy-gray-50 transition-colors duration-200">
        <div className="relative overflow-hidden">
          <img
            src={item.imageUrl || getPlaceholderImage(400, 500)}
            alt={item.name}
            className="w-full aspect-[4/5] object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {showTimer && (
            <div className="absolute top-3 right-3 bg-artsy-black text-artsy-white px-2 py-1 text-xs font-medium">
              {formatTimeRemaining(item.endTime)}
            </div>
          )}
        </div>

        <div className="py-4">
          <div className="text-artsy-gray-600 text-sm mb-1">
            {item.category || "Contemporary Art"}
          </div>
          <h3 className="text-artsy-black font-medium mb-2 group-hover:underline">
            {item.name}
          </h3>
          <div className="text-artsy-gray-600 text-sm mb-2 line-clamp-1">
            {item.description}
          </div>
          <div className="flex justify-between items-end">
            <div>
              <div className="text-artsy-gray-600 text-xs">Current bid</div>
              <div className="text-artsy-black font-medium">
                {formatCurrency(item.currentPrice || item.startingPrice)}
              </div>
            </div>
            <div className="text-artsy-gray-600 text-xs">
              {item.bidCount || 0} bid{(item.bidCount || 0) !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-artsy-white">
      {/* Hero Section - Only show when user is not authenticated */}
      {!isAuthenticated && (
        <section className="bg-artsy-white border-b border-artsy-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
            <div className="max-w-4xl">
              <h1 className="text-4xl md:text-6xl font-serif text-artsy-black mb-6 leading-tight">
                Discover and collect art from emerging artists
              </h1>
              <p className="text-lg md:text-xl text-artsy-gray-700 mb-8 leading-relaxed max-w-2xl">
                Artify connects you with a global network of leading galleries, 
                art fairs, and artists. Bid on works by today's leading artists.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/items"
                  className="inline-flex items-center px-8 py-3 bg-artsy-black text-artsy-white hover:bg-artsy-gray-900 transition-colors duration-200 text-center"
                >
                  Browse artworks
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-8 py-3 border border-artsy-black text-artsy-black hover:bg-artsy-black hover:text-artsy-white transition-colors duration-200 text-center"
                >
                  Start collecting
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Carousel Section - Only show when user is not authenticated */}
      {!isAuthenticated && (
        <section className="bg-artsy-white py-16 border-b border-artsy-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-serif text-artsy-black mb-4">
              Yoshitomo Nara
            </h2>
            <p className="text-lg text-artsy-gray-700">
              Iconic works by one of Japan's most celebrated contemporary artists.
            </p>
          </div>

          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {carouselArtworks.map((artwork) => (
                <div key={artwork.id} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Artwork Image */}
                    <div className="relative">
                      <div className="aspect-[4/5] overflow-hidden bg-artsy-gray-100">
                        <img
                          src={artwork.image}
                          alt={artwork.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = getPlaceholderImage(600, 750);
                          }}
                        />
                      </div>
                    </div>

                    {/* Artwork Info */}
                    <div className="space-y-6">
                      <div>
                        <div className="text-artsy-gray-600 text-sm mb-2">
                          {artwork.gallery}
                        </div>
                        <h3 className="text-3xl md:text-4xl font-serif text-artsy-black mb-3">
                          {artwork.title}, {artwork.year}
                        </h3>
                        <div className="text-lg text-artsy-gray-700 mb-2">
                          {artwork.artist}
                        </div>
                        <div className="text-sm text-artsy-gray-600 mb-4">
                          {artwork.description}
                        </div>
                        <div className="text-xl font-medium text-artsy-black mb-6">
                          {artwork.price}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <Link 
                          to="/items"
                          className="px-8 py-3 bg-artsy-black text-artsy-white hover:bg-artsy-gray-900 transition-colors duration-200 text-center"
                        >
                          View Artwork
                        </Link>
                        <button className="px-8 py-3 border border-artsy-black text-artsy-black hover:bg-artsy-black hover:text-artsy-white transition-colors duration-200">
                          Save to Collection
                        </button>
                      </div>

                      <div className="text-sm text-artsy-gray-600">
                        From the "Masters of Contemporary Art" collection
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel Controls */}
            <div className="flex justify-center mt-8 space-x-2">
              {carouselArtworks.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                    index === currentSlide 
                      ? 'bg-artsy-black' 
                      : 'bg-artsy-gray-300 hover:bg-artsy-gray-400'
                  }`}
                />
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={() => setCurrentSlide(currentSlide === 0 ? carouselArtworks.length - 1 : currentSlide - 1)}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-artsy-white border border-artsy-gray-300 hover:border-artsy-black transition-colors duration-200 flex items-center justify-center"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={() => setCurrentSlide(currentSlide === carouselArtworks.length - 1 ? 0 : currentSlide + 1)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-artsy-white border border-artsy-gray-300 hover:border-artsy-black transition-colors duration-200 flex items-center justify-center"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>
      )}

      {/* Curators' Picks Section - Only show when user is authenticated */}
      {isAuthenticated && (
        <section className="bg-artsy-white border-b border-artsy-gray-200 py-16 pt-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-serif text-artsy-black mb-4">
                Curators' Picks
              </h2>
              <p className="text-lg text-artsy-gray-700 mb-6 max-w-2xl">
                Fresh standout works handpicked by our chief curator.
              </p>
              <Link
                to="/items"
                className="text-artsy-black hover:underline font-medium"
              >
                View All Works →
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {[...Array(8)].map((_, index) => (
                  <LoadingCard key={index} />
                ))}
              </div>
            ) : featuredItems.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-artsy-gray-600">
                  No featured items available at the moment.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {featuredItems.map((item) => (
                  <ArtworkCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Ending Soon Section */}
      {isAuthenticated && (
        <section className="bg-artsy-white py-16 border-b border-artsy-gray-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-serif text-artsy-black mb-4">
                Ending Soon
              </h2>
              <p className="text-lg text-artsy-gray-700 mb-6">
                Don't miss out on these auctions closing soon.
              </p>
              <Link
                to="/items?ending_soon=true"
                className="text-artsy-black hover:underline font-medium"
              >
                View All →
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[...Array(4)].map((_, index) => (
                  <LoadingCard key={index} />
                ))}
              </div>
            ) : endingSoonItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-artsy-gray-600">No auctions ending soon.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {endingSoonItems.map((item) => (
                  <ArtworkCard key={item.id} item={item} showTimer={true} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Editorial Section */}
      <section className={`bg-artsy-white border-b border-artsy-gray-200 ${!isAuthenticated ? 'py-16 pt-24' : 'py-16'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-serif text-artsy-black mb-4">
              Artify Editorial
            </h2>
            <p className="text-lg text-artsy-gray-700">
              Insights into the art world's most important stories, artworks, and artists.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <article className="group">
              <div className="aspect-[3/2] bg-artsy-gray-100 mb-4 overflow-hidden">
                <img 
                  src={getPlaceholderImage(400, 250)} 
                  alt="Editorial" 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="text-artsy-gray-600 text-sm mb-2">Art</div>
              <h3 className="text-artsy-black font-medium mb-2 group-hover:underline">
                The Rise of Digital Art Auctions: How Technology is Reshaping the Market
              </h3>
              <div className="text-artsy-gray-600 text-sm">By Artify Editorial</div>
            </article>

            <article className="group">
              <div className="aspect-[3/2] bg-artsy-gray-100 mb-4 overflow-hidden">
                <img 
                  src={getPlaceholderImage(400, 250)} 
                  alt="Editorial" 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="text-artsy-gray-600 text-sm mb-2">Art Market</div>
              <h3 className="text-artsy-black font-medium mb-2 group-hover:underline">
                What You Need to Know About Collecting Contemporary Art
              </h3>
              <div className="text-artsy-gray-600 text-sm">By Artify Editorial</div>
            </article>

            <article className="group">
              <div className="aspect-[3/2] bg-artsy-gray-100 mb-4 overflow-hidden">
                <img 
                  src={getPlaceholderImage(400, 250)} 
                  alt="Editorial" 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="text-artsy-gray-600 text-sm mb-2">Artist Spotlight</div>
              <h3 className="text-artsy-black font-medium mb-2 group-hover:underline">
                Emerging Artists to Watch: The Next Generation of Talent
              </h3>
              <div className="text-artsy-gray-600 text-sm">By Artify Editorial</div>
            </article>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-artsy-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-artsy-black mb-6">
            Discover and Buy Art that Moves You
          </h2>
          <p className="text-lg text-artsy-gray-700 mb-8 max-w-2xl mx-auto">
            Join our community of collectors, galleries, and art lovers. 
            Start your collection today with works from established and emerging artists.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center px-8 py-3 bg-artsy-black text-artsy-white hover:bg-artsy-gray-900 transition-colors duration-200"
          >
            Sign Up
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
