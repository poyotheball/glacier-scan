-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create glaciers table
CREATE TABLE glaciers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    location JSONB NOT NULL,
    region VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create measurements table
CREATE TABLE measurements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    glacier_id UUID NOT NULL REFERENCES glaciers(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    ice_volume DECIMAL(10,2) NOT NULL,
    surface_area DECIMAL(10,2) NOT NULL,
    melt_rate DECIMAL(10,4) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create glacier_images table
CREATE TABLE glacier_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    glacier_id UUID REFERENCES glaciers(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    upload_date TIMESTAMP WITH TIME ZONE NOT NULL,
    analysis_status VARCHAR(20) DEFAULT 'pending' CHECK (analysis_status IN ('pending', 'processing', 'completed', 'failed')),
    analysis_results JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create alerts table
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    glacier_id UUID NOT NULL REFERENCES glaciers(id) ON DELETE CASCADE,
    alert_type VARCHAR(100) NOT NULL,
    alert_message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_glaciers_name ON glaciers(name);
CREATE INDEX idx_glaciers_region ON glaciers(region);
CREATE INDEX idx_glaciers_country ON glaciers(country);
CREATE INDEX idx_measurements_glacier_id ON measurements(glacier_id);
CREATE INDEX idx_measurements_date ON measurements(date);
CREATE INDEX idx_glacier_images_glacier_id ON glacier_images(glacier_id);
CREATE INDEX idx_glacier_images_status ON glacier_images(analysis_status);
CREATE INDEX idx_alerts_glacier_id ON alerts(glacier_id);
CREATE INDEX idx_alerts_type ON alerts(alert_type);

-- Enable Row Level Security
ALTER TABLE glaciers ENABLE ROW LEVEL SECURITY;
ALTER TABLE measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE glacier_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read access for glaciers" ON glaciers FOR SELECT USING (true);
CREATE POLICY "Public read access for measurements" ON measurements FOR SELECT USING (true);
CREATE POLICY "Public read access for glacier_images" ON glacier_images FOR SELECT USING (true);
CREATE POLICY "Public read access for alerts" ON alerts FOR SELECT USING (true);

-- Create policies for authenticated users
CREATE POLICY "Authenticated users can insert glacier_images" ON glacier_images FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update their glacier_images" ON glacier_images FOR UPDATE USING (auth.role() = 'authenticated');
