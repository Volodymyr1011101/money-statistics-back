import { HttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
    console.error('Error Handler:', {
        name: err.name,
        message: err.message,
        stack: err.stack,
        code: err.code,
    });

    if (err instanceof HttpError) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            data: err,
        });
        return;
    }

    res.status(500).json({
        status: 500,
        message: 'Something went wrong',
        data: err.message,
    });
};
