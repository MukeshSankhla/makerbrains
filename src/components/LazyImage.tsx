
import React, { useState, useRef, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'sync' | 'auto';
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  loading = 'lazy',
  decoding = 'async',
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setHasError(true);
    setIsLoaded(true);
    if (onError) {
      onError(e);
    } else {
      (e.target as HTMLImageElement).src = "/placeholder.svg";
    }
  };

  return (
    <div ref={imgRef} className={`relative ${className}`}>
      {!isLoaded && (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}
      {isInView && (
        <img
          src={hasError ? "/placeholder.svg" : src}
          alt={alt}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          loading={loading}
          decoding={decoding}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
};

export default LazyImage;
