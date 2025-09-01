import { Injectable } from '@nestjs/common';
import { Stripe } from 'stripe';
import { ConfigService } from '@nestjs/config';
import { CreateChargeDto } from '@app/common';

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is not defined');
    }
    this.stripe = new Stripe(secretKey, {});
  }

  async createCharge({ amount }: CreateChargeDto) {
    return this.stripe.paymentIntents.create({
      amount: amount * 100,
      confirm: true,
      currency: 'usd',
      payment_method: 'pm_card_visa',
      return_url: 'http://localhost:3001', // TODO: update this
    });
  }

  // async refundCharge(paymentIntentId: string) {
  //   return this.stripe.refunds.create({
  //     payment_intent: paymentIntentId,
  //   });
  // }
}
