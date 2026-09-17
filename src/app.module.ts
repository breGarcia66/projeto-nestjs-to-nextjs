import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { Post } from './post/entities/post.entity';
import { PostModule } from './post/post.module';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PostModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        if (process.env.DB_TYPE === 'better-sqlite3') {
          return {
            type: 'better-sqlite3',
            database: process.env.DB_DATABASE,
            synchronize: process.env.DB_SYNCHRONIZE === '1',
            autoLoadEntities: process.env.DB_AUTO_RELOAD_ENTITIES === '1'
          }
        }

        return {
          type: 'postgres',
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT || '5432', 10),
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE
        }
      }
    })
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
