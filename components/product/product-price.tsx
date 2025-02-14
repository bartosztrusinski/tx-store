type Props = {
  price: number;
};

export function ProductPrice({ price }: Props) {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).formatToParts(price);

  return (
    <p className='text-lg'>
      {formattedPrice.map(({ type, value }, index) =>
        type === 'integer' ?
          <span key={index} className='text-xl font-medium lg:text-2xl'>
            {value}
          </span>
        : type === 'decimal' || type === 'fraction' || (type === 'currency' && index === 0) ?
          <sup key={index}>{value}</sup>
        : value,
      )}
    </p>
  );
}
