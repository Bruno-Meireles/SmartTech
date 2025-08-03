interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export class SitemapGenerator {
  private urls: SitemapUrl[] = [];
  private baseUrl: string;

  constructor(baseUrl: string = 'https://smarttech.com.br') {
    this.baseUrl = baseUrl;
  }

  addUrl(url: SitemapUrl) {
    this.urls.push(url);
  }

  addStaticPages() {
    const staticPages = [
      { loc: '/', changefreq: 'daily' as const, priority: 1.0 },
      { loc: '/produtos', changefreq: 'daily' as const, priority: 0.9 },
      { loc: '/categorias', changefreq: 'weekly' as const, priority: 0.8 },
      { loc: '/sobre', changefreq: 'monthly' as const, priority: 0.6 },
      { loc: '/contato', changefreq: 'monthly' as const, priority: 0.6 },
      { loc: '/politica-privacidade', changefreq: 'yearly' as const, priority: 0.3 },
      { loc: '/termos-uso', changefreq: 'yearly' as const, priority: 0.3 },
    ];

    staticPages.forEach(page => {
      this.addUrl({
        loc: `${this.baseUrl}${page.loc}`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: page.changefreq,
        priority: page.priority
      });
    });
  }

  addProducts(products: Array<{ id: string; updatedAt?: string }>) {
    products.forEach(product => {
      this.addUrl({
        loc: `${this.baseUrl}/produto/${product.id}`,
        lastmod: product.updatedAt || new Date().toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: 0.8
      });
    });
  }

  addCategories(categories: Array<{ slug: string; updatedAt?: string }>) {
    categories.forEach(category => {
      this.addUrl({
        loc: `${this.baseUrl}/categoria/${category.slug}`,
        lastmod: category.updatedAt || new Date().toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: 0.7
      });
    });
  }

  generateXML(): string {
    const urlElements = this.urls.map(url => {
      let urlElement = `  <url>\n    <loc>${url.loc}</loc>\n`;
      
      if (url.lastmod) {
        urlElement += `    <lastmod>${url.lastmod}</lastmod>\n`;
      }
      
      if (url.changefreq) {
        urlElement += `    <changefreq>${url.changefreq}</changefreq>\n`;
      }
      
      if (url.priority !== undefined) {
        urlElement += `    <priority>${url.priority.toFixed(1)}</priority>\n`;
      }
      
      urlElement += `  </url>`;
      return urlElement;
    }).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
  }

  async generateAndSave(outputPath: string) {
    const xml = this.generateXML();
    
    // In a real application, you would save this to a file
    // For now, we'll return the XML content
    return xml;
  }
}

// Utility function to generate sitemap for the current site
export async function generateSitemap(products: any[] = [], categories: any[] = []) {
  const generator = new SitemapGenerator();
  
  // Add static pages
  generator.addStaticPages();
  
  // Add products
  if (products.length > 0) {
    generator.addProducts(products);
  }
  
  // Add categories
  if (categories.length > 0) {
    generator.addCategories(categories);
  }
  
  return generator.generateXML();
}

