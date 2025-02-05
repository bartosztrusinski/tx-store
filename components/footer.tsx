import { APP_NAME } from '@/lib/constants';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='border-t p-5'>
      <p className='flex-center'>
        {currentYear} {APP_NAME}. All Rights Reserved
      </p>
    </footer>
  );
}
