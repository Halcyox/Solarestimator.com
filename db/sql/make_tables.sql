-- Solar Estimator - Minimal Database Schema
-- Simple leads table to capture essential user data

-- =====================================================
-- LEADS TABLE - Minimal Version
-- =====================================================
CREATE TABLE leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Essential contact info
    name TEXT,
    email TEXT,
    phone TEXT,
    
    -- Essential property info
    address TEXT NOT NULL,
    monthly_bill DECIMAL(10,2),
    is_renter BOOLEAN DEFAULT FALSE,
    
    -- Essential solar data
    system_size_kw DECIMAL(5,2),
    total_cost DECIMAL(10,2),
    estimated_savings DECIMAL(10,2),
    
    -- Lead status
    status TEXT DEFAULT 'new'
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX idx_leads_created_at ON leads(created_at);
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_status ON leads(status);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert leads
CREATE POLICY "Anyone can insert leads" ON leads
    FOR INSERT WITH CHECK (true);

-- Only service role can read/update leads (admin access)
CREATE POLICY "Service role full access to leads" ON leads
    FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================
-- Grant insert to authenticated users
GRANT INSERT ON leads TO authenticated;

-- Grant full access to service role
GRANT ALL ON leads TO service_role;
