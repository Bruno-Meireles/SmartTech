import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReviewDto } from '../dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(createReviewDto: CreateReviewDto) {
    const review = await this.prisma.review.create({
      data: createReviewDto,
    });

    await this.updateProductAverageRating(review.productId);

    return review;
  }

  async findAllByProductId(productId: string) {
    return this.prisma.review.findMany({
      where: { productId },
      include: { user: { select: { name: true } } },
    });
  }

  private async updateProductAverageRating(productId: string) {
    const result = await this.prisma.review.aggregate({
      _avg: {
        rating: true,
      },
      where: {
        productId,
      },
    });

    const averageRating = result._avg.rating || 0;

    await this.prisma.product.update({
      where: { id: productId },
      data: { averageRating },
    });
  }
}
