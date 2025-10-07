import z from 'zod';

export const setCartItemSchema = z.object({
  path: z.string({
    invalid_type_error: 'Path must be a string.',
    required_error: 'Path was not provided.',
  }),
  productSlug: z
    .string({
      invalid_type_error: 'Product slug must be a string.',
      required_error: 'Product slug was not provided.',
    })
    .min(1),
  quantity: z
    .number({
      invalid_type_error: 'Quantity must be a number.',
      required_error: 'Quantity was not provided.',
    })
    .int('Quantity must be a whole number.')
    .nonnegative('Quantity must be 0 or more.')
    .safe('Quantity is too large.'),
});
