import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

const SEED_SECRET = process.env.SEED_SECRET ?? '';

const COLD = [
  { name_ar: 'كولا',        name_he: 'קולה',        name_en: 'Cola',        price: 10, sort_order: 1 },
  { name_ar: 'كولا زيرو',   name_he: 'קולה זירו',   name_en: 'Cola Zero',   price: 10, sort_order: 2 },
  { name_ar: 'سبرايت',      name_he: 'ספרייט',      name_en: 'Sprite',      price: 10, sort_order: 3 },
  { name_ar: 'سبرايت زيرو', name_he: 'ספרייט זירו', name_en: 'Sprite Zero', price: 10, sort_order: 4 },
  { name_ar: 'XL',           name_he: 'XL',           name_en: 'XL Energy',  price: 10, sort_order: 5 },
  { name_ar: 'صودا',         name_he: 'סודה',         name_en: 'Soda',       price: 10, sort_order: 6 },
  { name_ar: 'مياه كبير',   name_he: 'מים גדול',    name_en: 'Large Water', price: 15, sort_order: 7 },
];

const HOT = [
  { name_ar: 'شاي نعنع',     name_he: 'תה נענע',     name_en: 'Mint Tea',      price: 15, sort_order: 1 },
  { name_ar: 'حريمة',         name_he: 'חרימה',        name_en: 'Harima',        price: 15, sort_order: 2 },
  { name_ar: 'شاي سلطنة',    name_he: 'תה סולטאנה',  name_en: 'Saltana Tea',   price: 15, tag: 'signature', sort_order: 3 },
  { name_ar: 'نسكافية',       name_he: 'נסקפה',        name_en: 'Nescafe',       price: 18, sort_order: 4 },
  { name_ar: 'هقوع',          name_he: "הק'וע",        name_en: 'Haqwa',         price: 18, sort_order: 5 },
  { name_ar: 'هوت شوكليت',   name_he: 'שוקו חם',     name_en: 'Hot Chocolate', price: 18, sort_order: 6 },
  { name_ar: 'كافيه توتيلا', name_he: 'קפה טוטילה',  name_en: 'Café Toffila',  price: 18, sort_order: 7 },
  { name_ar: 'سحلب',          name_he: 'סחלב',         name_en: 'Sahlab',        price: 20, sort_order: 8 },
  { name_ar: 'أسبريسو',       name_he: 'אספרסו',       name_en: 'Espresso',      price: 10, sort_order: 9 },
  { name_ar: 'موكا مرير',    name_he: 'מוקה מר',     name_en: 'Bitter Mocha',  price: 20, sort_order: 10 },
  { name_ar: 'موكا وايت',    name_he: 'מוקה לבן',    name_en: 'White Mocha',   price: 20, sort_order: 11 },
  { name_ar: 'شوكو',          name_he: 'שוקו',         name_en: 'Choco',         price: 18, sort_order: 12 },
];

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get('secret') !== SEED_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = getSupabaseAdmin();
  const { data: cats } = await db.from('menu_categories').select('id, name_ar, sort_order');

  // Accept whether already renamed or not
  const oldDrinks = cats?.find((c) => c.name_ar === 'مشروبات' || c.name_ar === 'مشروبات باردة');
  if (!oldDrinks) return NextResponse.json({ error: 'Drinks category not found', cats: cats?.map((c) => c.name_ar) }, { status: 404 });

  // Abort cleanly if already split
  const alreadyHot = cats?.find((c) => c.name_ar === 'مشروبات ساخنة');
  if (alreadyHot) return NextResponse.json({ error: 'Already split — delete مشروبات ساخنة first' }, { status: 409 });

  // 1. Rename existing مشروبات → مشروبات باردة
  await db.from('menu_categories').update({
    name_ar: 'مشروبات باردة',
    name_he: 'שתייה קרה',
    name_en: 'Cold Drinks',
  }).eq('id', oldDrinks.id);

  // 2. Delete all items from that category (already has cold+hot mixed)
  await db.from('menu_items').delete().eq('category_id', oldDrinks.id);

  // 3. Insert only cold drinks into renamed category
  await db.from('menu_items').insert(
    COLD.map((i) => ({ ...i, category_id: oldDrinks.id, is_available: true, image_url: null, desc_ar: null, desc_he: null, desc_en: null, tag: null }))
  );

  // 4. Shift all categories with sort_order > oldDrinks.sort_order up by 1
  const toShift = cats?.filter((c) => c.sort_order > oldDrinks.sort_order) ?? [];
  for (const c of toShift) {
    await db.from('menu_categories').update({ sort_order: c.sort_order + 1 }).eq('id', c.id);
  }

  // 5. Create مشروبات ساخنة right after باردة
  const { data: hotCat, error: hotCatErr } = await db
    .from('menu_categories')
    .insert({
      name_ar: 'مشروبات ساخنة',
      name_he: 'שתייה חמה',
      name_en: 'Hot Drinks',
      sort_order: oldDrinks.sort_order + 1,
      is_active: true,
    })
    .select()
    .single();

  if (hotCatErr) return NextResponse.json({ error: hotCatErr.message }, { status: 500 });

  // 5. Insert hot drinks into new category
  await db.from('menu_items').insert(
    HOT.map((i) => ({ ...i, category_id: hotCat.id, is_available: true, image_url: null, desc_ar: null, desc_he: null, desc_en: null, tag: (i as { tag?: string }).tag ?? null }))
  );

  return NextResponse.json({ success: true, coldInserted: COLD.length, hotInserted: HOT.length });
}
