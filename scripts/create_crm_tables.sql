-- =============================================
-- CRM System - Leads & Quotes Management
-- Run this in your Supabase SQL Editor
-- =============================================

-- 0. Create is_admin function if not exists
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Contact Info
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  address TEXT,
  city TEXT,
  
  -- Lead Details
  source TEXT DEFAULT 'website' CHECK (source IN ('website', 'phone', 'referral', 'social', 'exhibition', 'other')),
  source_details TEXT, -- e.g., "referred by משה כהן"
  
  -- Project Info
  project_type TEXT DEFAULT 'kitchen' CHECK (project_type IN ('kitchen', 'closet', 'bathroom', 'other')),
  kitchen_size_meters DECIMAL(5,2), -- מטר רץ
  budget_range TEXT, -- e.g., "50,000-80,000"
  timeline TEXT, -- e.g., "תוך 3 חודשים"
  notes TEXT,
  
  -- Status Management
  status TEXT DEFAULT 'new' CHECK (status IN (
    'new',           -- ליד חדש
    'contacted',     -- יצרנו קשר
    'meeting_set',   -- נקבעה פגישה
    'meeting_done',  -- הפגישה התקיימה
    'quote_sent',    -- נשלחה הצעת מחיר
    'negotiating',   -- במו"מ
    'won',           -- נסגרה עסקה
    'lost',          -- אבד
    'on_hold'        -- בהמתנה
  )),
  status_note TEXT, -- הערה על הסטטוס
  
  -- Assignment
  assigned_to UUID REFERENCES profiles(id),
  
  -- Dates
  next_followup_date DATE,
  meeting_date TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Quotes table (הצעות מחיר)
CREATE TABLE IF NOT EXISTS quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_number TEXT UNIQUE NOT NULL, -- מספר הצעה: Q-2026-001
  
  -- Link to lead
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  
  -- Customer Info (copied from lead or manual)
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  customer_address TEXT,
  
  -- Quote Details
  title TEXT NOT NULL, -- e.g., "הצעת מחיר למטבח - משפחת כהן"
  description TEXT,
  
  -- Pricing
  subtotal DECIMAL(10,2) DEFAULT 0,
  discount_percent DECIMAL(5,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  vat_percent DECIMAL(5,2) DEFAULT 17,
  vat_amount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) DEFAULT 0,
  
  -- Terms
  payment_terms TEXT DEFAULT '50% מקדמה, 50% באספקה',
  delivery_time TEXT DEFAULT '6-8 שבועות',
  warranty TEXT DEFAULT 'אחריות 5 שנים',
  validity_days INTEGER DEFAULT 30,
  notes TEXT,
  
  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN (
    'draft',      -- טיוטה
    'sent',       -- נשלחה
    'viewed',     -- נצפתה
    'accepted',   -- אושרה
    'rejected',   -- נדחתה
    'expired',    -- פג תוקף
    'revised'     -- עודכנה (גרסה חדשה)
  )),
  
  -- Tracking
  sent_at TIMESTAMP WITH TIME ZONE,
  viewed_at TIMESTAMP WITH TIME ZONE,
  responded_at TIMESTAMP WITH TIME ZONE,
  
  -- PDF
  pdf_url TEXT,
  
  -- Metadata
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Quote Items (פריטים בהצעה)
CREATE TABLE IF NOT EXISTS quote_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE NOT NULL,
  
  -- Item Details
  item_type TEXT DEFAULT 'cabinet' CHECK (item_type IN (
    'cabinet',     -- ארון
    'countertop',  -- משטח
    'appliance',   -- מכשיר חשמלי
    'accessory',   -- אביזר
    'installation',-- התקנה
    'design',      -- עיצוב/תכנון
    'delivery',    -- משלוח
    'other'        -- אחר
  )),
  
  name TEXT NOT NULL,
  description TEXT,
  
  -- Measurements
  width_cm INTEGER,
  height_cm INTEGER,
  depth_cm INTEGER,
  
  -- Pricing
  quantity INTEGER DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  
  -- Order
  order_index INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Lead Activities (היסטוריית פעילות)
CREATE TABLE IF NOT EXISTS lead_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE NOT NULL,
  
  activity_type TEXT NOT NULL CHECK (activity_type IN (
    'note',           -- הערה
    'call',           -- שיחה
    'email',          -- אימייל
    'meeting',        -- פגישה
    'quote_sent',     -- נשלחה הצעה
    'quote_accepted', -- הצעה אושרה
    'quote_rejected', -- הצעה נדחתה
    'status_change',  -- שינוי סטטוס
    'followup'        -- תזכורת
  )),
  
  title TEXT NOT NULL,
  description TEXT,
  
  -- Related
  quote_id UUID REFERENCES quotes(id) ON DELETE SET NULL,
  
  -- Who & When
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies

