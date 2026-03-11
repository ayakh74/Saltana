import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

const SEED_SECRET = process.env.SEED_SECRET ?? '';

const COLD = [
  { name_ar: 'كولا',        name_he: 'קולה',        name_en: 'Cola',        price: 10, sort_order: 1,  section: 'بارد' },
  { name_ar: 'كولا زيرو',   name_he: 'קולה זירו',   name_en: 'Cola Zero',   price: 10, sort_order: 2,  section: 'بارد' },
  { name_ar: 'سبرايت',      name_he: 'ספרייט',      name_en: 'Sprite',      price: 10, sort_order: 3,  section: 'بارد' },
  { name_ar: 'سبرايت زيرو', name_he: 'ספרייט זירו', name_en: 'Sprite Zero', price: 10, sort_order: 4,  section: 'بارد' },
  { name_ar: 'XL',           name_he: 'XL',           name_en: 'XL Energy',  price: 10, sort_order: 5,  section: 'بارد' },
  { name_ar: 'صودا',         name_he: 'סודה',         name_en: 'Soda',       price: 10, sort_order: 6,  section: 'بارد' },
  { name_ar: 'مياه كبير',   name_he: 'מים גדול',    name_en: 'Large Water', price: 15, sort_order: 7,  section: 'بارد' },
];

const HOT = [
  { name_ar: 'شاي نعنع',     name_he: 'תה נענע',     name_en: 'Mint Tea',      price: 15, sort_order: 8,  section: 'ساخن' },
  { name_ar: 'حريمة',         name_he: 'חרימה',        name_en: 'Harima',        price: 15, sort_order: 9,  section: 'ساخن' },
  { name_ar: 'شاي سلطنة',    name_he: 'תה סולטאנה',  name_en: 'Saltana Tea',   price: 15, tag: 'signature', sort_order: 10, section: 'ساخن' },
  { name_ar: 'نسكافية',       name_he: 'נסקפה',        name_en: 'Nescafe',       price: 18, sort_order: 11, section: 'ساخن' },
  { name_ar: 'هقوع',          name_he: "הק'וע",        name_en: 'Haqwa',         price: 18, sort_order: 12, section: 'ساخن' },
  { name_ar: 'هوت شوكليت',   name_he: 'שוקו חם',     name_en: 'Hot Chocolate', price: 18, sort_order: 13, section: 'ساخن' },
  { name_ar: 'كافيه توتيلا', name_he: 'קפה טוטילה',  name_en: 'Café Toffila',  price: 18, sort_order: 14, section: 'ساخن' },
  { name_ar: 'سحلب',          name_he: 'סחלב',         name_en: 'Sahlab',        price: 20, sort_order: 15, section: 'ساخن' },
  { name_ar: 'أسبريسو',       name_he: 'אספרסו',       name_en: 'Espresso',      price: 10, sort_order: 16, section: 'ساخن' },
  { name_ar: 'موكا مرير',    name_he: 'מוקה מר',     name_en: 'Bitter Mocha',  price: 20, sort_order: 17, section: 'ساخن' },
  { name_ar: 'موكا وايت',    name_he: 'מוקה לבן',    name_en: 'White Mocha',   price: 20, sort_order: 18, section: 'ساخن' },
  { name_ar: 'شوكو',          name_he: 'שוקו',         name_en: 'Choco',         price: 18, sort_order: 19, section: 'ساخن' },
];

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get('secret') !== SEED_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = getSupabaseAdmin();
  const { data: cats } = await db.from('menu_categories').select('id, name_ar, sort_order');

  const coldCat = cats?.find((c) => c.name_ar === 'مشروبات باردة');
  const hotCat  = cats?.find((c) => c.name_ar === 'مشروبات ساخنة');
  if (!coldCat) return NextResponse.json({ error: 'مشروبات باردة not found' }, { status: 404 });

  // 1. Rename باردة → مشروبات
  await db.from('menu_categories').update({ name_ar: 'مشروبات', name_he: 'שתייה', name_en: 'Drinks' }).eq('id', coldCat.id);

  // 2. Delete all existing items from both cats
  await db.from('menu_items').delete().eq('category_id', coldCat.id);
  if (hotCat) await db.from('menu_items').delete().eq('category_id', hotCat.id);

  // 3. Insert all items into the merged category with section field
  const allItems = [...COLD, ...HOT].map((item) => ({
    name_ar: item.name_ar,
    name_he: item.name_he,
    name_en: item.name_en,
    price: item.price,
    sort_order: item.sort_order,
    section: item.section,
    category_id: coldCat.id,
    is_available: true,
    image_url: null,
    desc_ar: null,
    desc_he: null,
    desc_en: null,
    tag: (item as { tag?: string }).tag ?? null,
  }));

  const { error: insErr } = await db.from('menu_items').insert(allItems);
  if (insErr) return NextResponse.json({ error: insErr.message }, { status: 500 });

  // 4. Delete the now-empty ساخنة category and shift sort orders back
  if (hotCat) {
    await db.from('menu_categories').delete().eq('id', hotCat.id);
    const toShift = cats?.filter((c) => c.sort_order > hotCat.sort_order) ?? [];
    for (const c of toShift) {
      await db.from('menu_categories').update({ sort_order: c.sort_order - 1 }).eq('id', c.id);
    }
  }

  return NextResponse.json({ success: true, itemsInserted: allItems.length });
}
