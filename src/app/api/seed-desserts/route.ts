import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

const SEED_SECRET = process.env.SEED_SECRET ?? '';

const ITEMS = [
  { name_ar: 'بافيل',            name_he: 'וופל',           name_en: 'Waffle',                 price: 40, sort_order: 1 },
  { name_ar: 'فتوتشيني كرب',     name_he: 'פטוצ\'יני קרפ',  name_en: 'Fettuccine Crepe',       price: 35, sort_order: 2 },
  { name_ar: 'كرب',              name_he: 'קרפ',            name_en: 'Crepe',                  price: 35, sort_order: 3 },
  { name_ar: 'فادج',             name_he: 'פאדג\'',         name_en: 'Fudge',                  price: 45, sort_order: 4 },
  { name_ar: 'سوفلية',           name_he: 'סופלה',          name_en: 'Soufflé',                price: 45, sort_order: 5 },
  { name_ar: 'فشافيش',           name_he: 'פשפש',           name_en: 'Fshafish',               price: 45, sort_order: 6 },
  { name_ar: 'ريد فلفيت',        name_he: 'רד ולבט',        name_en: 'Red Velvet',             price: 45, sort_order: 7 },
  { name_ar: 'تيراميسو',        name_he: 'טירמיסו',        name_en: 'Tiramisu',               price: 45, sort_order: 8 },
  { name_ar: 'الفاخورس',         name_he: 'אלפחורס',        name_en: 'Alfajores',              price: 45, sort_order: 9 },
  { name_ar: 'بلاطة الدلال',     name_he: 'צלחת הפינוק',    name_en: 'Pampering Platter',      price: 125, sort_order: 10, tag: 'signature' },
  { name_ar: 'سان سبستيان',      name_he: 'סן סבסטיאן',     name_en: 'San Sebastian Cheesecake', price: 45, sort_order: 11 },
  { name_ar: 'ليالي بيروت',      name_he: 'לילות ביירות',   name_en: 'Beirut Nights',          price: 40, sort_order: 12 },
  { name_ar: 'براونيز',          name_he: 'בראוניז',        name_en: 'Brownies',               price: 45, sort_order: 13 },
  { name_ar: 'كعكة سلطنة',      name_he: 'עוגת סולטאנה',   name_en: 'Saltana Cake',           price: 45, sort_order: 14, tag: 'signature' },
];

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get('secret') !== SEED_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = getSupabaseAdmin();
  const { data: cats } = await db.from('menu_categories').select('id, name_ar');
  const catId = cats?.find((c) => c.name_ar === 'حلويات')?.id;
  if (!catId) return NextResponse.json({ error: 'حلويات not found' }, { status: 404 });

  await db.from('menu_items').delete().eq('category_id', catId);

  const toInsert = ITEMS.map((item) => ({
    ...item,
    category_id: catId,
    is_available: true,
    image_url: null,
    desc_ar: null,
    desc_he: null,
    desc_en: null,
    section: null,
    tag: (item as { tag?: string }).tag ?? null,
  }));

  const { data: inserted, error } = await db.from('menu_items').insert(toInsert).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, inserted: inserted?.length });
}
