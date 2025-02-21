'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import type { Product } from '@prisma/client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';

import { cn } from '@/lib/utils';

type Props = {
  images: Product['images'];
  alt: string;
};

export function ProductImageGallery({ images, alt }: Props) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!carouselApi) return;

    const controller = new AbortController();

    setCurrentImageIndex(carouselApi.selectedScrollSnap());

    carouselApi.on('select', () => {
      setCurrentImageIndex(carouselApi.selectedScrollSnap());
    });

    window.addEventListener(
      'resize',
      () => {
        if (thumbnailsRef.current) {
          thumbnailsRef.current.style.height = `${carouselApi.rootNode().clientHeight}px`;
        }
      },
      { signal: controller.signal },
    );

    return () => {
      controller.abort();
    };
  }, [carouselApi]);

  return (
    <div className='flex flex-col-reverse gap-4 md:flex-row'>
      <div ref={thumbnailsRef} className='flex max-h-max shrink-0 gap-2 overflow-auto md:flex-col'>
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => carouselApi?.scrollTo(index)}
            className={cn('shrink-0 ring-2', index === currentImageIndex && 'opacity-80')}
          >
            <Image src={image} alt={alt} width={60} height={60} className='rounded' />
          </button>
        ))}
      </div>

      <Carousel setApi={setCarouselApi}>
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <Image
                src={image}
                alt={alt}
                width={640}
                height={640}
                className='w-full rounded object-cover object-center'
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className='flex-center absolute inset-x-0 bottom-2 gap-2'>
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => carouselApi?.scrollTo(index)}
              className={cn(
                'size-2 rounded-full bg-white ring-1 ring-black/25',
                index === currentImageIndex && 'bg-black',
              )}
            />
          ))}
        </div>
        <CarouselPrevious className='inset-auto bottom-0 right-14' />
        <CarouselNext className='inset-auto bottom-0 right-4' />
      </Carousel>
    </div>
  );
}
