import { Controller, Post, Body, Get, Param, UseGuards, Request } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from '../dto/create-review.dto';
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";

@Controller("reviews")
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createReviewDto: CreateReviewDto, @Request() req) {
    createReviewDto.userId = req.user.sub; // Assuming user ID is in req.user.sub
    return this.reviewsService.create(createReviewDto);
  }

  @Get("product/:productId")
  async findAllByProductId(@Param("productId") productId: string) {
    return this.reviewsService.findAllByProductId(productId);
  }
}
