import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import LazyImage from "@/components/LazyImage";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/config/firebase";

interface Sponsor {
  id: string;
  name: string;
  image_url: string;
  website_url: string;
}

export default function Sponsors() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchSponsors = async () => {
      try {
        setError(null);
        const sponsorsQuery = query(collection(db, "sponsors"), orderBy("name", "asc"));
        const querySnapshot = await getDocs(sponsorsQuery);
        if (isMounted) {
          setSponsors(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sponsor)));
          setIsLoading(false);
        }
      } catch (error: any) {
        if (isMounted) {
          setError("Failed to load sponsors. Please try refreshing the page.");
          setIsLoading(false);
        }
      }
    };
    fetchSponsors();
    return () => { isMounted = false; };
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
