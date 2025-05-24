-- Prevent two users from having the same username
ALTER TABLE public.profiles
ADD CONSTRAINT profiles_user_name_unique
UNIQUE (user_name);
