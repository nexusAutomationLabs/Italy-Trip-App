-- Migration: 00003_seed_trip_events
-- Seeds pre-planned trip events for May 7-16, 2026.
-- This is applied in the Supabase Dashboard -> SQL Editor after 00002.

INSERT INTO public.events (title, description, event_date, start_time, category, location_name, location_url) VALUES

-- May 7 (Thu) - Arrival / Travel
('Leave Halifax', 'Fly from Halifax to Florence. The adventure begins!', '2026-05-07', '06:00', 'travel', NULL, NULL),

-- May 8 (Fri) - Florence
('Explore Florence', 'Free time to explore the city — walk the Ponte Vecchio, grab gelato, soak it in.', '2026-05-08', '10:00', 'excursion', NULL, NULL),
('Group Dinner in Florence', 'First group dinner together in Florence. Restaurant TBD.', '2026-05-08', '19:30', 'dinner', NULL, NULL),

-- May 9 (Sat) - Villa arrival
('Pick Up Rental Car', 'Pick up the rental car in Florence for the drive to the villa.', '2026-05-09', '10:00', 'travel', NULL, NULL),
('Check Into Villa', 'Arrive at the villa and get settled in. Welcome to home base!', '2026-05-09', '14:00', 'group_activity', 'VRBO Villa', 'https://www.vrbo.com/en-ca/cottage-rental/p1190044vb'),

-- May 10 (Sun) - Villa day
('Villa Day', 'Relax at the villa — pool, gardens, and Tuscan sunshine.', '2026-05-10', '10:00', 'group_activity', 'VRBO Villa', 'https://www.vrbo.com/en-ca/cottage-rental/p1190044vb'),
('Dinner at Villa', 'Group dinner at the villa. Cook together or hire a private chef.', '2026-05-10', '19:00', 'dinner', 'VRBO Villa', 'https://www.vrbo.com/en-ca/cottage-rental/p1190044vb'),

-- May 11 (Mon) - Excursion
('Pienza, Siena & Gladiator Site', 'Day trip to Pienza, Siena, and the Gladiator filming location in Val d''Orcia.', '2026-05-11', '09:00', 'excursion', NULL, NULL),

-- May 12 (Tue) - Food tour
('Food & Wine Tour', 'Group food and wine tour through the Tuscan countryside.', '2026-05-12', '10:00', 'excursion', NULL, NULL),

-- May 13 (Wed) - Split day
('Coastal Towns Drive', 'Adam & Gina drive to the Ligurian coast — Cinque Terre or nearby coastal towns.', '2026-05-13', '09:00', 'excursion', NULL, NULL),
('Gravel Bike Tour', 'Brian & Mark hit the gravel roads on a guided bike tour through Tuscany.', '2026-05-13', '09:00', 'excursion', 'Bike Tour Tuscany', 'https://www.bike-tour-tuscany.it/en/bike-tours-tuscany/one-day-bike-tours-in-tuscany/'),

-- May 14 (Thu) - Open day
('Open Day', 'No group plans — explore on your own, revisit a favorite spot, or just relax.', '2026-05-14', NULL, 'open_day', NULL, NULL),

-- May 15 (Fri) - Hot springs + birthday
('Hot Springs', 'Group trip to natural hot springs (Saturnia or Bagno Vignoni).', '2026-05-15', '10:00', 'excursion', NULL, NULL),
('Mark''s Birthday Dinner', 'Birthday dinner for Mark! Restaurant TBD — somewhere special.', '2026-05-15', '19:30', 'dinner', NULL, NULL),

-- May 16 (Sat) - Departure
('Drop Off Rental Car', 'Return the rental car in Florence before flights home.', '2026-05-16', '09:00', 'travel', NULL, NULL),
('Fly Home', 'Flights home from Florence. Until next time, Tuscany!', '2026-05-16', '12:00', 'travel', NULL, NULL);
