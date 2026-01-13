-- =============================================
-- About Page Content Table
-- Run this in your Supabase SQL Editor
-- =============================================

CREATE TABLE IF NOT EXISTS about_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Hero Section
  hero_title TEXT DEFAULT 'אודות MILLO',
  hero_subtitle TEXT DEFAULT 'מעצבים חלומות מאז 2010',
  hero_description TEXT DEFAULT 'סטודיו בוטיק לעיצוב וייצור מטבחים יוקרתיים, המשלב מקצועיות ללא פשרות עם חדשנות עיצובית',
  
  -- Main Content
  main_title TEXT DEFAULT 'הסיפור שלנו',
  main_text TEXT DEFAULT 'מאז 2010, MILLO מוביל את תעשיית המטבחים היוקרתיים בישראל. מה שהתחיל כסטודיו קטן עם חזון גדול, הפך לאחד מבתי העיצוב המובילים בארץ - עם מאות לקוחות מרוצים ופרויקטים שזכו להכרה ופרסים.

אנחנו לא רק מייצרים מטבחים - אנחנו יוצרים חוויות. כל מטבח שיוצא מהמפעל שלנו הוא תוצאה של תהליך עמוק של הקשבה, תכנון קפדני, ויצירה ברמה הגבוהה ביותר. אנחנו מאמינים שהמטבח הוא לב הבית, והוא ראוי להשקעה שתשרת אתכם לשנים רבות.

הצוות שלנו מורכב ממעצבים בכירים, מהנדסים מנוסים, ואנשי מקצוע מהשורה הראשונה שחולקים את אותה התשוקה לשלמות. אנחנו עובדים רק עם החומרים המובחרים ביותר מהיצרנים המובילים בעולם - מפורניר איטלקי ועד אבן קיסר.

מה שמייחד אותנו? הגישה האישית. אצלנו אין "מטבח מהמדף". כל פרויקט מתוכנן מאפס בהתאם לצרכים, לסגנון החיים ולחלומות של הלקוח. מהפגישה הראשונה ועד ההתקנה האחרונה - אנחנו לצידכם.',
  main_image TEXT,
  
  -- Stats Section
  show_stats BOOLEAN DEFAULT true,
  stat1_number TEXT DEFAULT '16',
  stat1_label TEXT DEFAULT 'שנות ניסיון',
  stat2_number TEXT DEFAULT '1,200+',
  stat2_label TEXT DEFAULT 'פרויקטים שהושלמו',
  stat3_number TEXT DEFAULT '98%',
  stat3_label TEXT DEFAULT 'לקוחות ממליצים',
  stat4_number TEXT DEFAULT '5',
  stat4_label TEXT DEFAULT 'שנות אחריות',
  
  -- Values Section
  show_values BOOLEAN DEFAULT true,
  values_title TEXT DEFAULT 'למה לבחור בנו',
  value1_title TEXT DEFAULT 'מומחיות שאין שניה לה',
  value1_text TEXT DEFAULT '16 שנות ניסיון בעיצוב וייצור מטבחים יוקרתיים. צוות של מעצבים ומהנדסים מהטובים בישראל שמביאים ידע עמוק וחדשנות לכל פרויקט.',
  value2_title TEXT DEFAULT 'איכות ללא פשרות',
  value2_text TEXT DEFAULT 'אנחנו עובדים רק עם החומרים הטובים ביותר בעולם - מנגנוני Blum, משטחי Caesarstone, ופורניר איטלקי. כל פרט נבדק ונבדק שוב לפני שהוא יוצא מהמפעל.',
  value3_title TEXT DEFAULT 'שירות מקצה לקצה',
  value3_text TEXT DEFAULT 'מהרגע הראשון ועד שנים אחרי ההתקנה - אנחנו כאן בשבילכם. תכנון, עיצוב, ייצור, התקנה, ושירות לקוחות יוצא מן הכלל.',
  
  -- Metadata
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view about_content" ON about_content;
DROP POLICY IF EXISTS "Admins can manage about_content" ON about_content;

-- Everyone can view
CREATE POLICY "Anyone can view about_content" ON about_content 
  FOR SELECT 
  USING (true);

-- Admins can edit
CREATE POLICY "Admins can manage about_content" ON about_content 
  FOR ALL 
  TO authenticated
  USING (public.is_admin());

-- Insert default content (only if table is empty)
INSERT INTO about_content (id)
SELECT gen_random_uuid()
WHERE NOT EXISTS (SELECT 1 FROM about_content LIMIT 1);
