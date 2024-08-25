import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeOrmConfig from '../config/typeOrm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { UserModule } from './Users/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './Auth/auth.module';
import { ProductModule } from './Product/product.module';
import { FlavourModule } from './Flavour/flavour.module';
import { CategoryModule } from './category/category.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { SeedModule } from './Seed/seed.module';
import { ToppingModule } from './topping/topping.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeOrmConfig],
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '72h' },
      secret: process.env.JWT_SECRET,
    }),
    UserModule,
    AuthModule,
    ProductModule,
    FlavourModule,
    CategoryModule,
    SeedModule,
    CloudinaryModule,
    ToppingModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
