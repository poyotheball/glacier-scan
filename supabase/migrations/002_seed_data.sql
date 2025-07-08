-- Insert sample glaciers
INSERT INTO glaciers (name, location, region, country) VALUES
('Glacier Bay', '{"latitude": 58.5, "longitude": -136.0}', 'Alaska', 'United States'),
('Perito Moreno', '{"latitude": -50.5, "longitude": -73.0}', 'Patagonia', 'Argentina'),
('Vatnajökull', '{"latitude": 64.4, "longitude": -16.8}', 'Iceland', 'Iceland'),
('Franz Josef', '{"latitude": -43.4, "longitude": 170.2}', 'South Island', 'New Zealand'),
('Athabasca Glacier', '{"latitude": 52.2, "longitude": -117.2}', 'Alberta', 'Canada'),
('Aletsch Glacier', '{"latitude": 46.5, "longitude": 8.0}', 'Valais', 'Switzerland'),
('Mendenhall Glacier', '{"latitude": 58.4, "longitude": -134.5}', 'Alaska', 'United States'),
('Pasterze Glacier', '{"latitude": 47.1, "longitude": 12.7}', 'Carinthia', 'Austria');

-- Insert sample measurements for each glacier
INSERT INTO measurements (glacier_id, date, ice_volume, surface_area, melt_rate)
SELECT 
    g.id,
    '2023-01-01'::date,
    ROUND((RANDOM() * 100 + 50)::numeric, 2),
    ROUND((RANDOM() * 50 + 25)::numeric, 2),
    ROUND((RANDOM() * 2 + 0.5)::numeric, 4)
FROM glaciers g;

INSERT INTO measurements (glacier_id, date, ice_volume, surface_area, melt_rate)
SELECT 
    g.id,
    '2023-06-01'::date,
    ROUND((RANDOM() * 95 + 45)::numeric, 2),
    ROUND((RANDOM() * 48 + 22)::numeric, 2),
    ROUND((RANDOM() * 2.5 + 0.8)::numeric, 4)
FROM glaciers g;

INSERT INTO measurements (glacier_id, date, ice_volume, surface_area, melt_rate)
SELECT 
    g.id,
    '2024-01-01'::date,
    ROUND((RANDOM() * 90 + 40)::numeric, 2),
    ROUND((RANDOM() * 45 + 20)::numeric, 2),
    ROUND((RANDOM() * 3 + 1.0)::numeric, 4)
FROM glaciers g;

-- Insert sample alerts
INSERT INTO alerts (glacier_id, alert_type, alert_message)
SELECT 
    g.id,
    'RAPID_MELT',
    'Rapid melting detected - melt rate increased by ' || ROUND((RANDOM() * 20 + 10)::numeric, 0) || '% in the last 6 months'
FROM glaciers g
WHERE g.name IN ('Glacier Bay', 'Perito Moreno', 'Mendenhall Glacier');

INSERT INTO alerts (glacier_id, alert_type, alert_message)
SELECT 
    g.id,
    'VOLUME_LOSS',
    'Significant ice volume loss detected - ' || ROUND((RANDOM() * 15 + 5)::numeric, 1) || '% reduction from previous year'
FROM glaciers g
WHERE g.name IN ('Athabasca Glacier', 'Aletsch Glacier');
