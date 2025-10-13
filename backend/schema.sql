-- FreelancePay Database Schema
-- Run this in Supabase SQL Editor

-- jobs table tracks all freelance jobs
create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  chain_job_id bigint,
  client_address text not null,
  freelancer_address text not null,
  amount numeric not null,
  title text not null,
  description text,
  category text,
  status text default 'pending_blockchain',
  work_url text,
  deliverable_type text,
  ai_approved boolean,
  ai_analysis text,
  tx_hash text,
  created_at timestamp default now(),
  submitted_at timestamp,
  verified_at timestamp,
  completed_at timestamp
);

-- indexes for faster queries
create index if not exists idx_jobs_client on jobs(client_address);
create index if not exists idx_jobs_freelancer on jobs(freelancer_address);
create index if not exists idx_jobs_status on jobs(status);
create index if not exists idx_jobs_chain_id on jobs(chain_job_id);

-- users table for profiles and stats
create table if not exists users (
  address text primary key,
  username text,
  bio text,
  skills text[],
  rating numeric default 0,
  total_earned numeric default 0,
  total_spent numeric default 0,
  jobs_completed integer default 0,
  created_at timestamp default now()
);

-- reviews table for feedback
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references jobs(id),
  from_address text references users(address),
  to_address text references users(address),
  rating integer check (rating between 1 and 5),
  comment text,
  created_at timestamp default now()
);

-- enable row level security (optional, for production)
-- alter table jobs enable row level security;
-- alter table users enable row level security;
-- alter table reviews enable row level security;
