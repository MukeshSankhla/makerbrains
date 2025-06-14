
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import LazyImage from "@/components/LazyImage";

interface Sponsor {
  id: number;
  name: string;
  image_url: string;
  website_url: string;
}

export default function Sponsors() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  
  useEffect(() => {
    let isMounted = true;
    
    const fetchSponsors = async (attempt: number = 1) => {
      try {
        setError(null);
        
        // Check for cached data first, but with smaller cache window
        if (attempt === 1) {
          try {
            const cachedData = sessionStorage.getItem('sponsors-data');
            const cacheTimestamp = sessionStorage.getItem('sponsors-timestamp');
            const cacheExpiry = 5 * 60 * 1000; // 5 minutes
            
            if (cachedData && cacheTimestamp) {
              const timestamp = parseInt(cacheTimestamp, 10);
              if (Date.now() - timestamp < cacheExpiry) {
                const sponsorsData = JSON.parse(cachedData);
                if (isMounted) {
                  setSponsors(sponsorsData);
                  setIsLoading(false);
                }
                return;
              }
            }
          } catch (cacheError) {
            console.warn('Cache read error:', cacheError);
          }
        }
        
        console.log(`Fetching sponsors (attempt ${attempt}/${maxRetries})...`);
        
        const { data, error } = await supabase
          .from('sponsors')
          .select('*')
          .order('id', { ascending: true });
          
        if (error) throw error;
        
        if (isMounted) {
          const sponsorsData = data || [];
          setSponsors(sponsorsData);
          
          // Try to cache, but handle quota exceeded gracefully
          try {
            sessionStorage.setItem('sponsors-data', JSON.stringify(sponsorsData));
            sessionStorage.setItem('sponsors-timestamp', Date.now().toString());
          } catch (storageError) {
            console.warn('Could not cache sponsors data:', storageError);
            // Try clearing some old data and retry once
            try {
              sessionStorage.removeItem('initial-projects');
              sessionStorage.removeItem('magazines-data');
              sessionStorage.setItem('sponsors-data', JSON.stringify(sponsorsData));
              sessionStorage.setItem('sponsors-timestamp', Date.now().toString());
            } catch (retryError) {
              console.warn('Storage quota exceeded, continuing without cache:', retryError);
            }
          }
        }
      } catch (error) {
        console.error(`Error fetching sponsors (attempt ${attempt}):`, error);
        
        if (attempt < maxRetries && isMounted) {
          setRetryCount(attempt);
          console.log(`Retrying fetch (${attempt + 1}/${maxRetries})...`);
          setTimeout(() => fetchSponsors(attempt + 1), 2000 * attempt); // Exponential backoff
        } else if (isMounted) {
          setError('Failed to load sponsors. Please try refreshing the page.');
        }
      } finally {
        if (isMounted && (attempt >= maxRetries || !error)) {
          setIsLoading(false);
        }
      }
    };
    
    fetchSponsors();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Show skeletons during loading
  if (isLoading) {
    return (
      <section className="py-5">
        <div className="">
          <h1 className="text-4xl font-bold mb-2">Our Sponsors</h1>
          <p className="pb-4">
            We're grateful for the support of these amazing companies.
          </p>
          {retryCount > 0 && (
            <p className="text-sm text-muted-foreground pb-2">
              Loading... (attempt {retryCount + 1}/{maxRetries})
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {Array(8).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-5">
      <div className="">
        <h1 className="text-4xl font-bold mb-2">Our Sponsors</h1>
        <p className="pb-4">
          We're grateful for the support of these amazing companies.
        </p>
      </div>
      
      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {sponsors.length > 0 ? sponsors.map((sponsor) => (
          <a
            key={sponsor.id}
            href={sponsor.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow flex justify-center items-center h-20"
            aria-label={`Visit ${sponsor.name} website`}
          >
            <LazyImage
              src={sponsor.image_url}
              alt={`${sponsor.name} logo`}
              className="h-full max-h-12 object-contain"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
          </a>
        )) : (
          <p className="col-span-full text-center text-muted-foreground">
            No sponsors available at the moment.
          </p>
        )}
      </div>
    </section>
  );
}
