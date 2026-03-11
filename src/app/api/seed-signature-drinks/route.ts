import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

const SEED_SECRET = process.env.SEED_SECRET ?? '';
const S_COCKTAIL = 'كوكتيل';
const S_MOJITO = 'موخيتو';

const ITEMS = [
  // كوكتيل
  { name_ar: 'مانجا نعناع',         name_he: 'מנגו נענע',       name_en: 'Mango Mint',         price: 25, sort_order: 1,  section: S_COCKTAIL },
  { name_ar: 'كوكتيل اخضر',        name_he: 'קוקטייל ירוק',   name_en: 'Green Cocktail',     price: 25, sort_order: 2,  section: S_COCKTAIL },
  { name_ar: 'كوكتيل (اناناس وموز)', name_he: 'קוקטייל (אננס ובננה)', name_en: 'Pineapple Banana', price: 25, sort_order: 3,  section: S_COCKTAIL },
  { name_ar: 'كوكتيل مانجو وكيوي',  name_he: 'קוקטייל מנגו וקיווי', name_en: 'Mango Kiwi Cocktail', price: 25, sort_order: 4,  section: S_COCKTAIL },
  { name_ar: 'كوكتيل السعادة',     name_he: 'קוקטייל האושר',  name_en: 'Happiness Cocktail', price: 25, sort_order: 5,  section: S_COCKTAIL, tag: 'signature' },
  { name_ar: 'كوكتيل الدلال',      name_he: 'קוקטייל הפינוק',  name_en: 'Pampering Cocktail', price: 25, sort_order: 6,  section: S_COCKTAIL },
  { name_ar: 'كوكتيل سلطنة',       name_he: 'קוקטייל סולטאנה', name_en: 'Saltana Cocktail',   price: 25, sort_order: 7,  section: S_COCKTAIL, tag: 'signature' },
  { name_ar: 'كوكتيل يا لذيذ يا رايق', name_he: 'קוקטייל טעים ורגוע', name_en: 'Delicious & Calm', price: 25, sort_order: 8,  section: S_COCKTAIL },
  { name_ar: 'كوكتيل اتريكل',      name_he: 'קוקטייל אטריקל',  name_en: 'Atrakal Cocktail',   price: 25, sort_order: 9,  section: S_COCKTAIL },
  { name_ar: 'كوكتيل مكس باري',    name_he: 'קוקטייל מיקס ברי', name_en: 'Mixed Berry',        price: 25, sort_order: 10, section: S_COCKTAIL },
  { name_ar: 'كوكتيل توتي فروتي',  name_he: 'קוקטייל טוטי פרוטי', name_en: 'Tutti Frutti',     price: 25, sort_order: 11, section: S_COCKTAIL },
  // موخيتو — names match original menu (no prefix except سلطنة)
  { name_ar: 'اناناس',             name_he: 'אננס',            name_en: 'Pineapple Mojito',   price: 25, sort_order: 12, section: S_MOJITO },
  { name_ar: 'توت',                name_he: 'תות',             name_en: 'Berry Mojito',       price: 25, sort_order: 13, section: S_MOJITO },
  { name_ar: 'موخيتو',             name_he: 'מוחיטו',          name_en: 'Mojito',             price: 25, sort_order: 14, section: S_MOJITO },
  { name_ar: 'بلو كراساو',         name_he: 'בלו קוראסאו',     name_en: 'Blue Curacao',       price: 25, sort_order: 15, section: S_MOJITO },
  { name_ar: 'بلوبيري',            name_he: 'אוכמניות',        name_en: 'Blueberry Mojito',   price: 25, sort_order: 16, section: S_MOJITO },
  { name_ar: 'ليمون نعنع',         name_he: 'לימון נענע',      name_en: 'Lemon Mint Mojito', price: 25, sort_order: 17, section: S_MOJITO },
  { name_ar: 'موخيتو سلطنة',       name_he: 'מוחיטו סולטאנה',  name_en: 'Saltana Mojito',     price: 25, sort_order: 18, section: S_MOJITO, tag: 'signature' },
  { name_ar: 'مانجو',              name_he: 'מנגו',           name_en: 'Mango Mojito',       price: 25, sort_order: 19, section: S_MOJITO },
  { name_ar: 'بيروت ياعر',         name_he: 'ביירות יער',      name_en: 'Beirut Mojito',      price: 25, sort_order: 20, section: S_MOJITO },
];

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get('secret') !== SEED_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = getSupabaseAdmin();
  const { data: cats } = await db.from('menu_categories').select('id, name_ar');
  const catId = cats?.find((c) => c.name_ar === 'مشروبات مميزة')?.id;
  if (!catId) return NextResponse.json({ error: 'مشروبات مميزة not found' }, { status: 404 });

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
