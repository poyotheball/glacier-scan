-- Create fake glacier analysis data for testing
-- Run this script to populate your database with realistic test data

-- First, let's create some additional glaciers if they don't exist
INSERT INTO glaciers (id, name, location, region, country, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Glacier Bay', '{"latitude": 58.5, "longitude": -136.0}', 'Alaska', 'United States', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'Perito Moreno', '{"latitude": -50.5, "longitude": -73.0}', 'Patagonia', 'Argentina', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'Vatnajökull', '{"latitude": 64.4, "longitude": -16.8}', 'Iceland', 'Iceland', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'Franz Josef', '{"latitude": -43.4, "longitude": 170.2}', 'South Island', 'New Zealand', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440005', 'Athabasca Glacier', '{"latitude": 52.2, "longitude": -117.2}', 'Alberta', 'Canada', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440006', 'Aletsch Glacier', '{"latitude": 46.5, "longitude": 8.0}', 'Valais', 'Switzerland', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440007', 'Mendenhall Glacier', '{"latitude": 58.4, "longitude": -134.5}', 'Alaska', 'United States', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440008', 'Pasterze Glacier', '{"latitude": 47.1, "longitude": 12.7}', 'Carinthia', 'Austria', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Create measurements with realistic declining trends over time
INSERT INTO measurements (id, glacier_id, date, ice_volume, surface_area, melt_rate, created_at, updated_at) VALUES
-- Glacier Bay measurements (showing accelerating melt)
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '2020-01-01', 125.50, 45.2, 0.8, NOW(), NOW()),
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '2021-01-01', 118.30, 43.8, 1.2, NOW(), NOW()),
('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', '2022-01-01', 109.80, 41.9, 1.8, NOW(), NOW()),
('650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', '2023-01-01', 98.40, 39.2, 2.3, NOW(), NOW()),
('650e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', '2024-01-01', 85.20, 36.1, 2.9, NOW(), NOW()),

-- Perito Moreno measurements (relatively stable)
('650e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', '2020-01-01', 195.80, 78.5, 0.3, NOW(), NOW()),
('650e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440002', '2021-01-01', 194.20, 78.1, 0.4, NOW(), NOW()),
('650e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440002', '2022-01-01', 192.90, 77.8, 0.5, NOW(), NOW()),
('650e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440002', '2023-01-01', 191.10, 77.3, 0.6, NOW(), NOW()),
('650e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440002', '2024-01-01', 189.50, 76.9, 0.7, NOW(), NOW()),

-- Vatnajökull measurements (moderate decline)
('650e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440003', '2020-01-01', 3200.00, 8100.0, 1.1, NOW(), NOW()),
('650e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440003', '2021-01-01', 3150.00, 8050.0, 1.3, NOW(), NOW()),
('650e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440003', '2022-01-01', 3095.00, 7980.0, 1.5, NOW(), NOW()),
('650e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440003', '2023-01-01', 3025.00, 7890.0, 1.8, NOW(), NOW()),
('650e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440003', '2024-01-01', 2940.00, 7780.0, 2.1, NOW(), NOW()),

-- Franz Josef measurements (rapid decline)
('650e8400-e29b-41d4-a716-446655440016', '550e8400-e29b-41d4-a716-446655440004', '2020-01-01', 28.50, 12.8, 2.1, NOW(), NOW()),
('650e8400-e29b-41d4-a716-446655440017', '550e8400-e29b-41d4-a716-446655440004', '2021-01-01', 25.80, 11.9, 2.8, NOW(), NOW()),
('650e8400-e29b-41d4-a716-446655440018', '550e8400-e29b-41d4-a716-446655440004', '2022-01-01', 22.40, 10.7, 3.5, NOW(), NOW()),
('650e8400-e29b-41d4-a716-446655440019', '550e8400-e29b-41d4-a716-446655440004', '2023-01-01', 18.20, 9.2, 4.2, NOW(), NOW()),
('650e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440004', '2024-01-01', 13.80, 7.5, 4.9, NOW(), NOW()),

-- Athabasca Glacier measurements (steady decline)
('650e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440005', '2020-01-01', 165.00, 6.0, 1.5, NOW(), NOW()),
('650e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440005', '2021-01-01', 158.50, 5.8, 1.7, NOW(), NOW()),
('650e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440005', '2022-01-01', 151.20, 5.5, 1.9, NOW(), NOW()),
('650e8400-e29b-41d4-a716-446655440024', '550e8400-e29b-41d4-a716-446655440005', '2023-01-01', 143.10, 5.2, 2.2, NOW(), NOW()),
('650e8400-e29b-41d4-a716-446655440025', '550e8400-e29b-41d4-a716-446655440005', '2024-01-01', 134.80, 4.9, 2.5, NOW(), NOW());

-- Create fake glacier images with analysis results
INSERT INTO glacier_images (id, glacier_id, image_url, upload_date, analysis_status, analysis_results, created_at) VALUES
('750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800', '2024-01-15 10:30:00', 'completed', '{
  "glacierName": "Glacier Bay",
  "confidence": 0.92,
  "changes": {
    "iceVolumeChange": -13.2,
    "surfaceAreaChange": -8.7,
    "meltRate": 2.9,
    "elevationChange": -1.8
  },
  "confidenceIntervals": {
    "iceVolumeChange": {"lower": -15.2, "upper": -11.2},
    "surfaceAreaChange": {"lower": -10.1, "upper": -7.3},
    "meltRate": {"lower": 2.6, "upper": 3.2}
  },
  "recommendations": [
    "Immediate monitoring required due to accelerated melt rate",
    "Consider installing additional temperature sensors",
    "Recommend quarterly satellite imagery analysis",
    "Alert: Melt rate has increased 45% from previous year"
  ]
}', NOW()),

