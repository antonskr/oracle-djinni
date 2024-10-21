import mongoose from 'mongoose';
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
            console.log('Already connected to the database');
            return;
        }

        const uri = this.configService.get('MONGO_URI');
        const connection = await mongoose.connect(uri);

        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', () => {
            console.log('Connected to the database');
        });

        console.log('Connected to the database');
        return connection;
    }

    async disconnect() {
        try {
            await mongoose.disconnect();
            console.log('Disconnected from the database');
        } catch (error) {
            console.error('Error disconnecting from the database', error);
        }
    }
}

