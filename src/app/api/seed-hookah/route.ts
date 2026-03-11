import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

const SEED_SECRET = process.env.SEED_SECRET ?? '';

const ITEMS = [
  { name_ar: 'خلطه شامية',     name_he: 'חלטה שמית',    name_en: 'Syrian Mix',        price: 50, sort_order: 1 },
  { name_ar: 'بلوبيري',        name_he: 'אוכמניות',     name_en: 'Blueberry',         price: 50, sort_order: 2 },
  { name_ar: 'ليمون نعنع',     name_he: 'לימון נענע',   name_en: 'Lemon Mint',        price: 50, sort_order: 3 },
  { name_ar: 'تفاحتين نخلة',   name_he: 'תפוחים נחלה',  name_en: 'Double Apple Nakhla', price: 55, sort_order: 4 },
  { name_ar: 'LOVE',            name_he: 'LOVE',         name_en: 'Love',              price: 50, sort_order: 5 },
  { name_ar: 'تفاحتين',        name_he: 'תפוחים',       name_en: 'Double Apple',      price: 50, sort_order: 6 },
];

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get('secret') !== SEED_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = getSupabaseAdmin();
  const { data: cats } = await db.from('menu_categories').select('id, name_ar');
  const catId = cats?.find((c) => c.name_ar === 'أراجيل')?.id;
  if (!catId) return NextResponse.json({ error: 'أراجيل not found' }, { status: 404 });

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
    tag: null,
  }));

  const { data: inserted, error } = await db.from('menu_items').insert(toInsert).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, inserted: inserted?.length });
}
