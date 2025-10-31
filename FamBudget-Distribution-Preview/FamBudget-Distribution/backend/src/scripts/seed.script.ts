import { DataSource } from 'typeorm';
import { seedDatabase } from '../database/seed';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'fambudget',
  entities: [__dirname + '/../entities/**/*.entity{.ts,.js}'],
  synchronize: true,
});

async function run() {
  try {
    console.log('🔌 Connecting to database...');
    await dataSource.initialize();
    console.log('✅ Connected to database');

    await seedDatabase(dataSource);

    await dataSource.destroy();
    console.log('👋 Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

run();

