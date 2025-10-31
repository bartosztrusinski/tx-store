import { type ComponentProps } from 'react';

type Props = ComponentProps<'span'> & {
  price: number;
};

export function ProductPrice({ price, ...props }: Props) {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    currency: 'USD',
    style: 'currency',
  }).formatToParts(price);

  return (
    <span {...props}>
      {formattedPrice.map(({ value }, index) => (
        <span key={index}>{value}</span>
      ))}
    </span>
  );
}
