'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import type { Product } from '@prisma/client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';

type Props = {
  images: Product['images'];
  alt: string;
};

// TODO Conditional rendering for mobile and desktop
// TODO Split into smaller components
// TODO Fullscreen mode for images
export function ProductImageGallery({ images, alt }: Props) {
  const [mainCarouselApi, setMainCarouselApi] = useState<CarouselApi>();
  const [thumbCarouselApi, setThumbCarouselApi] = useState<CarouselApi>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const onThumbClick = useCallback(
    (index: number) => {
      if (!mainCarouselApi || !thumbCarouselApi) return;
      mainCarouselApi.scrollTo(index);
    },
    [mainCarouselApi, thumbCarouselApi],
  );

  const onMainCarouselSelect = useCallback(() => {
    if (!mainCarouselApi || !thumbCarouselApi) return;

    const currentImageIndex = mainCarouselApi.selectedScrollSnap();

    setCurrentImageIndex(currentImageIndex);
    thumbCarouselApi.scrollTo(currentImageIndex);
  }, [mainCarouselApi, thumbCarouselApi]);

  useEffect(() => {
    if (!mainCarouselApi) return;

    onMainCarouselSelect();

    mainCarouselApi.on('select', onMainCarouselSelect).on('reInit', onMainCarouselSelect);
  }, [mainCarouselApi, onMainCarouselSelect]);

  const thumbContainerRef = useCallback(
    (thumbsNode: HTMLElement | null) => {
      if (!thumbsNode || !mainCarouselApi) return;

      const carouselNode = mainCarouselApi.rootNode();
      const resizeObserver = new ResizeObserver(() => {
        thumbsNode.style.height = `${carouselNode.getBoundingClientRect().height}px`;
      });

      resizeObserver.observe(carouselNode);
      return () => resizeObserver.disconnect();
    },
    [mainCarouselApi],
  );

  return (
    <div className='flex items-start gap-2.5'>
      <Carousel
        className='hidden shrink-0 md:block'
        orientation='vertical'
        setApi={setThumbCarouselApi}
        opts={{
          containScroll: 'keepSnaps',
          dragFree: true,
        }}
        plugins={[WheelGesturesPlugin()]}
      >
        <CarouselContent ref={thumbContainerRef} className='mx-1 -mt-1.5 mb-1.5 min-h-80'>
          {images.map((image, index) => (
            <CarouselItem key={index} className='basis-0 pt-1.5'>
              <Button
                type='button'
                variant='ghost'
                onClick={() => onThumbClick(index)}
                className={cn(
                  'size-auto rounded p-0 focus-visible:ring-foreground',
                  index === currentImageIndex && 'brightness-75 filter',
                )}
              >
                <Image src={image} alt={alt} width={60} height={60} className='rounded' />
              </Button>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <Carousel setApi={setMainCarouselApi}>
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
        <div className='flex-center absolute inset-x-0 bottom-2 gap-2 md:hidden'>
          {images.map((_, index) => (
            <Button
              type='button'
              key={index}
              onClick={() => onThumbClick(index)}
              className={cn(
                'size-2 rounded-full border border-black/25 bg-white px-1.5 py-0 hover:bg-white',
                index === currentImageIndex && 'border-white/40 bg-black hover:bg-black',
              )}
            />
          ))}
        </div>
        <CarouselPrevious className='inset-auto bottom-0 right-14 hidden ring-offset-foreground/75 focus-visible:ring-background md:inline-flex' />
        <CarouselNext className='inset-auto bottom-0 right-4 hidden ring-offset-foreground/75 focus-visible:ring-background md:inline-flex' />
      </Carousel>
    </div>
  );
}
