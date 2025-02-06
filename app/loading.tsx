import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className='flex h-screen flex-col font-sans'>
      <div className='border-b'>
        <div className='wrapper flex-between gap-4'>
          <div className='flex-center gap-2 md:gap-4'>
            <Skeleton className='h-10 w-20 md:w-36' />
          </div>
          <Skeleton className='h-10 w-72' />
          <div className='hidden gap-2 sm:flex'>
            <Skeleton className='h-10 w-56' />
          </div>
        </div>
      </div>
      <div className='wrapper flex-1'>
        <Skeleton className='h-56' />
        <div className='mt-6 grid grid-cols-2 gap-4'>
          <Skeleton className='h-36' />
          <Skeleton className='h-36' />
          <Skeleton className='h-36' />
          <Skeleton className='h-36' />
        </div>
      </div>
    </div>
  );
}
