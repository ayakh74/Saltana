import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

const SEED_SECRET = process.env.SEED_SECRET ?? '';

// Categories whose items will be REPLACED (placeholders → real menu)
const REPLACE_CATEGORIES = ['أسماك', 'مقبّلات', 'سلطات', 'عالخفيف', 'إيطالي'];

// New items to INSERT into مين (wont delete existing, just adds missing 3)
const NEW_MAINS = [
  { name_ar: 'فاهيتا لحمة', name_he: 'פאהיטה בשר', name_en: 'Beef Fajita', desc_ar: 'فاهيتا لحمة مشوية مع خضروات ملونة وتورتيا', price: 85, sort_order: 7 },
  { name_ar: 'فاهيتا جاج', name_he: 'פאהיטה עוף', name_en: 'Chicken Fajita', desc_ar: 'فاهيتا دجاج مشوية مع خضروات ملونة وتورتيا', price: 75, sort_order: 8 },
  { name_ar: 'دجاج موكرام', name_he: 'עוף מוקרם', name_en: 'Glazed Chicken', desc_ar: 'دجاج بصلصة موكرام الخاصة', price: 75, sort_order: 9 },
];

const REPLACEMENT_ITEMS: Record<string, { name_ar: string; name_he?: string; name_en?: string; desc_ar?: string; price: number; tag?: string; sort_order: number }[]> = {
  'أسماك': [
    { name_ar: 'شرمس', name_he: 'שרימפס', name_en: 'Shrimp', price: 85, tag: 'popular', sort_order: 1 },
    { name_ar: 'كلماري', name_he: 'קלמארי', name_en: 'Calamari', price: 78, sort_order: 2 },
    { name_ar: 'سلمون', name_he: 'סלמון', name_en: 'Salmon', price: 90, tag: 'signature', sort_order: 3 },
    { name_ar: 'كلماري لبنة', name_he: 'קלמארי לאבנה', name_en: 'Calamari Labneh', price: 68, sort_order: 4 },
    { name_ar: 'شرمس كلماري', name_he: 'שרימפס קלמארי', name_en: 'Shrimp Calamari', price: 80, sort_order: 5 },
    { name_ar: 'روس كلماري', name_he: 'ראוס קלמארי', name_en: 'Calamari Ross', price: 65, sort_order: 6 },
    { name_ar: 'سلمون سلطنة', name_he: 'סלמון סולטאנה', name_en: 'Saltana Salmon', desc_ar: 'سلمون سلطنة بتتبيلة خاصة', price: 95, tag: 'signature', sort_order: 7 },
    { name_ar: 'بلاطة مشكل شخصين', name_he: 'צלחת מיקס לשניים', name_en: 'Mixed Seafood for 2', desc_ar: 'شرمس كلماري روس كلماري — للشخصين', price: 210, sort_order: 8 },
  ],
  'مقبّلات': [
    { name_ar: 'كارباتشو', name_he: 'קרפציו', name_en: 'Carpaccio', price: 50, tag: 'signature', sort_order: 1 },
    { name_ar: 'تارتار سلمون', name_he: 'טרטר סלמון', name_en: 'Salmon Tartare', price: 50, sort_order: 2 },
    { name_ar: 'تارتار فيليه', name_he: 'טרטר פילה', name_en: 'Fillet Tartare', price: 60, sort_order: 3 },
    { name_ar: 'ارتيشوكي', name_he: 'ארטישוק', name_en: 'Artichoke', price: 50, sort_order: 4 },
    { name_ar: 'قلع محشي', name_he: 'קולראבי ממולא', name_en: 'Stuffed Kohlrabi', price: 45, sort_order: 5 },
    { name_ar: 'فريدس ارضي شوك', name_he: 'פריידס ארטישוק', name_en: 'Fried Artichoke', price: 80, sort_order: 6 },
    { name_ar: 'سفيناكي', name_he: 'ספנאקי', name_en: 'Spanakopita', price: 50, sort_order: 7 },
    { name_ar: 'بلاطة معجنات', name_he: "צלחת מאפים", name_en: 'Pastry Platter', price: 60, tag: 'popular', sort_order: 8 },
    { name_ar: 'كبة', name_he: 'קובה', name_en: 'Kibbeh', price: 40, sort_order: 9 },
    { name_ar: 'أصابع جبنة مقلية', name_he: 'אצבעות גבינה מטוגנות', name_en: 'Fried Cheese Fingers', price: 30, sort_order: 10 },
    { name_ar: 'ادماس', name_he: 'אדמס', name_en: 'Edamame', price: 40, sort_order: 11 },
    { name_ar: 'شيبس', name_he: 'צ\'יפס', name_en: 'Fries', price: 20, sort_order: 12 },
    { name_ar: 'باتنجان مشوي', name_he: 'חצילים על הגחלים', name_en: 'Grilled Eggplant', price: 40, sort_order: 13 },
    { name_ar: 'موكرام', name_he: 'מוקרם', name_en: 'Mokram', price: 55, sort_order: 14 },
    { name_ar: 'كوردن بلو', name_he: 'קורדון בלו', name_en: 'Cordon Bleu', price: 75, sort_order: 15 },
  ],
  'سلطات': [
    { name_ar: 'جرجير', name_he: 'רוקט', name_en: 'Rocket Salad', price: 35, sort_order: 1 },
    { name_ar: 'تبولة', name_he: 'טבולה', name_en: 'Tabbouleh', price: 40, sort_order: 2 },
    { name_ar: 'فتوش', name_he: 'פתוש', name_en: 'Fattoush', price: 45, sort_order: 3 },
    { name_ar: 'مليون دولار', name_he: 'מיליון דולר', name_en: 'Million Dollar', price: 45, sort_order: 4 },
    { name_ar: 'شيري مع مكسرات', name_he: 'שרי עם אגוזים', name_en: 'Cherry with Nuts', desc_ar: 'طماطم شيري مع مكسرات محمصة وصلصة بلسمية', price: 48, tag: 'signature', sort_order: 5 },
    { name_ar: 'سيزر', name_he: 'קיסר', name_en: 'Caesar', desc_ar: 'سلطة سيزر كلاسيكية مع كروتون وبارميزان', price: 45, sort_order: 6 },
    { name_ar: 'حلومي', name_he: 'חלומי', name_en: 'Halloumi', price: 48, sort_order: 7 },
    { name_ar: 'يونانية', name_he: 'יוונית', name_en: 'Greek Salad', price: 48, sort_order: 8 },
    { name_ar: 'سلاطة توست', name_he: 'סלט טוסט', name_en: 'Toast Salad', price: 48, sort_order: 9 },
    { name_ar: 'سلاطة سلطنة', name_he: 'סלט סולטאנה', name_en: 'Saltana Salad', desc_ar: 'فتوش، تبولة، جرجير، حمص، مثومة، مقبلات', price: 80, tag: 'popular', sort_order: 10 },
  ],
  'عالخفيف': [
    { name_ar: 'تورتيا (دجاج)', name_he: 'טורטייה (עוף)', name_en: 'Chicken Tortilla', price: 47, sort_order: 1 },
    { name_ar: 'تورتيا سلطنة', name_he: 'טורטייה סולטאנה', name_en: 'Saltana Tortilla', price: 50, tag: 'popular', sort_order: 2 },
    { name_ar: 'تورتيا انتركوت', name_he: 'טורטייה אנטריקוט', name_en: 'Entrecote Tortilla', price: 47, sort_order: 3 },
    { name_ar: 'عرايس', name_he: 'עראיס', name_en: 'Arayes', price: 40, sort_order: 4 },
    { name_ar: 'همبورجر', name_he: 'המבורגר', name_en: 'Hamburger', price: 55, sort_order: 5 },
    { name_ar: 'توست', name_he: 'טוסט', name_en: 'Toast', price: 38, sort_order: 6 },
    { name_ar: 'جيتا جاج', name_he: 'ג\'יטה עוף', name_en: 'Chicken Jitta', price: 49, sort_order: 7 },
    { name_ar: 'جيتا انتركوت', name_he: 'ג\'יטה אנטריקוט', name_en: 'Entrecote Jitta', price: 49, sort_order: 8 },
    { name_ar: 'شنيتسلونيم', name_he: 'שניצלונים', name_en: 'Schnitzels', price: 55, sort_order: 9 },
    { name_ar: 'اضافة جبنة', name_he: 'תוספת גבינה', name_en: 'Add Cheese', price: 5, sort_order: 10 },
  ],
  'إيطالي': [
    { name_ar: 'رفيولي (بينة-بطاطا)', name_he: 'רביולי (גבינה-תפוח אדמה)', name_en: 'Ravioli (Cheese-Potato)', price: 59, sort_order: 1 },
    { name_ar: 'فتوشيني', name_he: 'פטוצ\'יני', name_en: 'Fettuccine', price: 55, sort_order: 2 },
    { name_ar: 'فتوشيني دجاج', name_he: 'פטוצ\'יני עוף', name_en: 'Chicken Fettuccine', price: 63, tag: 'popular', sort_order: 3 },
    { name_ar: 'فتوشيني شرمس', name_he: 'פטוצ\'יני שרימפס', name_en: 'Shrimp Fettuccine', price: 75, tag: 'signature', sort_order: 4 },
    { name_ar: 'بيني باستا', name_he: 'פנה פסטה', name_en: 'Penne Pasta', price: 50, sort_order: 5 },
    { name_ar: 'موكاجاس دجاج', name_he: 'מוקגאס עוף', name_en: 'Chicken Mocajas', price: 60, sort_order: 6 },
    { name_ar: 'موكاجاس انتركوت', name_he: 'מוקגאס אנטריקוט', name_en: 'Entrecote Mocajas', price: 85, sort_order: 7 },
    { name_ar: 'موكاجاس شرمس', name_he: 'מוקגאס שרימפס', name_en: 'Shrimp Mocajas', price: 78, sort_order: 8 },
  ],
};

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get('secret') !== SEED_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = getSupabaseAdmin();

  // Fetch all existing category IDs
  const { data: cats, error: catErr } = await db.from('menu_categories').select('id, name_ar');
  if (catErr) return NextResponse.json({ error: catErr.message }, { status: 500 });

  const catMap: Record<string, string> = {};
  cats?.forEach((c) => { catMap[c.name_ar] = c.id; });

  let totalDeleted = 0;
  let totalInserted = 0;
  const errors: string[] = [];

  // ── Replace items in 5 placeholder categories ──────────────────────────
  for (const catName of REPLACE_CATEGORIES) {
    const catId = catMap[catName];
    if (!catId) { errors.push(`Category not found: ${catName}`); continue; }

    const { error: delErr, count } = await db
      .from('menu_items')
      .delete({ count: 'exact' })
      .eq('category_id', catId);

    if (delErr) { errors.push(`Delete failed for ${catName}: ${delErr.message}`); continue; }
    totalDeleted += count ?? 0;

    const newItems = (REPLACEMENT_ITEMS[catName] ?? []).map((item) => ({
      ...item,
      category_id: catId,
      is_available: true,
      image_url: null,
      desc_he: null,
      desc_en: null,
      tag: item.tag ?? null,
    }));

    const { error: insErr, data: inserted } = await db.from('menu_items').insert(newItems).select();
    if (insErr) { errors.push(`Insert failed for ${catName}: ${insErr.message}`); continue; }
    totalInserted += inserted?.length ?? 0;
  }

  // ── Add 3 missing mains ────────────────────────────────────────────────
  const mainsId = catMap['وجبات رئيسية'];
  if (mainsId) {
    const mainsToAdd = NEW_MAINS.map((item) => ({
      ...item,
      category_id: mainsId,
      is_available: true,
      image_url: null,
      desc_he: null,
      desc_en: null,
      tag: item.tag ?? null,
    }));
    const { error: mainsErr, data: mainsInserted } = await db.from('menu_items').insert(mainsToAdd).select();
    if (mainsErr) errors.push(`Mains insert failed: ${mainsErr.message}`);
    else totalInserted += mainsInserted?.length ?? 0;
  }

  return NextResponse.json({
    success: errors.length === 0,
    deletedOldItems: totalDeleted,
    insertedNewItems: totalInserted,
    errors: errors.length ? errors : undefined,
  });
}
