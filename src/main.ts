import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { Client } from 'pg';

async function createDatabaseIfNotExists() {
  const dbName = process.env.DB_NAME || 'gastronimia';
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: 5432,
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: 'postgres', // Connect to default postgres database
  });

  try {
    await client.connect();
    
    // Check if database exists
    const checkResult = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    if (checkResult.rows.length === 0) {
      console.log(`Database ${dbName} does not exist, creating it...`);
      // Make sure to end current connections to postgres db before creating a new one
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`Database ${dbName} created successfully`);
    } else {
      console.log(`Database ${dbName} already exists`);
    }
  } catch (error) {
    console.error('Error while creating database:', error);
  } finally {
    await client.end();
  }
}

async function bootstrap() {
  // Create database if it doesn't exist
  await createDatabaseIfNotExists();

  const app = await NestFactory.create(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'api/v',
    defaultVersion: '1',
  });

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
