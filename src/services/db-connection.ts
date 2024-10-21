import mongoose from 'mongoose';
import logger from './logger'; // Импортируйте логгер
import { ConfigService } from '../config/config.service';

export class DatabaseConnection {
    private static instance: DatabaseConnection;
    private constructor(private readonly configService: ConfigService) {}

    static getInstance(configService: ConfigService): DatabaseConnection {
        if (!DatabaseConnection.instance) {
            DatabaseConnection.instance = new DatabaseConnection(configService);
        }
        return DatabaseConnection.instance;
    }

    async connect() {
        if (mongoose.connection.readyState === 1) { // if already connected 
            logger.info('Already connected to the database'); // Используйте логгер
            return;
        }

        const uri = this.configService.get('MONGO_URI');
        const connection = await mongoose.connect(uri);

        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', () => {
            logger.info('Connected to the database');
        });

        logger.info('Connecting to the database...');
        return connection;
    }

    async disconnect() {
        try {
            await mongoose.disconnect();
            logger.info('Disconnected from the database'); // Используйте логгер
        } catch (error) {
            logger.error('Error disconnecting from the database', error); // Используйте логгер
        }
    }
}

