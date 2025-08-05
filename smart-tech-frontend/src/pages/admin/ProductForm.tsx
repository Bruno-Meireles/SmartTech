import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Product, Category } from '../../types';
import api from '../../lib/api';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Upload } from 'lucide-react';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Nome é obrigatório' }),
  description: z.string().optional(),
  price: z.preprocess(
    (val) => Number(val),
    z.number().min(0.01, { message: 'Preço deve ser maior que zero' })
  ),
  categoryId: z.string().min(1, { message: 'Categoria é obrigatória' }),
  imageUrl: z.string().optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;

export const ProductForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImageFile(event.target.files[0]);
      form.setValue("imageUrl", URL.createObjectURL(event.target.files[0]));
    }
  };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      categoryId: '',
      imageUrl: '',
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get<Category[]>('/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        toast.error('Erro ao carregar categorias.');
      }
    };

    const fetchProduct = async () => {
      if (id) {
        try {
          const response = await api.get<Product>(`/products/${id}`);
          const product = response.data;
          form.reset({
            name: product.name,
            description: product.description || '',
            price: product.price,
            categoryId: product.category?.id || '',
            imageUrl: product.imageUrl || '',
          });
        } catch (error) {
          console.error('Erro ao carregar produto:', error);
          toast.error('Erro ao carregar produto.');
        }
      }
    };

    Promise.all([fetchCategories(), fetchProduct()]).finally(() => setLoading(false));
  }, [id, form]);

  const onSubmit = async (values: ProductFormValues) => {
    try {
      const formData = new FormData();
      for (const key in values) {
        if (values[key as keyof ProductFormValues] !== undefined) {
          formData.append(key, values[key as keyof ProductFormValues] as string);
        }
      }

      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (id) {
        await api.patch(`/products/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Produto atualizado com sucesso!");
      } else {
        await api.post("/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Produto adicionado com sucesso!");
      }
      navigate("/admin/products");
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      toast.error("Erro ao salvar produto.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        {id ? 'Editar Produto' : 'Adicionar Novo Produto'}
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do produto" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea placeholder="Descrição do produto" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL da Imagem</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/image.jpg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormItem>
            <FormLabel>Upload de Imagem</FormLabel>
            <FormControl>
              <Input type="file" accept="image/*" onChange={handleImageChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
          <Button type="submit">{id ? 'Salvar Alterações' : 'Adicionar Produto'}</Button>
        </form>
      </Form>
    </div>
  );
};

