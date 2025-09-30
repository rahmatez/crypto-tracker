"use client";

import Image from 'next/image';
import { useState } from 'react';
import { Coins } from 'lucide-react';

interface CoinImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}

export function CoinImage({ src, alt, width, height, className = '', priority = false }: CoinImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div 
        className={`${className} flex items-center justify-center bg-muted/50`}
        style={{ width, height }}
      >
        <Coins className="h-5 w-5 text-muted-foreground" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      onError={() => setHasError(true)}
      loading={priority ? 'eager' : 'lazy'}
    />
  );
}