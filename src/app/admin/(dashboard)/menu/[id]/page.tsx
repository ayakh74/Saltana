import { notFound } from 'next/navigation';
import { getMenuItemById, updateMenuItem, uploadMenuImage, deleteMenuImage } from '@/lib/actions/menu-items';
import { getCategories } from '@/lib/actions/categories';
import MenuItemForm from '@/components/admin/MenuItemForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata = { title: 'Edit Menu Item' };

export default async function EditMenuItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [item, categories] = await Promise.all([
    getMenuItemById(id).catch(() => null),
    getCategories().catch(() => []),
  ]);
  if (!item) notFound();

  async function handleUpdate(formData: FormData) {
    'use server';
    let imageUrl: string | null = item.image_url;

    const imageFile = formData.get('image_file') as File | null;
    const existingUrl = formData.get('existing_image_url') as string | null;

    if (imageFile && imageFile.size > 0) {
      // Delete old image if exists
      if (item.image_url) await deleteMenuImage(item.image_url).catch(() => {});
      const uploadData = new FormData();
      uploadData.set('file', imageFile);
      imageUrl = await uploadMenuImage(uploadData);
    } else if (!existingUrl && item.image_url) {
      // Image was removed
      await deleteMenuImage(item.image_url).catch(() => {});
      imageUrl = null;
    }

    await updateMenuItem(id, {
      category_id: formData.get('category_id') as string,
      name_ar: formData.get('name_ar') as string,
      name_he: (formData.get('name_he') as string) || null,
      name_en: (formData.get('name_en') as string) || null,
      desc_ar: (formData.get('desc_ar') as string) || null,
      desc_he: (formData.get('desc_he') as string) || null,
      desc_en: (formData.get('desc_en') as string) || null,
      price: Number(formData.get('price')),
      image_url: imageUrl,
      tag: (formData.get('tag') as 'popular' | 'signature' | 'new') || null,
      is_available: formData.get('is_available') === 'true',
      sort_order: Number(formData.get('sort_order')) || 0,
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/menu" className="text-cream/40 hover:text-cream/70 transition-colors">
          <ArrowLeft size={16} strokeWidth={1.5} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-cream/90">Edit Menu Item</h1>
          <p className="text-cream/40 text-sm mt-0.5" dir="rtl">
            <span lang="ar">{item.name_ar}</span>
          </p>
        </div>
      </div>
      <div className="glass-card p-6">
        <MenuItemForm categories={categories} item={item} onSubmit={handleUpdate} />
      </div>
    </div>
  );
}
