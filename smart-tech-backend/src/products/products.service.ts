import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const { variations, ...productData } = createProductDto;

    return this.prisma.product.create({
      data: {
        ...productData,
        variations: variations
          ? {
              create: variations.map((variation) => ({
                name: variation,
              })),
            }
          : undefined,
      },
      include: {
        category: true,
        variations: true,
      },
    });
  }

  async findAll(categoryId?: string) {
    return this.prisma.product.findMany({
      where: categoryId ? { categoryId } : undefined,
      include: {
        category: true,
        variations: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        variations: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { variations, ...productData } = updateProductDto;

    try {
      // Se há variações para atualizar, primeiro remove as existentes
      if (variations !== undefined) {
        await this.prisma.productVariation.deleteMany({
          where: { productId: id },
        });
      }

      return await this.prisma.product.update({
        where: { id },
        data: {
          ...productData,
          variations: variations
            ? {
                create: variations.map((variation) => ({
                  name: variation,
                })),
              }
            : undefined,
        },
        include: {
          category: true,
          variations: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Produto não encontrado');
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.product.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Produto não encontrado');
      }
      throw error;
    }
  }

  async search(query: string) {
    return this.prisma.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      include: {
        category: true,
        variations: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }
}