-- Drop existing policies first (to avoid conflicts)
DROP POLICY IF EXISTS "Admins can manage leads" ON leads;
DROP POLICY IF EXISTS "Anyone can create leads" ON leads;
DROP POLICY IF EXISTS "Admins can manage quotes" ON quotes;
DROP POLICY IF EXISTS "Admins can manage quote_items" ON quote_items;
DROP POLICY IF EXISTS "Admins can manage lead_activities" ON lead_activities;

-- Leads: Admins can do everything
CREATE POLICY "Admins can manage leads" ON leads 
  FOR ALL 
  TO authenticated
  USING (public.is_admin());

-- Leads: Anyone (including anonymous) can INSERT
CREATE POLICY "Anyone can create leads" ON leads 
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

-- Quotes: Admins only
CREATE POLICY "Admins can manage quotes" ON quotes FOR ALL USING (public.is_admin());
CREATE POLICY "Admins can manage quote_items" ON quote_items FOR ALL USING (public.is_admin());
CREATE POLICY "Admins can manage lead_activities" ON lead_activities FOR ALL USING (public.is_admin());

-- 7. Function to generate quote number
CREATE OR REPLACE FUNCTION generate_quote_number()
RETURNS TEXT AS $$
DECLARE
  year_part TEXT;
  sequence_num INTEGER;
  new_number TEXT;
BEGIN
  year_part := to_char(NOW(), 'YYYY');
  
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(quote_number FROM 'Q-\d{4}-(\d+)') AS INTEGER)
  ), 0) + 1
  INTO sequence_num
  FROM quotes
  WHERE quote_number LIKE 'Q-' || year_part || '-%';
  
  new_number := 'Q-' || year_part || '-' || LPAD(sequence_num::TEXT, 3, '0');
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- 8. Function to calculate quote totals
CREATE OR REPLACE FUNCTION calculate_quote_totals(quote_uuid UUID)
RETURNS void AS $$
DECLARE
  sub DECIMAL(10,2);
  disc_pct DECIMAL(5,2);
  disc_amt DECIMAL(10,2);
  vat_pct DECIMAL(5,2);
  vat_amt DECIMAL(10,2);
  tot DECIMAL(10,2);
BEGIN
  -- Get subtotal from items
  SELECT COALESCE(SUM(total_price), 0) INTO sub
  FROM quote_items WHERE quote_id = quote_uuid;
  
  -- Get discount percent
  SELECT discount_percent, vat_percent INTO disc_pct, vat_pct
  FROM quotes WHERE id = quote_uuid;
  
  -- Calculate
  disc_amt := sub * (COALESCE(disc_pct, 0) / 100);
  vat_amt := (sub - disc_amt) * (COALESCE(vat_pct, 17) / 100);
  tot := sub - disc_amt + vat_amt;
  
  -- Update quote
  UPDATE quotes SET
    subtotal = sub,
    discount_amount = disc_amt,
    vat_amount = vat_amt,
    total = tot,
    updated_at = NOW()
  WHERE id = quote_uuid;
END;
$$ LANGUAGE plpgsql;

-- 9. Trigger to auto-update quote totals
CREATE OR REPLACE FUNCTION trigger_update_quote_totals()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM calculate_quote_totals(OLD.quote_id);
    RETURN OLD;
  ELSE
    PERFORM calculate_quote_totals(NEW.quote_id);
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_quote_totals ON quote_items;
CREATE TRIGGER update_quote_totals
  AFTER INSERT OR UPDATE OR DELETE ON quote_items
  FOR EACH ROW EXECUTE FUNCTION trigger_update_quote_totals();

-- 10. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quotes_lead ON quotes(lead_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_quote_items_quote ON quote_items(quote_id);
CREATE INDEX IF NOT EXISTS idx_lead_activities_lead ON lead_activities(lead_id);

-- 11. Update contacts form to create leads
-- (We'll handle this in the application code)

-- =============================================
-- Status Labels (for reference):
-- =============================================
-- Lead Statuses:
--   new = ליד חדש
--   contacted = יצרנו קשר
--   meeting_set = נקבעה פגישה
--   meeting_done = הפגישה התקיימה
--   quote_sent = נשלחה הצעת מחיר
--   negotiating = במו"מ
--   won = נסגרה עסקה
--   lost = אבד
--   on_hold = בהמתנה

-- Quote Statuses:
--   draft = טיוטה
--   sent = נשלחה
--   viewed = נצפתה
--   accepted = אושרה
--   rejected = נדחתה
--   expired = פג תוקף
--   revised = עודכנה
-- =============================================
