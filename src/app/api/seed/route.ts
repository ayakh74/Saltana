import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

const SEED_SECRET = process.env.SEED_SECRET ?? 'saltana-seed-2026';

const categoriesData = [
  { name_ar: 'قائمة الافطار', name_he: 'ארוחת בוקר', name_en: 'Breakfast Menu', sort_order: 1 },
  { name_ar: 'وجبات رئيسية', name_he: 'מנות עיקריות', name_en: 'Main Dishes', sort_order: 2 },
  { name_ar: 'أسماك', name_he: 'דגים', name_en: 'Fish', sort_order: 3 },
  { name_ar: 'مقبّلات', name_he: 'מנות ראשונות', name_en: 'Appetizers', sort_order: 4 },
  { name_ar: 'سلطات', name_he: 'סלטים', name_en: 'Salads', sort_order: 5 },
  { name_ar: 'عالخفيف', name_he: 'קל', name_en: 'Light Bites', sort_order: 6 },
  { name_ar: 'إيطالي', name_he: 'איטלקי', name_en: 'Italian', sort_order: 7 },
  { name_ar: 'إضافات', name_he: 'תוספות', name_en: 'Add-ons', sort_order: 8 },
  { name_ar: 'مشروبات', name_he: 'שתייה', name_en: 'Drinks', sort_order: 9 },
  { name_ar: 'عصائر وشيك', name_he: 'מיצים ושייקים', name_en: 'Juices & Shakes', sort_order: 10 },
  { name_ar: 'مشروبات مميزة', name_he: 'שתייה מיוחדת', name_en: 'Signature Drinks', sort_order: 11 },
  { name_ar: 'حلويات', name_he: 'קינוחים', name_en: 'Desserts', sort_order: 12 },
  { name_ar: 'أراجيل', name_he: 'נרגילות', name_en: 'Hookah', sort_order: 13 },
];

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get('secret') !== SEED_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = getSupabaseAdmin();

  // Insert categories
  const { data: cats, error: catErr } = await db
    .from('menu_categories')
    .insert(categoriesData.map((c) => ({ ...c, is_active: true })))
    .select();
  if (catErr) return NextResponse.json({ error: catErr.message }, { status: 500 });

  const catMap: Record<string, string> = {};
  cats?.forEach((c) => { catMap[c.name_ar] = c.id; });

  // Items per category
  const itemsData = [
    // Breakfast
    { category: 'قائمة الافطار', name_ar: 'فطور زوجي', name_he: 'ארוחת בוקר לזוג', name_en: "Couple's Breakfast", desc_ar: '١٣ نوعاً من الممراحيم: بانكيك، حمص مع لحمة، فوكاتشا مع سلطات، بلاطة أجبان، و٤ مشروبات', price: 150, tag: 'popular', sort_order: 1 },
    { category: 'قائمة الافطار', name_ar: 'فطور شخصي', name_he: 'ארוחת בוקר אישית', name_en: 'Personal Breakfast', desc_ar: 'حسب الاختيار: عجة، شكشوكة، بيض عيون، مخلوطة، ٧ أنواع ممراحيم، سلطة، بانكيك', price: 75, sort_order: 2 },
    // Mains
    { category: 'وجبات رئيسية', name_ar: 'انتركوت', name_he: 'אנטריקוט', name_en: 'Entrecote', desc_ar: 'قطعة لحم مشوية على الفحم بأشهى التتبيلات والنكهات', price: 125, tag: 'signature', sort_order: 1 },
    { category: 'وجبات رئيسية', name_ar: 'فيليه', name_he: 'פילה', name_en: 'Fillet', desc_ar: 'فيليه لحم طري مشوي على الفحم', price: 120, tag: 'popular', sort_order: 2 },
    { category: 'وجبات رئيسية', name_ar: 'صدر الدجاج', name_he: 'חזה עוף', name_en: 'Chicken Breast', desc_ar: 'صدر دجاج مشوي بأشهى التتبيلات', price: 75, sort_order: 3 },
    { category: 'وجبات رئيسية', name_ar: 'كباب', name_he: 'קבב', name_en: 'Kebab', desc_ar: 'كباب لحم مشوي على الفحم مع مرافقات', price: 75, sort_order: 4 },
    { category: 'وجبات رئيسية', name_ar: 'برجيت', name_he: 'ברגר', name_en: 'Burger', desc_ar: 'برجر لحم أنغوس محلي مشوي', price: 80, sort_order: 5 },
    { category: 'وجبات رئيسية', name_ar: 'ستروغنوف (لحمة - جاج)', name_he: 'סטרוגנוב (בשר/עוף)', name_en: 'Stroganoff', desc_ar: 'ستروغنوف كريمي مع أرز بسمتي', price: 75, sort_order: 6 },
    // Fish
    { category: 'أسماك', name_ar: 'سمك مشوي', name_he: 'דג על הגחלים', name_en: 'Grilled Fish', desc_ar: 'سمك طازج مشوي على الفحم مع لمون وأعشاب', price: 95, tag: 'popular', sort_order: 1 },
    { category: 'أسماك', name_ar: 'سمك سيلان', name_he: "דג צ'ילאן", name_en: 'Ceylon Fish', desc_ar: 'سمك بصلصة سيلان الحارة', price: 95, sort_order: 2 },
    { category: 'أسماك', name_ar: 'جمبري', name_he: 'שרימפס', name_en: 'Shrimp', desc_ar: 'جمبري مشوي مع ثوم وزيت زيتون', price: 105, tag: 'signature', sort_order: 3 },
    // Appetizers
    { category: 'مقبّلات', name_ar: 'حمص', name_he: 'חומוס', name_en: 'Hummus', desc_ar: 'حمص طازج محلي الصنع', price: 25, sort_order: 1 },
    { category: 'مقبّلات', name_ar: 'حمص مع لحمة', name_he: 'חומוס עם בשר', name_en: 'Hummus with Meat', desc_ar: 'حمص طازج مع لحمة مفرومة وصنوبر', price: 38, tag: 'popular', sort_order: 2 },
    { category: 'مقبّلات', name_ar: 'متبل', name_he: 'מטבל', name_en: 'Mutabbal', desc_ar: 'متبل باذنجان مشوي طازج', price: 25, sort_order: 3 },
    { category: 'مقبّلات', name_ar: 'كبة مقلية', name_he: 'קובה מטוגנת', name_en: 'Fried Kibbeh', desc_ar: 'كبة مقلية مقرمشة محشوة باللحم والصنوبر', price: 35, tag: 'popular', sort_order: 4 },
    { category: 'مقبّلات', name_ar: 'فلافل', name_he: 'פלאפל', name_en: 'Falafel', price: 22, sort_order: 5 },
    // Salads
    { category: 'سلطات', name_ar: 'سلطة شيري مع مكسرات', name_he: 'סלט שרי עם אגוזים', name_en: 'Cherry Salad with Nuts', desc_ar: 'طماطم شيري مع مكسرات محمصة وصلصة بلسمية', price: 38, tag: 'signature', sort_order: 1 },
    { category: 'سلطات', name_ar: 'سلطة خضراء', name_he: 'סלט ירוק', name_en: 'Green Salad', price: 30, sort_order: 2 },
    { category: 'سلطات', name_ar: 'سلطة سيزر', name_he: 'סלט קיסר', name_en: 'Caesar Salad', desc_ar: 'سلطة سيزر كلاسيكية مع كروتون وبارميزان', price: 42, sort_order: 3 },
    { category: 'سلطات', name_ar: 'فتوش', name_he: 'פתוש', name_en: 'Fattoush', price: 32, sort_order: 4 },
    // Light
    { category: 'عالخفيف', name_ar: 'فوكاتشا', name_he: "פוקצ'ה", name_en: 'Focaccia', desc_ar: 'فوكاتشا طازجة مع زيت زيتون وأعشاب', price: 22, tag: 'popular', sort_order: 1 },
    { category: 'عالخفيف', name_ar: 'بروسكيتا', name_he: 'ברוסקטה', name_en: 'Bruschetta', price: 28, sort_order: 2 },
    { category: 'عالخفيف', name_ar: 'خبز بالثوم', name_he: 'לחם שום', name_en: 'Garlic Bread', price: 18, sort_order: 3 },
    // Italian
    { category: 'إيطالي', name_ar: 'باستا أرابياتا', name_he: 'פסטה ארביאטה', name_en: 'Pasta Arrabiata', price: 58, sort_order: 1 },
    { category: 'إيطالي', name_ar: 'باستا كريمة الفطر', name_he: 'פסטה שמנת פטריות', name_en: 'Mushroom Cream Pasta', price: 65, tag: 'popular', sort_order: 2 },
    { category: 'إيطالي', name_ar: 'ريزوتو الفطر', name_he: 'ריזוטו פטריות', name_en: 'Mushroom Risotto', price: 68, tag: 'signature', sort_order: 3 },
    { category: 'إيطالي', name_ar: 'بيتزا مرغريتا', name_he: 'פיצה מרגריטה', name_en: 'Pizza Margherita', price: 58, sort_order: 4 },
    // Extras
    { category: 'إضافات', name_ar: 'أرز بسمتي', name_he: 'אורז בסמטי', name_en: 'Basmati Rice', price: 15, sort_order: 1 },
    { category: 'إضافات', name_ar: 'خبز طازج', name_he: 'לחם טרי', name_en: 'Fresh Bread', price: 10, sort_order: 2 },
    { category: 'إضافات', name_ar: 'صلصة تحينة', name_he: 'רוטב טחינה', name_en: 'Tahini Sauce', price: 10, sort_order: 3 },
    { category: 'إضافات', name_ar: 'خضروات مشوية', name_he: 'ירקות על הגחלים', name_en: 'Grilled Vegetables', price: 22, sort_order: 4 },
    // Drinks
    { category: 'مشروبات', name_ar: 'موخيتو', name_he: 'מוחיטו', name_en: 'Mojito', desc_ar: 'موخيتو منعش بالنعناع والليمون', price: 22, tag: 'popular', sort_order: 1 },
    { category: 'مشروبات', name_ar: 'ليموناضة', name_he: 'לימונדה', name_en: 'Lemonade', price: 18, sort_order: 2 },
    { category: 'مشروبات', name_ar: 'مشروبات غازية', name_he: 'שתייה מוגזת', name_en: 'Soft Drinks', price: 12, sort_order: 3 },
    { category: 'مشروبات', name_ar: 'قهوة عربية', name_he: 'קפה ערבי', name_en: 'Arabic Coffee', price: 8, sort_order: 4 },
    // Juices
    { category: 'عصائر وشيك', name_ar: 'عصير برتقال طازج', name_he: 'מיץ תפוזים טרי', name_en: 'Fresh Orange Juice', price: 18, tag: 'popular', sort_order: 1 },
    { category: 'عصائر وشيك', name_ar: 'سموذي فواكه', name_he: 'שייק פירות', name_en: 'Fruit Smoothie', price: 22, sort_order: 2 },
    { category: 'عصائر وشيك', name_ar: 'شيك شوكولاتة', name_he: 'שייק שוקולד', name_en: 'Chocolate Shake', price: 24, tag: 'popular', sort_order: 3 },
    // Special drinks
    { category: 'مشروبات مميزة', name_ar: 'موخيتو الفراولة', name_he: 'מוחיטו תות', name_en: 'Strawberry Mojito', price: 28, tag: 'signature', sort_order: 1 },
    { category: 'مشروبات مميزة', name_ar: 'ليموناضة النعناع', name_he: 'לימונדה נענע', name_en: 'Mint Lemonade', price: 22, sort_order: 2 },
    { category: 'مشروبات مميزة', name_ar: 'باشن فروت', name_he: 'פסיפלורה', name_en: 'Passion Fruit', price: 26, sort_order: 3 },
    // Desserts
    { category: 'حلويات', name_ar: 'كنافة', name_he: 'כנאפה', name_en: 'Kunafa', desc_ar: 'كنافة عربية طازجة بالقطر والقشطة', price: 28, tag: 'popular', sort_order: 1 },
    { category: 'حلويات', name_ar: 'تشيزكيك', name_he: "צ'יזקייק", name_en: 'Cheesecake', price: 32, sort_order: 2 },
    { category: 'حلويات', name_ar: 'بانا كوتا', name_he: 'פנה קוטה', name_en: 'Panna Cotta', desc_ar: 'بانا كوتا إيطالية مع صلصة الكراميل', price: 30, tag: 'signature', sort_order: 3 },
    // Hookah
    { category: 'أراجيل', name_ar: 'أرجيلة فاخرة', name_he: 'נרגילה מפוארת', name_en: 'Premium Hookah', price: 60, sort_order: 1 },
    { category: 'أراجيل', name_ar: 'أرجيلة توت', name_he: 'נרגילה תות', name_en: 'Strawberry Hookah', price: 55, tag: 'popular', sort_order: 2 },
    { category: 'أراجيل', name_ar: 'أرجيلة بطيخ', name_he: 'נרגילה אבטיח', name_en: 'Watermelon Hookah', price: 55, sort_order: 3 },
  ];

  const itemsToInsert = itemsData.map(({ category, ...item }) => ({
    ...item,
    category_id: catMap[category],
    is_available: true,
    image_url: null,
    desc_he: null,
    desc_en: null,
    tag: (item as { tag?: string }).tag ?? null,
  })).filter((i) => i.category_id);

  const { error: itemErr } = await db.from('menu_items').insert(itemsToInsert);
  if (itemErr) return NextResponse.json({ error: itemErr.message }, { status: 500 });

  return NextResponse.json({
    success: true,
    categoriesCreated: cats?.length,
    itemsCreated: itemsToInsert.length,
  });
}
