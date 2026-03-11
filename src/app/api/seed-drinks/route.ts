import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

const SEED_SECRET = process.env.SEED_SECRET ?? '';

const COLD_DRINKS = [
  { name_ar: 'كولا',         name_he: 'קולה',          name_en: 'Cola',          price: 10, sort_order: 1 },
  { name_ar: 'كولا زيرو',    name_he: 'קולה זירו',     name_en: 'Cola Zero',     price: 10, sort_order: 2 },
  { name_ar: 'سبرايت',       name_he: 'ספרייט',        name_en: 'Sprite',        price: 10, sort_order: 3 },
  { name_ar: 'سبرايت زيرو',  name_he: 'ספרייט זירו',   name_en: 'Sprite Zero',   price: 10, sort_order: 4 },
  { name_ar: 'XL',            name_he: 'XL',             name_en: 'XL Energy',     price: 10, sort_order: 5 },
  { name_ar: 'صودا',          name_he: 'סודה',           name_en: 'Soda',          price: 10, sort_order: 6 },
  { name_ar: 'مياه كبير',    name_he: 'מים גדול',      name_en: 'Large Water',   price: 15, sort_order: 7 },
];

const HOT_DRINKS = [
  { name_ar: 'شاي نعنع',      name_he: 'תה נענע',       name_en: 'Mint Tea',         price: 15, sort_order: 8 },
  { name_ar: 'حريمة',          name_he: 'חרימה',          name_en: 'Harima',           price: 15, sort_order: 9 },
  { name_ar: 'شاي سلطنة',     name_he: 'תה סולטאנה',    name_en: 'Saltana Tea',      price: 15, tag: 'signature', sort_order: 10 },
  { name_ar: 'نسكافية',        name_he: 'נסקפה',          name_en: 'Nescafe',          price: 18, sort_order: 11 },
  { name_ar: 'هقوع',           name_he: "הק'וע",          name_en: 'Haqwa',            price: 18, sort_order: 12 },
  { name_ar: 'هوت شوكليت',    name_he: 'שוקו חם',       name_en: 'Hot Chocolate',    price: 18, sort_order: 13 },
  { name_ar: 'كافيه توتيلا',  name_he: 'קפה טוטילה',    name_en: 'Café Toffila',     price: 18, sort_order: 14 },
  { name_ar: 'سحلب',           name_he: 'סחלב',           name_en: 'Sahlab',           price: 20, sort_order: 15 },
  { name_ar: 'أسبريسو',        name_he: 'אספרסו',         name_en: 'Espresso',         price: 10, sort_order: 16 },
  { name_ar: 'موكا مرير',     name_he: 'מוקה מר',       name_en: 'Bitter Mocha',     price: 20, sort_order: 17 },
  { name_ar: 'موكا وايت',     name_he: 'מוקה לבן',      name_en: 'White Mocha',      price: 20, sort_order: 18 },
  { name_ar: 'شوكو',           name_he: 'שוקו',           name_en: 'Choco',            price: 18, sort_order: 19 },
];

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get('secret') !== SEED_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = getSupabaseAdmin();
  const { data: cats } = await db.from('menu_categories').select('id, name_ar');
  const catId = cats?.find((c) => c.name_ar === 'مشروبات')?.id;
  if (!catId) return NextResponse.json({ error: 'مشروبات category not found' }, { status: 404 });

  const { count: deleted } = await db.from('menu_items').delete({ count: 'exact' }).eq('category_id', catId);

  const allItems = [...COLD_DRINKS, ...HOT_DRINKS].map((item) => ({
    ...item,
    category_id: catId,
    is_available: true,
    image_url: null,
    desc_ar: null,
    desc_he: null,
    desc_en: null,
    tag: (item as { tag?: string }).tag ?? null,
  }));

  const { data: inserted, error } = await db.from('menu_items').insert(allItems).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, deleted, inserted: inserted?.length });
}
