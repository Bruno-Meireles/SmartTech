import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, NotificationsGateway],
})
export class ProductsModule {}
