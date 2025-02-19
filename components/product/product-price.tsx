import { cn } from '@/lib/utils';

type Props = {
  price: number;
  size?: 'sm' | 'default' | 'lg';
};

export function ProductPrice({ price, size = 'default' }: Props) {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).formatToParts(price);

  return (
    <span className={cn(size === 'sm' && 'text-sm', size === 'lg' && 'text-lg')}>
      {formattedPrice.map(({ type, value }, index) =>
        type === 'integer' ?
          <span
            key={index}
            className={cn(
              'font-medium',
              size === 'sm' && 'text-base lg:text-lg',
              size === 'default' && 'text-lg lg:text-xl',
              size === 'lg' && 'text-xl lg:text-2xl',
            )}
          >
            {value}
          </span>
        : type === 'decimal' || type === 'fraction' || (type === 'currency' && index === 0) ?
          <sup key={index}>{value}</sup>
        : value,
      )}
    </span>
  );
}
