create table echoes (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  excerpt text not null,
  content text not null,       -- full post body
  created_at timestamptz default now(),
  updated_at timestamptz
);
