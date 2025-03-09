import { AlertCircle } from 'lucide-react';

import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

type Props = {
  message: string;
};

export function ErrorAlert({ message }: Props) {
  return (
    <Alert variant='destructive'>
      <AlertCircle className='size-4' />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
