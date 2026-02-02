import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodSchema, ZodError } from 'zod';

// export const loginSchema = z
//   .object({
//     email: z.string().email().transform((v) => v.toLowerCase()),
//     password: z.string().min(1),
//   })
//   .strict();

type SchemaBundle = {
  body?: ZodSchema<any>;
  query?: ZodSchema<any>;
  params?: ZodSchema<any>;
  headers?: ZodSchema<any>;
  cookies?: ZodSchema<any>;
};

const  formatZodError  =(err: ZodError)  =>{
  return err.issues.map((issue) => ({
    path: issue.path.join('.') || '(root)',
    message: issue.message,
    code: issue.code,
  }));
}
//schemas = loginSchema as and Object 
export function validateRequest(schemas: SchemaBundle): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const details: Array<{ path: string; message: string; code?: string }> = [];

    try {
      if (schemas.body) {
        const parsed = schemas.body.safeParse(req.body);//zod parse the request body to the schema
        if (!parsed.success) {
          details.push(...formatZodError(parsed.error).map(d => ({ ...d, path: `body.${d.path}` })));
        } else {
          req.body = parsed.data;
        }
      }

      if (schemas.query) {
        const parsed = schemas.query.safeParse(req.query);
        if (!parsed.success) {
          details.push(...formatZodError(parsed.error).map(d => ({ ...d, path: `query.${d.path}` })));
        } else {
          req.query = parsed.data as any;
        }
      }

      if (schemas.params) {
        const parsed = schemas.params.safeParse(req.params);
        if (!parsed.success) {
          details.push(...formatZodError(parsed.error).map(d => ({ ...d, path: `params.${d.path}` })));
        } else {
          req.params = parsed.data as any;
        }
      }

      if (schemas.headers) {
        const parsed = schemas.headers.safeParse(req.headers);
        if (!parsed.success) {
          details.push(...formatZodError(parsed.error).map(d => ({ ...d, path: `headers.${d.path}` })));
        } else {
          req.headers = parsed.data as any;
        }
      }

      if (schemas.cookies) {
        const parsed = schemas.cookies.safeParse((req as any).cookies);
        if (!parsed.success) {
          details.push(...formatZodError(parsed.error).map(d => ({ ...d, path: `cookies.${d.path}` })));
        } else {
          (req as any).cookies = parsed.data;
        }
      }

      if (details.length > 0) {
        return res.status(400).json({
          error: 'ValidationError',
          message: 'Invalid request',
          details,
        });
      }

      return next();
    } catch (err) {
      return res.status(400).json({
        error: 'ValidationError',
        message: 'Invalid request',
        details: [{ path: '(unknown)', message: (err as Error).message }],
      });
    }
  };
}
