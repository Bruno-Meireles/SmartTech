import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';

interface ProductData {
  name: string;
  price: number;
  description: string;
  category: string;
  variations: string[];
}

@Injectable()
export class SeedService {
  constructor(private prisma: PrismaService) {}

  async seedDatabase() {
    console.log('🌱 Iniciando seed do banco de dados...');

    // Criar usuário admin
    await this.createAdminUser();

    // Importar dados do products.json
    await this.importProductsData();

    console.log('✅ Seed concluído com sucesso!');
  }

  private async createAdminUser() {
    const adminEmail = 'bruno.meirelessilva90@gmail.com';
    
    // Verificar se o admin já existe
    const existingAdmin = await this.prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existingAdmin) {
      console.log('👤 Usuário admin já existe');
      return;
    }

    // Criar usuário admin
    const hashedPassword = await bcrypt.hash('SenhaSegura123!', 10);
    
    await this.prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Bruno Meireles',
        role: Role.ADMIN,
      },
    });

    console.log('👤 Usuário admin criado com sucesso');
  }

  private async importProductsData() {
    const fs = require('fs');
    const path = require('path');

    // Ler arquivo products.json
    const productsPath = path.join(process.cwd(), '../../smart-tech-ecommerce/smart-tech-backend/src/products.json');
    
    if (!fs.existsSync(productsPath)) {
      console.log('⚠️  Arquivo products.json não encontrado');
      return;
    }

    const productsData: ProductData[] = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
    console.log(`📦 Importando ${productsData.length} produtos...`);

    // Criar categorias únicas
    const uniqueCategories = [...new Set(productsData.map(p => p.category))];
    
    for (const categoryName of uniqueCategories) {
      await this.prisma.category.upsert({
        where: { name: categoryName },
        update: {},
        create: {
          name: categoryName,
          description: `Categoria ${categoryName}`,
        },
      });
    }

    console.log(`📂 ${uniqueCategories.length} categorias criadas/atualizadas`);

    // Criar produtos
    for (const productData of productsData) {
      // Buscar categoria
      const category = await this.prisma.category.findUnique({
        where: { name: productData.category },
      });

      if (!category) {
        console.log(`⚠️  Categoria não encontrada: ${productData.category}`);
        continue;
      }

      // Verificar se produto já existe
      const existingProduct = await this.prisma.product.findFirst({
        where: {
          name: productData.name,
          categoryId: category.id,
        },
      });

      if (existingProduct) {
        console.log(`⚠️  Produto já existe: ${productData.name}`);
        continue;
      }

      // Criar produto
      await this.prisma.product.create({
        data: {
          name: productData.name,
          description: productData.description,
          price: productData.price,
          categoryId: category.id,
          variations: productData.variations && productData.variations.length > 0 ? {
            create: productData.variations.map(variation => ({
              name: variation,
            })),
          } : undefined,
        },
      });
    }

    console.log(`✅ Produtos importados com sucesso!`);
  }
}

