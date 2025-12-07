import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationError } from 'express-validator';

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Используем type assertion чтобы сказать TypeScript, что это нужный тип
    const formattedErrors = errors
      .array()
      .map((e: any) => ({
        field: e.param,
        message: e.msg,
        value: e.value,
      }));

    return res.status(400).json({
      error: 'Validation failed',
      errors: formattedErrors,
    });
  }

  next();
};