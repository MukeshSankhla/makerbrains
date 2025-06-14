
import { Card, CardHeader } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface Magazine {
  id: number;
  title: string;
  image_url: string;
  website_url: string;
}

export default function Magazines() {
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 5;
    const retryDelay = 3000; // 3 seconds between retries
    
    // Check cache first
    const cachedData = sessionStorage.getItem('magazines-data');
    const cacheTimestamp = sessionStorage.getItem('magazines-timestamp');
    const cacheExpiry = 5 * 60 * 1000; // 5 minutes
    
    if (cachedData && cacheTimestamp) {
      const timestamp = parseInt(cacheTimestamp, 10);
      if (Date.now() - timestamp < cacheExpiry) {
        // Use cached data
        setMagazines(JSON.parse(cachedData));
        setIsLoading(false);
        return;
      }
    }
    
    const fetchMagazines = async () => {
      try {
        const { data, error } = await supabase
          .from('magazines')
          .select('*')
          .order('id', { ascending: false });
        
        if (error) {
          console.error('Error fetching magazines:', error);
          // Only attempt retries if we're still mounted
          if (isMounted && retryCount < maxRetries) {
            retryCount++;
            console.log(`Retrying fetch (${retryCount}/${maxRetries})...`);
            setTimeout(fetchMagazines, retryDelay);
          }
          return;
        }
        
        // Only update state if component is still mounted
        if (isMounted) {
          const magazineData = data || [];
          setMagazines(magazineData);
          setIsLoading(false);
          
          // Cache the data
          sessionStorage.setItem('magazines-data', JSON.stringify(magazineData));
          sessionStorage.setItem('magazines-timestamp', Date.now().toString());
        }
      } catch (error: any) {
        console.error('Unexpected error fetching magazines:', error);
        // Retry on unexpected errors too
        if (isMounted && retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying fetch after error (${retryCount}/${maxRetries})...`);
          setTimeout(fetchMagazines, retryDelay);
        }
      }
    };
    
    // Start fetching
    fetchMagazines();
    
    // Cleanup function to prevent memory leaks and state updates after unmount
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="py-5">
      <div className="space-y-6">
        <h1 className="text-4xl font-bold relative inline-block">Magazine Features</h1>
        <div className="grid grid-cols-1 gap-6">
          {isLoading ? (
            // Show skeletons during loading
            Array(3).fill(0).map((_, index) => (
              <Card key={`skeleton-${index}`} className="flex flex-col overflow-hidden">
                <CardHeader className="flex items-center p-4">
                  <Skeleton className="w-full h-32 rounded-lg" />
                  <Skeleton className="h-6 w-3/4 mt-4" />
                </CardHeader>
              </Card>
            ))
          ) : magazines.length > 0 ? (
            magazines.map((magazine) => (
              <Card key={magazine.id} className="flex flex-col overflow-hidden hover:shadow-md transition-all">
                <CardHeader className="flex flex-col items-center p-4">
                  <div className="relative w-full h-auto">
                    <a 
                      href={magazine.website_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      aria-label={`Visit ${magazine.title}`}
                    >
                      <img
                        src={magazine.image_url}
                        alt={magazine.title}
                        className="w-full object-cover rounded-lg"
                        loading="lazy"
                        onError={(e) => {
                          // Fallback for image errors
                          (e.currentTarget as HTMLImageElement).src = "/placeholder.svg";
                          (e.currentTarget as HTMLImageElement).alt = `${magazine.title} (image unavailable)`;
                        }}
                      />
                    </a>
                  </div>
                  <h3 className="font-medium text-lg text-center">{magazine.title}</h3>
                </CardHeader>
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground col-span-full text-center py-8">
              No magazines available at the moment.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
