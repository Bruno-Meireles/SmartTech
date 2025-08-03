import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getSalesByMonth() {
    const sales = await this.prisma.order.groupBy({
      by: ['createdAt'],
      _sum: {
        total: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Agrupar por mês e ano
    const salesByMonth = sales.reduce((acc, order) => {
      const date = new Date(order.createdAt);
      const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      acc[monthYear] = (acc[monthYear] || 0) + (order._sum.total || 0);
      return acc;
    }, {});

    return Object.keys(salesByMonth).map(monthYear => ({
      month: monthYear,
      totalSales: salesByMonth[monthYear],
    }));
  }

  async getProductSales() {
    return this.prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
        price: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
    });
  }

  async getTopSellingProducts(limit: number = 10) {
    const topProducts = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: limit,
    });

    const productIds = topProducts.map(p => p.productId);
    const products = await this.prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
      select: {
        id: true,
        name: true,
      },
    });

    return topProducts.map(tp => ({
      productName: products.find(p => p.id === tp.productId)?.name || 'Unknown Product',
      totalQuantitySold: tp._sum.quantity,
    }));
  }

  async getStockReport() {
    return this.prisma.product.findMany({
      select: {
        id: true,
        name: true,
        inStock: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }
}
