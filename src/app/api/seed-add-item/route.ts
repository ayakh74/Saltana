import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

const SEED_SECRET = process.env.SEED_SECRET ?? '';

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get('secret') !== SEED_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = getSupabaseAdmin();
  const { data: cat } = await db.from('menu_categories').select('id').eq('name_ar', 'مشروبات مميزة').single();
  if (!cat?.id) return NextResponse.json({ error: 'Category not found' }, { status: 404 });

  const { data: items } = await db.from('menu_items').select('sort_order').eq('category_id', cat.id).eq('section', 'كوكتيل').order('sort_order', { ascending: false }).limit(1);
  const nextOrder = (items?.[0]?.sort_order ?? 0) + 1;

  const item = {
    category_id: cat.id,
    name_ar: 'كوكتيل مانجو وكيوي',
    name_he: 'קוקטייל מנגו וקיווי',
    name_en: 'Mango Kiwi Cocktail',
    desc_ar: 'مانجو وكيوي',
    price: 25,
    section: 'كوكتيل',
    sort_order: nextOrder,
    is_available: true,
    image_url: null,
    desc_he: null,
    desc_en: null,
    tag: null,
  };

  const { error } = await db.from('menu_items').insert(item);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, added: 'كوكتيل مانجو وكيوي' });
}
