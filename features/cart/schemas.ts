import z from 'zod';

export const setCartItemSchema = z.object({
  path: z.string().min(1, 'Path is required'),
  productId: z
    .number()
    .int('Product ID must be a whole number')
    .positive('Product ID must be a positive number'),
  quantity: z
    .number()
    .int('Quantity must be a whole number')
    .nonnegative('Quantity must be 0 or more')
    .safe('Quantity is too large'),
});
