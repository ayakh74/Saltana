import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

const SEED_SECRET = process.env.SEED_SECRET ?? '';

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get('secret') !== SEED_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = getSupabaseAdmin();
  // Fix any menu_items in مشروبات مميزة that have a section different from 'موخيتو' (typo variant)
  const { data: cat } = await db.from('menu_categories').select('id').eq('name_ar', 'مشروبات مميزة').single();
  if (!cat?.id) return NextResponse.json({ error: 'Category not found' }, { status: 404 });

  const { data: items } = await db.from('menu_items').select('id, section').eq('category_id', cat.id);
  const toFix = items?.filter((i) => i.section && i.section !== 'كوكتيل' && i.section !== 'موخيتو') ?? [];
  if (toFix.length === 0) return NextResponse.json({ success: true, message: 'Nothing to fix' });

  for (const item of toFix) {
    await db.from('menu_items').update({ section: 'موخيتو' }).eq('id', item.id);
  }
  return NextResponse.json({ success: true, fixed: toFix.length });
}
