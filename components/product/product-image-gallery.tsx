'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
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
    <div className='flex flex-col-reverse gap-4 md:flex-row'>
      <Carousel
        className='max-h-max shrink-0'
        orientation='vertical'
        opts={{
          containScroll: 'keepSnaps',
          dragFree: true,
        }}
        setApi={setThumbCarouselApi}
      >
        <CarouselContent ref={thumbContainerRef} className='-mt-2 mb-2'>
          {images.map((image, index) => (
            <CarouselItem key={index} className='basis-0 pt-2'>
              <button
                type='button'
                onClick={() => onThumbClick(index)}
                className={cn('rounded', index === currentImageIndex && 'brightness-75 filter')}
              >
                <Image src={image} alt={alt} width={60} height={60} className='rounded' />
              </button>
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
        <div className='flex-center absolute inset-x-0 bottom-2 gap-2'>
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => onThumbClick(index)}
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
