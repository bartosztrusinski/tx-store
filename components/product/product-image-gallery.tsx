import Image from 'next/image';
import type { Product } from '@prisma/client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

type Props = {
  images: Product['images'];
  alt: string;
};

export function ProductImageGallery({ images, alt }: Props) {
  return (
    <div className='flex flex-col gap-4 md:flex-row'>
      {/* TODO add thumbnail logic */}
      <div className='order-2 flex shrink-0 gap-2 md:order-none md:flex-col'>
        {images.map((image, index) => (
          <Image key={index} src={image} alt={alt} width={60} height={60} className='rounded' />
        ))}
      </div>

      <Carousel>
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
        <CarouselPrevious className='inset-auto bottom-0 right-14' />
        <CarouselNext className='inset-auto bottom-0 right-4' />
      </Carousel>
    </div>
  );
}
