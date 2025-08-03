import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews/reviews.service';
import { ReviewsController } from './reviews/reviews.controller';

@Module({
  providers: [ReviewsService],
  controllers: [ReviewsController]
})
export class ReviewsModule {}
