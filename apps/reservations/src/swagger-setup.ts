import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import axios from 'axios';
import {
  ReferenceObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

interface SwaggerPath {
  [method: string]: SwaggerOperation;
}

interface SwaggerOperation {
  servers?: Array<{
    url: string;
    description: string;
  }>;
  [key: string]: unknown;
}

interface SwaggerDocument {
  paths?: {
    [path: string]: SwaggerPath;
  };
  components?: {
    schemas?: {
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

interface ServiceConfig {
  name: string;
  url: string;
  serverUrl: string;
  description: string;
}

function isSwaggerOperation(value: unknown): value is SwaggerOperation {
  return typeof value === 'object' && value !== null;
}

function hasValidSwaggerStructure(data: unknown): data is SwaggerDocument {
  return typeof data === 'object' && data !== null;
}

export async function setupSwagger(app: INestApplication): Promise<void> {
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

  const aggregatedDocument: OpenAPIObject = SwaggerModule.createDocument(
    app,
    aggregatedConfig,
  );

  const services: ServiceConfig[] = [
    {
      name: 'auth',
      url: 'http://auth:3001/api-docs-json',
      serverUrl: 'http://localhost:3001',
      description: 'Auth Service',
    },
  ];

  for (const service of services) {
    try {
      const response = await axios.get<unknown>(service.url);
      const data = response.data;

      if (!hasValidSwaggerStructure(data)) {
        console.warn(`Invalid Swagger document structure from ${service.name}`);
        continue;
      }

      if (data.paths) {
        for (const [path, methods] of Object.entries(data.paths)) {
          if (!methods || typeof methods !== 'object') {
            continue;
          }

          const updatedMethods: SwaggerPath = {};

          for (const [method, operation] of Object.entries(methods)) {
            if (isSwaggerOperation(operation)) {
              updatedMethods[method] = {
                ...operation,
                servers: [
                  {
                    url: service.serverUrl,
                    description: service.description,
                  },
                ],
              };
            }
          }

          aggregatedDocument.paths[path] = updatedMethods;
        }
      }

      if (
        aggregatedDocument.components?.schemas &&
        data.components?.schemas &&
        typeof data.components.schemas === 'object'
      ) {
        aggregatedDocument.components.schemas = {
          ...aggregatedDocument.components.schemas,
          ...(data.components.schemas as Record<
            string,
            SchemaObject | ReferenceObject
          >),
        };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error(
        `❌ Failed to load Swagger from ${service.name}`,
        errorMessage,
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
