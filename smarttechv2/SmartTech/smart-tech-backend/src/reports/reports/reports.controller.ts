import { Controller, Get } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('sales-by-month')
  getSalesByMonth() {
    return this.reportsService.getSalesByMonth();
  }

  @Get('product-sales')
  getProductSales() {
    return this.reportsService.getProductSales();
  }

  @Get('top-selling-products')
  getTopSellingProducts() {
    return this.reportsService.getTopSellingProducts();
  }

  @Get('stock-report')
  getStockReport() {
    return this.reportsService.getStockReport();
  }
}
