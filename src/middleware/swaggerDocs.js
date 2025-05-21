import {readFileSync} from 'node:fs';
import swaggerUi from 'swagger-ui-express';

import {SWAGGER_PATH} from '../constants/index.js';

export const swaggerDocs = () => {
    try {
        const swaggerDocs = JSON.parse(readFileSync(SWAGGER_PATH).toString());
        return [...swaggerUi.serve, swaggerUi.setup(swaggerDocs)];
    } catch (e) {
        return (req, res) => {
            res.status(500).json({
                message: 'Cannot load swagger docs',
            });
        };
    }
};
