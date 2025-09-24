import swaggerJsdoc from 'swagger-jsdoc';

const servers = [
  { url: 'http://localhost:6500', description: 'Local' }
];

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Prisma Walkthrough API',
      version: '1.0.0',
      description: 'Users, Posts, Comments with JWT auth'
    },
    servers,
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
          
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Post: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            title: { type: 'string' },
            content: { type: 'string' },
            published: { type: 'boolean' },
            authorId: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Comment: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            text: { type: 'string' },
            postId: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        CreateUser: {
          type: 'object',
          required: ['name','email'],
          properties: {
            name: { type: 'string' },
            email: { type: 'string', format: 'email' }
          }
        },
        UpdateUser: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            email: { type: 'string', format: 'email' }
          }
        },
        CreatePost: {
          type: 'object',
          required: ['authorId','title','content'],
          properties: {
            authorId: { type: 'integer' },
            title: { type: 'string' },
            content: { type: 'string' },
            published: { type: 'boolean' }
          }
        },
        UpdatePost: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            content: { type: 'string' },
            published: { type: 'boolean' }
          }
        },
        CreateComment: {
          type: 'object',
          required: ['text','postId'],
          properties: {
            text: { type: 'string' },
            postId: { type: 'integer' }
          }
        },
        UpdateComment: {
          type: 'object',
          properties: {
            text: { type: 'string' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    },
    paths: {
      '/ping': {
        get: {
          summary: 'Ping',
          responses: { '200': { description: 'pong (text)' } }
        }
      },
      '/users': {
        get: {
          summary: 'List users',
          responses: { '200': { description: 'OK', content: { 'application/json': { schema: { type:'array', items:{ $ref:'#/components/schemas/User' } } } } } }
        },
        post: {
          summary: 'Create user (returns JWT token)',
          requestBody: { required: true, content: { 'application/json': { schema: { $ref:'#/components/schemas/CreateUser' } } } },
          responses: { '201': { description: 'Created' }, '400': { description: 'Bad Request', content:{ 'application/json':{ schema:{ $ref:'#/components/schemas/Error' } } } } }
        }
      },
      '/users/{id}': {
        put: {
          summary: 'Update user',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: { required: true, content: { 'application/json': { schema: { $ref:'#/components/schemas/UpdateUser' } } } },
          responses: { '200': { description: 'OK' }, '500': { description: 'Error' } }
        },
        delete: {
          summary: 'Delete user and related posts/comments',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { '200': { description: 'OK' }, '404': { description: 'Not Found' } }
        }
      },
      '/posts': {
        get: {
          summary: 'List posts',
          parameters: [
            { name: 'authorId', in: 'query', required: false, schema: { type: 'integer' } },
            { name: 'page', in: 'query', required: false, schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', required: false, schema: { type: 'integer', default: 5 } }
          ],
          responses: { '200': { description: 'OK' } }
        },
        post: {
          summary: 'Create post',
          security: [{ bearerAuth: [] }],
          requestBody: { required: true, content: { 'application/json': { schema: { $ref:'#/components/schemas/CreatePost' } } } },
          responses: { '200': { description: 'OK' }, '400': { description: 'Invalid authorId' } }
        }
      },
      '/posts/{id}': {
        put: {
          summary: 'Update post',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: { required: true, content: { 'application/json': { schema: { $ref:'#/components/schemas/UpdatePost' } } } },
          responses: { '200': { description: 'OK' }, '500': { description: 'Error' } }
        },
        delete: {
          summary: 'Delete post and related comments',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { '200': { description: 'OK' }, '404': { description: 'Not Found' } }
        }
      },
      '/comments': {
        post: {
          summary: 'Create comment',
          security: [{ bearerAuth: [] }],
          requestBody: { required: true, content: { 'application/json': { schema: { $ref:'#/components/schemas/CreateComment' } } } },
          responses: { '200': { description: 'OK' }, '400': { description: 'Bad Request' } }
        }
      },
      '/comments/{id}': {
        put: {
          summary: 'Update comment',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: { required: true, content: { 'application/json': { schema: { $ref:'#/components/schemas/UpdateComment' } } } },
          responses: { '200': { description: 'OK' } }
        },
        delete: {
          summary: 'Delete comment',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { '200': { description: 'OK' }, '404': { description: 'Not Found' } }
        }
      }
    }
  },
  apis: []
});


