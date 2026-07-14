import { z } from 'zod';

export const personalDetailsSchema = z.object({
  firstName: z.string().nonempty('First name is required'),
  lastName: z.string().nonempty('Last name is required'),
  email: z.string().email('Enter a valid email'),
  phone: z
    .string()
    .nonempty('Phone number is required')
    .regex(/^\d+$/, 'Phone number must contain only digits'),
  countryCode: z.string(),
  bvn: z
    .string()
    .length(11, 'BVN must be exactly 11 digits')
    .regex(/^\d+$/, 'BVN must contain only digits'),
});

export type PersonalDetailsSchema = z.infer<typeof personalDetailsSchema>;

export const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[a-z]/, 'Password must include lowercase letters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type PasswordDetailsSchema = z.infer<typeof passwordSchema>;

export const transactionPinSchema = z
  .object({
    pin: z
      .string()
      .length(4, 'PIN must be 4 digits')
      .regex(/^\d{4}$/, 'PIN must contain only numbers'),
    confirmPin: z.string(),
  })
  .refine((data) => data.pin === data.confirmPin, {
    message: 'PINs do not match',
    path: ['confirmPin'],
  });

export type TransactionPinSchema = z.infer<typeof transactionPinSchema>;
