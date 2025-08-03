import { Module } from '@nestjs/common';
import { BlogService } from './blog/blog.service';
import { BlogController } from './blog/blog.controller';

@Module({
  providers: [BlogService],
  controllers: [BlogController]
})
export class BlogModule {}
