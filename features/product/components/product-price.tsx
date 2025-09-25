import { cn } from '@/lib/utils/cn';

type Props = {
  price: number;
  size?: 'default' | 'lg' | 'sm';
};

export function ProductPrice({ price, size = 'default' }: Props) {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    currency: 'USD',
    style: 'currency',
  }).formatToParts(price);

  return (
    <span className={cn(size === 'sm' && 'text-sm', size === 'lg' && 'text-lg')}>
      {formattedPrice.map(({ type, value }, index) =>
        type === 'integer' ?
          <span
            className={cn(
              'font-medium',
              size === 'sm' && 'text-base lg:text-lg',
              size === 'default' && 'text-lg lg:text-xl',
              size === 'lg' && 'text-xl lg:text-2xl',
            )}
            key={index}
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
