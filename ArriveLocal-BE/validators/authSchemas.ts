import { z } from 'zod';

const roleEnum = z.enum(["user", "seller", "delivery_partner"]);

export const registerSchema = z
  .object({
    name: z.string().min(2).max(50),
    email: z.string().email().transform((v) => v.toLowerCase()),
    password: z.string().min(8),
    mobile: z.string().min(10).max(15),
    role: roleEnum.optional().default("user"),
  })
  .strict();

export const loginSchema = z
  .object({
    email: z.string().email().transform((v) => v.toLowerCase()),
    password: z.string().min(1),
  })
  .strict();

// For cookies validation, we validate only the fields we care about
export const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

// Optional cookie for logout; controller can handle absence gracefully
export const logoutSchema = z.object({
  refreshToken: z.string().optional(),
});

// Optional header schema when not relying solely on middleware
export const meHeadersSchema = z.object({
  authorization: z.string().regex(/^Bearer\s+.+$/).optional(),
});

// Optionally export types inferred from schemas (helpful in controllers later)
export type RegisterDTO = z.infer<typeof registerSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;
