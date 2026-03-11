import Link from 'next/link';
import Image from 'next/image';
import { getMenuItems } from '@/lib/actions/menu-items';
import { getCategories } from '@/lib/actions/categories';
import { deleteMenuItem } from '@/lib/actions/menu-items';
import { Plus, Pencil, Trash2, ImageOff } from 'lucide-react';

export const metadata = { title: 'Menu Items' };

export default async function MenuItemsPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const { cat: catFilter } = await searchParams;
  const [items, categories] = await Promise.all([
    getMenuItems(catFilter).catch(() => []),
    getCategories().catch(() => []),
  ]);

  const tagColors: Record<string, string> = {
    popular: 'bg-orange-400/10 text-orange-400 border-orange-400/20',
    signature: 'bg-gold/10 text-gold-DEFAULT border-gold/20',
    new: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-cream/90">Menu Items</h1>
          <p className="text-cream/40 text-sm mt-1">{items.length} items</p>
        </div>
        <Link href="/admin/menu/new" className="btn-gold px-5 py-2.5 text-sm font-bold tracking-widest rounded-sm uppercase flex items-center gap-2">
          <Plus size={14} />
          Add Item
        </Link>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        <Link
          href="/admin/menu"
          className={`px-3 py-1.5 text-xs font-medium rounded-sm border transition-all ${!catFilter ? 'bg-gold/10 text-gold-DEFAULT border-gold/30' : 'border-gold/10 text-cream/40 hover:border-gold/25 hover:text-cream/60'}`}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/admin/menu?cat=${c.id}`}
            className={`px-3 py-1.5 text-xs font-medium rounded-sm border transition-all ${catFilter === c.id ? 'bg-gold/10 text-gold-DEFAULT border-gold/30' : 'border-gold/10 text-cream/40 hover:border-gold/25 hover:text-cream/60'}`}
            dir="rtl"
          >
            {c.name_ar}
          </Link>
        ))}
      </div>

      {/* Items Grid */}
      {items.length === 0 ? (
        <div className="glass-card text-center py-20">
          <p className="text-cream/30 text-sm">No items found.</p>
          <Link href="/admin/menu/new" className="text-gold-DEFAULT text-sm hover:underline mt-2 inline-block">
            Add your first item
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="glass-card overflow-hidden group">
              {/* Image */}
              <div className="relative aspect-video bg-obsidian-200 border-b border-gold/8">
                {item.image_url ? (
                  <Image
                    src={item.image_url}
                    alt={item.name_ar}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ImageOff size={20} className="text-cream/10" strokeWidth={1} />
                  </div>
                )}
                {/* Actions overlay */}
                <div className="absolute inset-0 bg-obsidian/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                  <Link href={`/admin/menu/${item.id}`} className="p-2 bg-obsidian-50 border border-gold/30 text-gold-DEFAULT hover:bg-gold/10 rounded-sm transition-all">
                    <Pencil size={14} strokeWidth={1.5} />
                  </Link>
                  <form action={async () => { 'use server'; await deleteMenuItem(item.id); }}>
                    <button type="submit" className="p-2 bg-obsidian-50 border border-red-400/30 text-red-400 hover:bg-red-400/10 rounded-sm transition-all">
                      <Trash2 size={14} strokeWidth={1.5} />
                    </button>
                  </form>
                </div>
                {/* Tag */}
                {item.tag && (
                  <span className={`absolute top-2 right-2 text-[9px] font-bold tracking-widest uppercase border px-1.5 py-0.5 ${tagColors[item.tag]}`}>
                    {item.tag}
                  </span>
                )}
                {!item.is_available && (
                  <span className="absolute top-2 left-2 text-[9px] font-bold tracking-widest uppercase border px-1.5 py-0.5 bg-red-400/10 text-red-400 border-red-400/20">
                    Hidden
                  </span>
                )}
              </div>
              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="text-gold-DEFAULT font-bold">{item.price}₪</span>
                  <h3 className="text-cream/90 text-sm font-semibold text-right" dir="rtl">{item.name_ar}</h3>
                </div>
                {item.desc_ar && (
                  <p className="text-cream/35 text-xs text-right line-clamp-2" dir="rtl">{item.desc_ar}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
