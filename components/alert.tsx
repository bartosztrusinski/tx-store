import { type ElementType } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Alert as _Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

type AlertVariant = 'success' | 'error';

type Props = {
  message: string;
  variant: AlertVariant;
};

const alertVariants = {
  success: {
    type: 'success' as const,
    Icon: CheckCircle,
    title: 'Success',
  },
  error: {
    type: 'destructive' as const,
    Icon: AlertCircle,
    title: 'Error',
  },
} satisfies Record<AlertVariant, { type: string; title: string; Icon: ElementType }>;

export function Alert({ message, variant }: Props) {
  const { type, title, Icon } = alertVariants[variant];

  return (
    <_Alert variant={type}>
      <Icon className='size-4' />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </_Alert>
  );
}
