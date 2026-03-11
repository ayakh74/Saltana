import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

const SEED_SECRET = process.env.SEED_SECRET ?? '';

const ITEMS = [
  // ميلك شيك
  { name_ar: 'اوريو',             name_he: 'אוריאו',         name_en: 'Oreo Shake',        price: 30, sort_order: 1,  section: 'ميلك شيك' },
  { name_ar: 'نوتيلا',            name_he: 'נוטלה',          name_en: 'Nutella Shake',     price: 30, sort_order: 2,  section: 'ميلك شيك' },
  { name_ar: 'فستق حلبي',        name_he: 'פיסטוק',         name_en: 'Pistachio Shake',   price: 30, sort_order: 3,  section: 'ميلك شيك' },
  { name_ar: 'توت',               name_he: 'תות',            name_en: 'Berry Shake',       price: 30, sort_order: 4,  section: 'ميلك شيك' },
  { name_ar: 'فانيل',             name_he: 'וניל',           name_en: 'Vanilla Shake',     price: 30, sort_order: 5,  section: 'ميلك شيك' },
  { name_ar: 'لوتس',              name_he: 'לוטוס',          name_en: 'Lotus Shake',       price: 30, sort_order: 6,  section: 'ميلك شيك', tag: 'popular' },
  { name_ar: 'ريبات حلاق',       name_he: "ריבת ח'לאק",    name_en: 'Hairdresser Jam',   price: 30, sort_order: 7,  section: 'ميلك شيك' },
  { name_ar: 'بيروت ياعين',      name_he: 'ביירות יאעין',   name_en: 'Beirut Shake',      price: 30, sort_order: 8,  section: 'ميلك شيك' },
  { name_ar: 'ميلك شيك سلطنة',  name_he: 'מילק שייק סולטאנה', name_en: 'Saltana Shake', price: 35, sort_order: 9,  section: 'ميلك شيك', tag: 'signature' },
  // عصائر طبيعية
  { name_ar: 'جزر',               name_he: 'גזר',            name_en: 'Carrot Juice',      price: 18, sort_order: 10, section: 'عصائر طبيعية' },
  { name_ar: 'برتقال',            name_he: 'תפוז',           name_en: 'Orange Juice',      price: 18, sort_order: 11, section: 'عصائر طبيعية' },
  { name_ar: 'برتقال جزر',       name_he: 'תפוז גזר',       name_en: 'Orange Carrot',     price: 18, sort_order: 12, section: 'عصائر طبيعية' },
  { name_ar: 'تفاح',              name_he: 'תפוח',           name_en: 'Apple Juice',       price: 18, sort_order: 13, section: 'عصائر طبيعية' },
  { name_ar: 'ليمونادة',          name_he: 'לימונדה',        name_en: 'Lemonade',          price: 18, sort_order: 14, section: 'عصائر طبيعية' },
  { name_ar: 'أناناس',            name_he: 'אננס',           name_en: 'Pineapple Juice',   price: 20, sort_order: 15, section: 'عصائر طبيعية' },
  { name_ar: 'جروس',              name_he: 'גראפ',           name_en: 'Grapefruit Juice',  price: 20, sort_order: 16, section: 'عصائر طبيعية' },
];

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get('secret') !== SEED_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = getSupabaseAdmin();
  const { data: cats } = await db.from('menu_categories').select('id, name_ar');
  const catId = cats?.find((c) => c.name_ar === 'عصائر وشيك')?.id;
  if (!catId) return NextResponse.json({ error: 'عصائر وشيك not found' }, { status: 404 });

  await db.from('menu_items').delete().eq('category_id', catId);

  const toInsert = ITEMS.map((item) => ({
    ...item,
    category_id: catId,
    is_available: true,
    image_url: null,
    desc_ar: null,
    desc_he: null,
    desc_en: null,
    tag: (item as { tag?: string }).tag ?? null,
  }));

  const { data: inserted, error } = await db.from('menu_items').insert(toInsert).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, inserted: inserted?.length });
}
