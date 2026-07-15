import swaggerJsdoc from 'swagger-jsdoc'

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Student Skill Marketplace API',
            version: '1.0.0',
            description: 'API for booking and offering peer-to-peer skill sessions'
        },
        servers: [
            { url: 'http://localhost:8080/api', description: 'Local dev server' }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [{ bearerAuth: [] }]
    },
    apis: ['./routes/*.js']  // where swagger-jsdoc looks for JSDoc comments
}

export const swaggerSpec = swaggerJsdoc(options)