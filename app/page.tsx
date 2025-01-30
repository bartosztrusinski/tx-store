import Image from 'next/image';

export default function HomePage() {
  return (
    <div className='flex items-center gap-1 p-2 bg-white text-black'>
      <Image src='logo.svg' alt='tx store logo' width={32} height={32} />
      <p className='text-2xl font-bold'>Store</p>
    </div>
  );
}
