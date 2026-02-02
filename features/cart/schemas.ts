import z from 'zod';

const productSlugSchema = z
  .string({ message: 'Provide a valid product slug.' })
  .min(1, 'Provide a valid product slug.');

export const setCartItemQuantitySchema = z.object({
  productSlug: productSlugSchema,
  quantity: z
    .number({ message: 'Please enter a valid quantity.' })
    .int('Quantity must be a whole number.')
    .nonnegative('Quantity must be 0 or more.')
    .safe('Quantity exceeds the allowed range.'),
});

export const selectCartItemSchema = z.object({
  productSlug: productSlugSchema,
});
