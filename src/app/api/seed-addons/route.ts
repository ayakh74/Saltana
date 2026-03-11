import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

const SEED_SECRET = process.env.SEED_SECRET ?? '';

const REAL_ADDONS = [
  { name_ar: 'حمص لحمة',       name_he: 'חומוס עם בשר',     name_en: 'Hummus with Meat',    desc_ar: 'حمص طازج مع لحمة مفرومة وصنوبر', price: 45, tag: 'popular', sort_order: 1 },
  { name_ar: 'لحمة بندورة',    name_he: 'בשר עגבניות',      name_en: 'Meat with Tomato',    price: 45, sort_order: 2 },
  { name_ar: 'توست',            name_he: 'טוסט',              name_en: 'Toast',               price: 38, sort_order: 3 },
  { name_ar: 'بلاطة فوكاتشة',  name_he: "צלחת פוקצ'ה",      name_en: 'Focaccia Platter',    desc_ar: '٤ أطعمة', price: 45, sort_order: 4 },
];

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get('secret') !== SEED_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = getSupabaseAdmin();

  const { data: cats } = await db.from('menu_categories').select('id, name_ar');
  const catId = cats?.find((c) => c.name_ar === 'إضافات')?.id;
  if (!catId) return NextResponse.json({ error: 'إضافات category not found' }, { status: 404 });

  // Remove old placeholder add-ons
  const { count: deleted } = await db.from('menu_items').delete({ count: 'exact' }).eq('category_id', catId);

  // Insert real ones
  const toInsert = REAL_ADDONS.map((item) => ({
    ...item,
    category_id: catId,
    is_available: true,
    image_url: null,
    desc_he: null,
    desc_en: null,
    tag: item.tag ?? null,
  }));

  const { data: inserted, error } = await db.from('menu_items').insert(toInsert).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, deleted, inserted: inserted?.length });
}
