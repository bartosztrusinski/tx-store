import { CheckCircle } from 'lucide-react';

import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

type Props = {
  message: string;
};

export function SuccessAlert({ message }: Props) {
  return (
    <Alert variant='success'>
      <CheckCircle className='size-4' />
      <AlertTitle>Success</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
