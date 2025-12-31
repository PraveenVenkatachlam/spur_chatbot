import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Conversation, Message, FaqKnowledge } from './entities';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST', 'localhost'),
        port: config.get('DB_PORT', 5432),
        username: config.get('DB_USERNAME', 'postgres'),
        password: config.get('DB_PASSWORD', 'postgres'),
        database: config.get('DB_NAME', 'spur_chat'),
        entities: [Conversation, Message, FaqKnowledge],
        synchronize: true,
        logging: false,
      }),
    }),
    TypeOrmModule.forFeature([Conversation, Message, FaqKnowledge]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}