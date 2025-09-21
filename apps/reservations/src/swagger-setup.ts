import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import axios from 'axios';

export async function setupSwagger(app: INestApplication) {
  const reservationsConfig = new DocumentBuilder()
    .setTitle('Reservations Service')
    .setDescription('Hotel reservations API')
    .setVersion('1.0')
    .addServer('http://localhost:3000', 'Reservations Service')
    .addTag('reservations')
    .build();

  const reservationsDocument = SwaggerModule.createDocument(
    app,
    reservationsConfig,
  );
  SwaggerModule.setup('api/docs', app, reservationsDocument);

  const aggregatedConfig = new DocumentBuilder()
    .setTitle('Microservices API Documentation')
    .setDescription('Complete API documentation for all services')
    .setVersion('1.0')
    .addServer('http://localhost:3000', 'Reservations Service')
    .addServer('http://localhost:3001', 'Auth Service')
    .build();

  const aggregatedDocument = SwaggerModule.createDocument(
    app,
    aggregatedConfig,
  );

  const services = [
    {
      name: 'auth',
      url: 'http://auth:3001/api-docs-json',
      serverUrl: 'http://localhost:3001',
      description: 'Auth Service',
    },
  ];

  for (const service of services) {
    try {
      const { data } = await axios.get(service.url);

      if (data.paths) {
        for (const [path, methods] of Object.entries(data.paths)) {
          const updatedMethods = { ...methods };
          for (const [method, operation] of Object.entries(updatedMethods)) {
            if (typeof operation === 'object' && operation !== null) {
              (operation as any).servers = [
                {
                  url: service.serverUrl,
                  description: service.description,
                },
              ];
            }
          }
          aggregatedDocument.paths[path] = updatedMethods;
        }
      }

      if (aggregatedDocument?.components && data.components?.schemas) {
        aggregatedDocument.components.schemas = {
          ...aggregatedDocument.components.schemas,
          ...data.components.schemas,
        };
      }
    } catch (err) {
      console.error(
        `❌ Failed to load Swagger from ${service.name}`,
        err.message,
      );
    }
  }

  SwaggerModule.setup('api/docs/all', app, aggregatedDocument, {
    swaggerOptions: {
      persistAuthorization: true,
      servers: [
        { url: 'http://localhost:3000', description: 'Reservations Service' },
        { url: 'http://localhost:3001', description: 'Auth Service' },
      ],
    },
  });
}
