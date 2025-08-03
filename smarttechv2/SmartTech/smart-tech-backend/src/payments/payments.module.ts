import { Module } from '@nestjs/common';
import { PaymentsService } from './payments/payments.service';
import { PaymentsController } from './payments/payments.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Module({
  imports: [ConfigModule],
  providers: [
    PaymentsService,
    {
      provide: 'STRIPE_CLIENT',
      useFactory: (configService: ConfigService) => {
       return new Stripe(configService.get<string>("STRIPE_SECRET_KEY") || 
          '', {
          apiVersion: '2025-07-30.basil',
        });
      },
      inject: [ConfigService],
    },
  ],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
