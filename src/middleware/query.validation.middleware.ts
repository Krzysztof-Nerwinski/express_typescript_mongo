import { NextFunction, Request, RequestHandler, Response } from 'express';
import Joi from 'joi';

function queryValidationMiddleware(schema: Joi.Schema): RequestHandler {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        const validationOptions = {
            abortEarly: false,
            allowUnknown: false,
        };

        try {
            req.query = await schema.validateAsync(
                req.query,
                validationOptions
            );
            next();
        } catch (e) {
            if (e instanceof Joi.ValidationError) {
                const errors: string[] = [];
                e.details.forEach((error: Joi.ValidationErrorItem) => {
                    errors.push(error.message);
                });
                res.status(400).send({ errors });
            } else {
                console.error('Unknown error occurred during validation', e);
                res.status(500).send();
            }
        }
    };
}

export default queryValidationMiddleware;
