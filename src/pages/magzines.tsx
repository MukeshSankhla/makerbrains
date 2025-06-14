import { Card, CardHeader } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/config/firebase";

interface Magazine {
  id: string;
  title: string;
  image_url: string;
  website_url: string;
}

export default function Magazines() {
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchMagazines = async () => {
      try {
        const magazinesQuery = query(collection(db, "magazines"), orderBy("id", "desc"));
        const querySnapshot = await getDocs(magazinesQuery);
        if (isMounted) {
          setMagazines(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Magazine)));
          setIsLoading(false);
        }
      } catch (error: any) {
        if (isMounted) setIsLoading(false);
        console.error("Error fetching magazines:", error);
      }
    };
    fetchMagazines();
    return () => { isMounted = false; };
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
