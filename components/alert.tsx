import { AlertCircle, CheckCircle } from 'lucide-react';
import { type ElementType } from 'react';

import { Alert as _Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type AlertVariant = 'success' | 'error';

type Props = {
  message: string;
  variant: AlertVariant;
};

const alertVariants = {
  error: {
    Icon: AlertCircle,
    title: 'Error',
    type: 'destructive' as const,
  },
  success: {
    Icon: CheckCircle,
    title: 'Success',
    type: 'success' as const,
  },
} satisfies Record<AlertVariant, { Icon: ElementType; title: string; type: string }>;

export function Alert({ message, variant }: Props) {
  const { Icon, title, type } = alertVariants[variant];

  return (
    <_Alert variant={type}>
      <Icon className='size-4' />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </_Alert>
  );
}
