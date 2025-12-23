-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_name TEXT DEFAULT 'MILLO',
  site_description TEXT DEFAULT 'עיצוב מטבחים יוקרתיים',
  phone TEXT DEFAULT '052-1234567',
  whatsapp TEXT DEFAULT '052-1234567',
  email TEXT DEFAULT 'info@millo.co.il',
  address TEXT DEFAULT 'תל אביב, ישראל',
  facebook TEXT,
  instagram TEXT,
  about_text TEXT,
  about_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings (only if table is empty)
INSERT INTO settings (site_name, site_description, phone, whatsapp, email, address, about_text)
SELECT 'MILLO', 'עיצוב מטבחים יוקרתיים', '052-1234567', '052-1234567', 'info@millo.co.il', 'תל אביב, ישראל', 
'אנחנו MILLO - סטודיו לעיצוב מטבחים יוקרתיים המתמחה ביצירת חללי מטבח ייחודיים ומותאמים אישית. אנו משלבים עיצוב מודרני עם פונקציונליות מקסימלית.'
WHERE NOT EXISTS (SELECT 1 FROM settings);

-- Enable Row Level Security
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Allow read access to everyone
CREATE POLICY "Allow public read access" ON settings
  FOR SELECT
  USING (true);

-- Allow update for authenticated users only (you can adjust this)
CREATE POLICY "Allow authenticated update" ON settings
  FOR UPDATE
  USING (true);
