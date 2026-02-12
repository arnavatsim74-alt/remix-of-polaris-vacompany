
-- Create bonus_card_tiers table for dynamic card management
CREATE TABLE public.bonus_card_tiers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  min_hours INTEGER NOT NULL DEFAULT 0,
  text_color TEXT NOT NULL DEFAULT 'text-white',
  card_image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.bonus_card_tiers ENABLE ROW LEVEL SECURITY;

-- Everyone can read tiers
CREATE POLICY "Anyone can read bonus card tiers"
ON public.bonus_card_tiers FOR SELECT
USING (true);

-- Only admins can manage tiers
CREATE POLICY "Admins can insert bonus card tiers"
ON public.bonus_card_tiers FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update bonus card tiers"
ON public.bonus_card_tiers FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete bonus card tiers"
ON public.bonus_card_tiers FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Seed default tiers
INSERT INTO public.bonus_card_tiers (name, min_hours, text_color, sort_order) VALUES
('Premium', 200, 'text-black', 1),
('Essential', 400, 'text-black', 2),
('Gold', 600, 'text-black', 3),
('Card Platina', 1200, 'text-white', 4),
('Prestige', 2000, 'text-white', 5),
('Black', 4000, 'text-white', 6);

-- Add admin email
INSERT INTO public.approved_admin_emails (email) VALUES ('arnav4op@gmail.com')
ON CONFLICT DO NOTHING;

-- Create storage bucket for bonus card images
INSERT INTO storage.buckets (id, name, public) VALUES ('bonus-card-images', 'bonus-card-images', true)
ON CONFLICT DO NOTHING;

-- Storage policies for bonus card images
CREATE POLICY "Anyone can view bonus card images"
ON storage.objects FOR SELECT
USING (bucket_id = 'bonus-card-images');

CREATE POLICY "Admins can upload bonus card images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'bonus-card-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update bonus card images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'bonus-card-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete bonus card images"
ON storage.objects FOR DELETE
USING (bucket_id = 'bonus-card-images' AND public.has_role(auth.uid(), 'admin'));
