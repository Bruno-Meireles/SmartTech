import { Injectable, Inject } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  constructor(@Inject('STRIPE_CLIENT') private stripe: Stripe) {}

  async createPaymentIntent(amount: number, currency: string) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount,
        currency,
      });
      return paymentIntent;
    } catch (error) {
      console.error('Erro ao criar Payment Intent:', error);
      throw error;
    }
  }
}
