import z from 'zod';

export const setCartItemQuantitySchema = z.object({
  productSlug: z
    .string({ message: 'Provide a valid product slug.' })
    .min(1, 'Provide a valid product slug.'),
  quantity: z
    .number({ message: 'Please enter a valid quantity.' })
    .int('Quantity must be a whole number.')
    .nonnegative('Quantity must be 0 or more.')
    .safe('Quantity exceeds the allowed range.'),
});