('750e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800', '2024-01-20 14:15:00', 'completed', '{
  "glacierName": "Perito Moreno",
  "confidence": 0.96,
  "changes": {
    "iceVolumeChange": -0.8,
    "surfaceAreaChange": -0.5,
    "meltRate": 0.7,
    "elevationChange": -0.2
  },
  "confidenceIntervals": {
    "iceVolumeChange": {"lower": -1.2, "upper": -0.4},
    "surfaceAreaChange": {"lower": -0.8, "upper": -0.2},
    "meltRate": {"lower": 0.5, "upper": 0.9}
  },
  "recommendations": [
    "Glacier showing remarkable stability",
    "Continue current monitoring schedule",
    "Excellent reference glacier for regional comparisons",
    "Minimal intervention required at this time"
  ]
}', NOW()),

('750e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', '2024-02-01 09:45:00', 'completed', '{
  "glacierName": "Vatnajökull",
  "confidence": 0.89,
  "changes": {
    "iceVolumeChange": -8.1,
    "surfaceAreaChange": -4.0,
    "meltRate": 2.1,
    "elevationChange": -1.2
  },
  "confidenceIntervals": {
    "iceVolumeChange": {"lower": -9.5, "upper": -6.7},
    "surfaceAreaChange": {"lower": -4.8, "upper": -3.2},
    "meltRate": {"lower": 1.8, "upper": 2.4}
  },
  "recommendations": [
    "Moderate decline consistent with regional trends",
    "Monitor for acceleration in summer months",
    "Consider impact on local water resources",
    "Recommend annual comprehensive survey"
  ]
}', NOW()),

('750e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800', '2024-02-10 16:20:00', 'completed', '{
  "glacierName": "Franz Josef",
  "confidence": 0.94,
  "changes": {
    "iceVolumeChange": -24.2,
    "surfaceAreaChange": -17.8,
    "meltRate": 4.9,
    "elevationChange": -3.1
  },
  "confidenceIntervals": {
    "iceVolumeChange": {"lower": -26.8, "upper": -21.6},
    "surfaceAreaChange": {"lower": -19.5, "upper": -16.1},
    "meltRate": {"lower": 4.5, "upper": 5.3}
  },
  "recommendations": [
    "CRITICAL: Extremely rapid retreat detected",
    "Urgent need for enhanced monitoring",
    "Consider emergency conservation measures",
    "High risk of complete retreat within 15-20 years",
    "Recommend immediate stakeholder notification"
  ]
}', NOW()),

('750e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800', '2024-02-15 11:10:00', 'completed', '{
  "glacierName": "Athabasca Glacier",
  "confidence": 0.91,
  "changes": {
    "iceVolumeChange": -18.3,
    "surfaceAreaChange": -18.3,
    "meltRate": 2.5,
    "elevationChange": -2.0
  },
  "confidenceIntervals": {
    "iceVolumeChange": {"lower": -20.1, "upper": -16.5},
    "surfaceAreaChange": {"lower": -20.0, "upper": -16.6},
    "meltRate": {"lower": 2.2, "upper": 2.8}
  },
  "recommendations": [
    "Significant retreat consistent with regional warming",
    "Popular tourist destination - consider visitor impact",
    "Excellent site for climate change education",
    "Recommend bi-annual detailed surveys"
  ]
}', NOW()),

-- Unknown glacier analysis
('750e8400-e29b-41d4-a716-446655440006', NULL, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800', '2024-02-20 13:30:00', 'completed', '{
  "glacierName": "Unknown Alpine Glacier",
  "confidence": 0.73,
  "changes": {
    "iceVolumeChange": -12.5,
    "surfaceAreaChange": -9.2,
    "meltRate": 1.8,
    "elevationChange": -1.4
  },
  "confidenceIntervals": {
    "iceVolumeChange": {"lower": -15.8, "upper": -9.2},
    "surfaceAreaChange": {"lower": -11.5, "upper": -6.9},
    "meltRate": {"lower": 1.4, "upper": 2.2}
  },
  "recommendations": [
    "Glacier identification uncertain - requires expert review",
    "Typical alpine glacier retreat patterns observed",
    "Recommend ground-truth verification",
    "Consider adding to monitoring network if significant"
  ]
}', NOW());

-- Create alerts based on the analysis
INSERT INTO alerts (id, glacier_id, alert_type, alert_message, created_at) VALUES
('850e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'RAPID_MELT', 'URGENT: Glacier Bay showing accelerated melt rate of 2.9 m/year - 45% increase from previous year. Immediate monitoring recommended.', NOW() - INTERVAL '2 days'),
('850e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', 'CRITICAL_RETREAT', 'CRITICAL: Franz Josef Glacier experiencing extreme retreat - 24% volume loss detected. Risk of complete disappearance within 15-20 years.', NOW() - INTERVAL '1 day'),
('850e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440005', 'VOLUME_LOSS', 'WARNING: Athabasca Glacier volume decreased by 18.3% - significant impact on regional water resources expected.', NOW() - INTERVAL '3 days'),
('850e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', 'SURFACE_CHANGE', 'NOTICE: Vatnajökull surface area reduction of 4% detected - within expected range but monitoring continues.', NOW() - INTERVAL '5 days'),
('850e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', 'STABILITY', 'POSITIVE: Perito Moreno remains remarkably stable with minimal changes - excellent reference glacier.', NOW() - INTERVAL '1 week');
