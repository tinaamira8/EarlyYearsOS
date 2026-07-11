-- EarlyYearsOS Multi-Tenancy Schema
-- Run this in Supabase SQL Editor to set up the database

create extension if not exists "uuid-ossp";

-- ============================================================
-- CORE: Centres & Membership
-- ============================================================

create table centres (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  address text,
  phone text,
  email text,
  approval_number text,
  capacity int default 0,
  created_at timestamptz default now()
);

alter table centres enable row level security;

create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  name text,
  plan text default 'free',
  created_at timestamptz default now()
);

alter table profiles enable row level security;

-- Join table: which users belong to which centres, with role
create table centre_members (
  id uuid default uuid_generate_v4() primary key,
  centre_id uuid references centres(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  role text not null default 'Educator',
  invited_at timestamptz default now(),
  unique(centre_id, user_id)
);

alter table centre_members enable row level security;

-- Helper: check if the current user is a member of a centre
create or replace function is_centre_member(cid uuid)
returns boolean as $$
  select exists (
    select 1 from centre_members
    where centre_id = cid and user_id = auth.uid()
  );
$$ language sql security definer stable;

-- Helper: check if the current user is admin/director at a centre
create or replace function is_centre_admin(cid uuid)
returns boolean as $$
  select exists (
    select 1 from centre_members
    where centre_id = cid
      and user_id = auth.uid()
      and role in ('Admin', 'Director', 'DirectorGeneral')
  );
$$ language sql security definer stable;

-- Profiles: users can read/update their own profile
create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = id);

-- Centres: visible to members, editable by admins
create policy "Members can view centre"
  on centres for select using (is_centre_member(id));
create policy "Admins can update centre"
  on centres for update using (is_centre_admin(id));
create policy "Any authenticated user can create a centre"
  on centres for insert with check (auth.uid() is not null);

-- Centre members: visible to fellow members, managed by admins
create policy "Members can view memberships"
  on centre_members for select using (is_centre_member(centre_id));
create policy "Admins can insert members"
  on centre_members for insert with check (is_centre_admin(centre_id));
create policy "Admins can update members"
  on centre_members for update using (is_centre_admin(centre_id));
create policy "Admins can delete members"
  on centre_members for delete using (is_centre_admin(centre_id));
-- Allow self-insert for centre creators
create policy "Creator can join own centre"
  on centre_members for insert with check (auth.uid() = user_id);

-- ============================================================
-- CHILDREN & FAMILIES
-- ============================================================

create table children (
  id uuid default uuid_generate_v4() primary key,
  centre_id uuid references centres(id) on delete cascade not null,
  name text not null,
  birthday date,
  room_id uuid,
  medical_condition text,
  severity text default 'Low',
  allergies jsonb default '[]'::jsonb,
  medication text,
  action_plan_date date,
  immunization_expiry date,
  parent_id uuid references profiles(id),
  created_at timestamptz default now()
);

alter table children enable row level security;
create policy "Members can view children" on children for select using (is_centre_member(centre_id));
create policy "Members can insert children" on children for insert with check (is_centre_member(centre_id));
create policy "Members can update children" on children for update using (is_centre_member(centre_id));
create policy "Admins can delete children" on children for delete using (is_centre_admin(centre_id));

create table waitlist (
  id uuid default uuid_generate_v4() primary key,
  centre_id uuid references centres(id) on delete cascade not null,
  child_name text not null,
  birthday date not null,
  requested_start_date date not null,
  status text not null default 'active',
  created_at timestamptz default now()
);

alter table waitlist enable row level security;
create policy "Members can view waitlist" on waitlist for select using (is_centre_member(centre_id));
create policy "Members can insert waitlist" on waitlist for insert with check (is_centre_member(centre_id));
create policy "Members can update waitlist" on waitlist for update using (is_centre_member(centre_id));
create policy "Admins can delete waitlist" on waitlist for delete using (is_centre_admin(centre_id));

create table collectors (
  id uuid default uuid_generate_v4() primary key,
  centre_id uuid references centres(id) on delete cascade not null,
  child_id uuid references children(id) on delete cascade not null,
  name text not null,
  relationship text not null,
  phone text not null,
  photo_url text,
  pin text,
  permissions jsonb default '["pickup"]'::jsonb,
  is_authorized boolean default true,
  created_at timestamptz default now()
);

alter table collectors enable row level security;
create policy "Members can view collectors" on collectors for select using (is_centre_member(centre_id));
create policy "Members can manage collectors" on collectors for insert with check (is_centre_member(centre_id));
create policy "Members can update collectors" on collectors for update using (is_centre_member(centre_id));
create policy "Admins can delete collectors" on collectors for delete using (is_centre_admin(centre_id));

-- ============================================================
-- ROOMS
-- ============================================================

create table rooms (
  id uuid default uuid_generate_v4() primary key,
  centre_id uuid references centres(id) on delete cascade not null,
  name text not null,
  age_group text,
  capacity int default 0,
  created_at timestamptz default now()
);

alter table rooms enable row level security;
create policy "Members can view rooms" on rooms for select using (is_centre_member(centre_id));
create policy "Admins can manage rooms" on rooms for insert with check (is_centre_admin(centre_id));
create policy "Admins can update rooms" on rooms for update using (is_centre_admin(centre_id));
create policy "Admins can delete rooms" on rooms for delete using (is_centre_admin(centre_id));

-- ============================================================
-- STAFF
-- ============================================================

create table staff (
  id uuid default uuid_generate_v4() primary key,
  centre_id uuid references centres(id) on delete cascade not null,
  name text not null,
  role text,
  wwcc text,
  wwcc_expiry date,
  first_aid text,
  first_aid_expiry date,
  cpr text,
  cpr_expiry date,
  employee_id text,
  pin text,
  created_at timestamptz default now()
);

alter table staff enable row level security;
create policy "Members can view staff" on staff for select using (is_centre_member(centre_id));
create policy "Admins can insert staff" on staff for insert with check (is_centre_admin(centre_id));
create policy "Admins can update staff" on staff for update using (is_centre_admin(centre_id));
create policy "Admins can delete staff" on staff for delete using (is_centre_admin(centre_id));

create table rosters (
  id uuid default uuid_generate_v4() primary key,
  centre_id uuid references centres(id) on delete cascade not null,
  week_starting date not null,
  data jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

alter table rosters enable row level security;
create policy "Members can view rosters" on rosters for select using (is_centre_member(centre_id));
create policy "Admins can manage rosters" on rosters for insert with check (is_centre_admin(centre_id));
create policy "Admins can update rosters" on rosters for update using (is_centre_admin(centre_id));

-- ============================================================
-- OBSERVATIONS & DOCUMENTATION
-- ============================================================

create table observations (
  id uuid default uuid_generate_v4() primary key,
  centre_id uuid references centres(id) on delete cascade not null,
  child_id uuid references children(id) on delete set null,
  child_name text not null,
  educator_id uuid references profiles(id),
  educator_name text,
  title text,
  data jsonb default '{}'::jsonb,
  photos jsonb default '[]'::jsonb,
  date date default current_date,
  status text default 'draft',
  created_at timestamptz default now()
);

alter table observations enable row level security;
create policy "Members can view observations" on observations for select using (is_centre_member(centre_id));
create policy "Members can insert observations" on observations for insert with check (is_centre_member(centre_id));
create policy "Members can update observations" on observations for update using (is_centre_member(centre_id));
create policy "Admins can delete observations" on observations for delete using (is_centre_admin(centre_id));

create table saved_documents (
  id uuid default uuid_generate_v4() primary key,
  centre_id uuid references centres(id) on delete cascade not null,
  type text not null,
  title text,
  data jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

alter table saved_documents enable row level security;
create policy "Members can view documents" on saved_documents for select using (is_centre_member(centre_id));
create policy "Members can insert documents" on saved_documents for insert with check (is_centre_member(centre_id));
create policy "Members can update documents" on saved_documents for update using (is_centre_member(centre_id));
create policy "Admins can delete documents" on saved_documents for delete using (is_centre_admin(centre_id));

create table curriculum_boards (
  id uuid default uuid_generate_v4() primary key,
  centre_id uuid references centres(id) on delete cascade not null,
  room_id uuid references rooms(id) on delete set null,
  room_name text,
  week_starting date not null,
  data jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

alter table curriculum_boards enable row level security;
create policy "Members can view boards" on curriculum_boards for select using (is_centre_member(centre_id));
create policy "Members can insert boards" on curriculum_boards for insert with check (is_centre_member(centre_id));
create policy "Members can update boards" on curriculum_boards for update using (is_centre_member(centre_id));

-- ============================================================
-- DAILY OPERATIONS
-- ============================================================

create table daily_logs (
  id uuid default uuid_generate_v4() primary key,
  centre_id uuid references centres(id) on delete cascade not null,
  date date not null default current_date,
  type text not null,
  data jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

alter table daily_logs enable row level security;
create policy "Members can view logs" on daily_logs for select using (is_centre_member(centre_id));
create policy "Members can insert logs" on daily_logs for insert with check (is_centre_member(centre_id));
create policy "Members can update logs" on daily_logs for update using (is_centre_member(centre_id));
create policy "Members can delete logs" on daily_logs for delete using (is_centre_member(centre_id));

create table incidents (
  id uuid default uuid_generate_v4() primary key,
  centre_id uuid references centres(id) on delete cascade not null,
  child_id uuid references children(id) on delete set null,
  child_name text not null,
  date date not null,
  time text,
  location text,
  type text,
  description text not null,
  injury_details text,
  body_area text,
  first_aid text,
  action_taken text,
  educator_on_duty text,
  witnesses text,
  parent_notified boolean default false,
  parent_notified_time text,
  parent_signature text,
  staff_signature text,
  status text default 'open',
  created_at timestamptz default now()
);

alter table incidents enable row level security;
create policy "Members can view incidents" on incidents for select using (is_centre_member(centre_id));
create policy "Members can insert incidents" on incidents for insert with check (is_centre_member(centre_id));
create policy "Members can update incidents" on incidents for update using (is_centre_member(centre_id));

create table sleep_sessions (
  id uuid default uuid_generate_v4() primary key,
  centre_id uuid references centres(id) on delete cascade not null,
  child_id uuid references children(id) on delete cascade,
  child_name text not null,
  start_time timestamptz not null,
  end_time timestamptz,
  last_check_time timestamptz,
  status text default 'sleeping',
  checks jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

alter table sleep_sessions enable row level security;
create policy "Members can view sleep" on sleep_sessions for select using (is_centre_member(centre_id));
create policy "Members can insert sleep" on sleep_sessions for insert with check (is_centre_member(centre_id));
create policy "Members can update sleep" on sleep_sessions for update using (is_centre_member(centre_id));

-- ============================================================
-- COMPLIANCE & SAFETY
-- ============================================================

create table emergency_drills (
  id uuid default uuid_generate_v4() primary key,
  centre_id uuid references centres(id) on delete cascade not null,
  type text not null,
  date date not null,
  start_time text,
  end_time text,
  duration text,
  staff_involved jsonb default '[]'::jsonb,
  children_involved int default 0,
  location text,
  notes text,
  success boolean default true,
  created_at timestamptz default now()
);

alter table emergency_drills enable row level security;
create policy "Members can view drills" on emergency_drills for select using (is_centre_member(centre_id));
create policy "Members can insert drills" on emergency_drills for insert with check (is_centre_member(centre_id));
create policy "Members can update drills" on emergency_drills for update using (is_centre_member(centre_id));

create table policies (
  id uuid default uuid_generate_v4() primary key,
  centre_id uuid references centres(id) on delete cascade not null,
  title text not null,
  category text,
  version text default '1.0',
  status text default 'draft',
  last_reviewed date,
  next_review_date date,
  file_url text,
  description text,
  created_at timestamptz default now()
);

alter table policies enable row level security;
create policy "Members can view policies" on policies for select using (is_centre_member(centre_id));
create policy "Admins can manage policies" on policies for insert with check (is_centre_admin(centre_id));
create policy "Admins can update policies" on policies for update using (is_centre_admin(centre_id));

create table policy_signoffs (
  id uuid default uuid_generate_v4() primary key,
  policy_id uuid references policies(id) on delete cascade not null,
  staff_id uuid references staff(id) on delete cascade,
  staff_name text not null,
  signed_at timestamptz default now(),
  version text
);

alter table policy_signoffs enable row level security;
create policy "Members can view signoffs" on policy_signoffs for select
  using (exists (
    select 1 from policies p where p.id = policy_id and is_centre_member(p.centre_id)
  ));
create policy "Members can insert signoffs" on policy_signoffs for insert
  with check (exists (
    select 1 from policies p where p.id = policy_id and is_centre_member(p.centre_id)
  ));

-- ============================================================
-- HEALTH RECORDS
-- ============================================================

create table health_records (
  id uuid default uuid_generate_v4() primary key,
  child_id uuid references children(id) on delete cascade not null,
  child_name text,
  centre_id uuid references centres(id) on delete cascade not null,
  immunization_status text default 'pending',
  air_statement_expiry date,
  medical_action_plan_type text default 'none',
  medical_action_plan_expiry date,
  last_reminder_sent timestamptz,
  notes text,
  created_at timestamptz default now()
);

alter table health_records enable row level security;
create policy "Members can view health" on health_records for select using (is_centre_member(centre_id));
create policy "Members can insert health" on health_records for insert with check (is_centre_member(centre_id));
create policy "Members can update health" on health_records for update using (is_centre_member(centre_id));

create table inclusion_profiles (
  id uuid default uuid_generate_v4() primary key,
  centre_id uuid references centres(id) on delete cascade not null,
  child_id uuid references children(id) on delete cascade not null,
  diagnosis text,
  support_needs text,
  funding_status text default 'not_applied',
  funding_expiry date,
  last_review_date date,
  created_at timestamptz default now()
);

alter table inclusion_profiles enable row level security;
create policy "Members can view inclusion" on inclusion_profiles for select using (is_centre_member(centre_id));
create policy "Members can insert inclusion" on inclusion_profiles for insert with check (is_centre_member(centre_id));
create policy "Members can update inclusion" on inclusion_profiles for update using (is_centre_member(centre_id));

-- ============================================================
-- COMMUNICATION
-- ============================================================

create table messages (
  id uuid default uuid_generate_v4() primary key,
  centre_id uuid references centres(id) on delete cascade not null,
  sender_id uuid references profiles(id),
  sender_name text,
  receiver_id uuid references profiles(id),
  content text not null,
  read boolean default false,
  created_at timestamptz default now()
);

alter table messages enable row level security;
create policy "Members can view messages" on messages for select using (is_centre_member(centre_id));
create policy "Members can send messages" on messages for insert with check (is_centre_member(centre_id));
create policy "Members can update messages" on messages for update using (is_centre_member(centre_id));

create table notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  content text,
  type text default 'general',
  link text,
  read boolean default false,
  created_at timestamptz default now()
);

alter table notifications enable row level security;
create policy "Users can view own notifications" on notifications for select using (auth.uid() = user_id);
create policy "System can insert notifications" on notifications for insert with check (true);
create policy "Users can update own notifications" on notifications for update using (auth.uid() = user_id);

-- ============================================================
-- ENQUIRIES (public insert for lead capture)
-- ============================================================

create table enquiries (
  id uuid default uuid_generate_v4() primary key,
  centre_id uuid references centres(id) on delete cascade not null,
  parent_name text not null,
  child_name text not null,
  child_dob date not null,
  email text not null,
  phone text not null,
  status text not null default 'new',
  notes text,
  created_at timestamptz default now()
);

alter table enquiries enable row level security;
create policy "Public can insert enquiries" on enquiries for insert with check (true);
create policy "Members can view enquiries" on enquiries for select using (is_centre_member(centre_id));
create policy "Members can update enquiries" on enquiries for update using (is_centre_member(centre_id));

-- ============================================================
-- FINANCE
-- ============================================================

create table invoices (
  id uuid default uuid_generate_v4() primary key,
  centre_id uuid references centres(id) on delete cascade not null,
  parent_id uuid references profiles(id),
  parent_name text,
  child_id uuid references children(id) on delete set null,
  child_name text,
  amount numeric(10,2) not null,
  due_date date,
  status text default 'draft',
  items jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

alter table invoices enable row level security;
create policy "Members can view invoices" on invoices for select using (is_centre_member(centre_id));
create policy "Admins can insert invoices" on invoices for insert with check (is_centre_admin(centre_id));
create policy "Admins can update invoices" on invoices for update using (is_centre_admin(centre_id));
-- Parents can view their own invoices
create policy "Parents can view own invoices" on invoices for select using (auth.uid() = parent_id);

create table expenses (
  id uuid default uuid_generate_v4() primary key,
  centre_id uuid references centres(id) on delete cascade not null,
  date date not null,
  category text not null,
  amount numeric(10,2) not null,
  description text,
  status text default 'Pending',
  receipt_url text,
  created_at timestamptz default now()
);

alter table expenses enable row level security;
create policy "Members can view expenses" on expenses for select using (is_centre_member(centre_id));
create policy "Admins can manage expenses" on expenses for insert with check (is_centre_admin(centre_id));
create policy "Admins can update expenses" on expenses for update using (is_centre_admin(centre_id));

-- ============================================================
-- OPERATIONS
-- ============================================================

create table inventory (
  id uuid default uuid_generate_v4() primary key,
  centre_id uuid references centres(id) on delete cascade not null,
  name text not null,
  category text,
  current_stock int default 0,
  min_stock int default 0,
  unit text,
  last_restocked date,
  updated_at timestamptz default now()
);

alter table inventory enable row level security;
create policy "Members can view inventory" on inventory for select using (is_centre_member(centre_id));
create policy "Members can manage inventory" on inventory for insert with check (is_centre_member(centre_id));
create policy "Members can update inventory" on inventory for update using (is_centre_member(centre_id));

create table assets (
  id uuid default uuid_generate_v4() primary key,
  centre_id uuid references centres(id) on delete cascade not null,
  name text not null,
  category text,
  location text,
  purchase_date date,
  last_inspected date,
  next_inspection date,
  status text default 'Functional',
  created_at timestamptz default now()
);

alter table assets enable row level security;
create policy "Members can view assets" on assets for select using (is_centre_member(centre_id));
create policy "Members can manage assets" on assets for insert with check (is_centre_member(centre_id));
create policy "Members can update assets" on assets for update using (is_centre_member(centre_id));

create table maintenance_requests (
  id uuid default uuid_generate_v4() primary key,
  centre_id uuid references centres(id) on delete cascade not null,
  title text not null,
  description text,
  location text,
  priority text default 'medium',
  status text default 'pending',
  reported_by uuid references profiles(id),
  reported_by_name text,
  assigned_to uuid references staff(id),
  assigned_to_name text,
  due_date date,
  completed_at timestamptz,
  notes text,
  created_at timestamptz default now()
);

alter table maintenance_requests enable row level security;
create policy "Members can view maintenance" on maintenance_requests for select using (is_centre_member(centre_id));
create policy "Members can insert maintenance" on maintenance_requests for insert with check (is_centre_member(centre_id));
create policy "Members can update maintenance" on maintenance_requests for update using (is_centre_member(centre_id));

create table events (
  id uuid default uuid_generate_v4() primary key,
  centre_id uuid references centres(id) on delete cascade not null,
  title text not null,
  description text,
  date date not null,
  start_time text,
  end_time text,
  category text default 'other',
  location text,
  created_at timestamptz default now()
);

alter table events enable row level security;
create policy "Members can view events" on events for select using (is_centre_member(centre_id));
create policy "Members can insert events" on events for insert with check (is_centre_member(centre_id));
create policy "Members can update events" on events for update using (is_centre_member(centre_id));

-- ============================================================
-- SUSTAINABILITY
-- ============================================================

create table sustainability_audits (
  id uuid default uuid_generate_v4() primary key,
  centre_id uuid references centres(id) on delete cascade not null,
  category text not null,
  metric text not null,
  value numeric not null,
  unit text,
  recorded_by text,
  is_child_led boolean default false,
  notes text,
  created_at timestamptz default now()
);

alter table sustainability_audits enable row level security;
create policy "Members can view audits" on sustainability_audits for select using (is_centre_member(centre_id));
create policy "Members can insert audits" on sustainability_audits for insert with check (is_centre_member(centre_id));

-- ============================================================
-- CHEF & MENUS
-- ============================================================

create table menus (
  id uuid default uuid_generate_v4() primary key,
  centre_id uuid references centres(id) on delete cascade not null,
  name text,
  week_number int,
  data jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

alter table menus enable row level security;
create policy "Members can view menus" on menus for select using (is_centre_member(centre_id));
create policy "Members can manage menus" on menus for insert with check (is_centre_member(centre_id));
create policy "Members can update menus" on menus for update using (is_centre_member(centre_id));

-- ============================================================
-- COMMUNITY
-- ============================================================

create table community_posts (
  id uuid default uuid_generate_v4() primary key,
  centre_id uuid references centres(id) on delete cascade not null,
  author_id uuid references profiles(id),
  author_name text,
  category text default 'general',
  title text not null,
  content text,
  media_url text,
  comments jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

alter table community_posts enable row level security;
create policy "Members can view posts" on community_posts for select using (is_centre_member(centre_id));
create policy "Members can insert posts" on community_posts for insert with check (is_centre_member(centre_id));
create policy "Members can update posts" on community_posts for update using (is_centre_member(centre_id));

-- ============================================================
-- PROFESSIONAL DEVELOPMENT
-- ============================================================

create table pd_portfolio (
  id uuid default uuid_generate_v4() primary key,
  staff_id uuid references staff(id) on delete cascade,
  staff_name text,
  centre_id uuid references centres(id) on delete cascade not null,
  title text not null,
  provider text,
  date date,
  hours numeric default 0,
  category text,
  nqs_standards jsonb default '[]'::jsonb,
  reflection text,
  impact_on_practice text,
  evidence_urls jsonb default '[]'::jsonb,
  status text default 'draft',
  feedback text,
  created_at timestamptz default now()
);

alter table pd_portfolio enable row level security;
create policy "Members can view pd" on pd_portfolio for select using (is_centre_member(centre_id));
create policy "Members can insert pd" on pd_portfolio for insert with check (is_centre_member(centre_id));
create policy "Members can update pd" on pd_portfolio for update using (is_centre_member(centre_id));

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================

insert into storage.buckets (id, name, public) values ('observations', 'observations', false) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('journal', 'journal', false) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('documents', 'documents', false) on conflict do nothing;

-- Storage policies: authenticated users can upload and view
create policy "Authenticated users can upload to observations"
  on storage.objects for insert
  with check (bucket_id = 'observations' and auth.uid() is not null);

create policy "Authenticated users can view observation photos"
  on storage.objects for select
  using (bucket_id = 'observations' and auth.uid() is not null);

create policy "Authenticated users can upload to journal"
  on storage.objects for insert
  with check (bucket_id = 'journal' and auth.uid() is not null);

create policy "Authenticated users can view journal photos"
  on storage.objects for select
  using (bucket_id = 'journal' and auth.uid() is not null);

create policy "Authenticated users can upload documents"
  on storage.objects for insert
  with check (bucket_id = 'documents' and auth.uid() is not null);

create policy "Authenticated users can view documents"
  on storage.objects for select
  using (bucket_id = 'documents' and auth.uid() is not null);

-- ============================================================
-- INDEXES for performance
-- ============================================================

create index idx_centre_members_user on centre_members(user_id);
create index idx_centre_members_centre on centre_members(centre_id);
create index idx_children_centre on children(centre_id);
create index idx_observations_centre on observations(centre_id);
create index idx_observations_child on observations(child_id);
create index idx_daily_logs_centre_date on daily_logs(centre_id, date);
create index idx_incidents_centre on incidents(centre_id);
create index idx_staff_centre on staff(centre_id);
create index idx_messages_centre on messages(centre_id);
create index idx_invoices_centre on invoices(centre_id);
create index idx_invoices_parent on invoices(parent_id);

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP (trigger)
-- ============================================================

create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, email, name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================================
-- ADDITIONAL TABLES (referenced in code, need RLS)
-- ============================================================

create table if not exists audit_logs (
  id uuid default uuid_generate_v4() primary key,
  centre_id uuid references centres(id) on delete cascade,
  user_id uuid references profiles(id),
  action text not null,
  resource text not null,
  details jsonb,
  ip_address text,
  user_agent text,
  timestamp timestamptz default now(),
  created_at timestamptz default now()
);
alter table audit_logs enable row level security;
create policy "Admins can view audit logs" on audit_logs for select using (is_centre_admin(centre_id));
create policy "System can insert audit logs" on audit_logs for insert with check (true);

create table if not exists sips (
  id uuid default uuid_generate_v4() primary key,
  centre_id uuid references centres(id) on delete cascade not null,
  child_id uuid references children(id) on delete cascade,
  data jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);
alter table sips enable row level security;
create policy "Members can view sips" on sips for select using (is_centre_member(centre_id));
create policy "Members can insert sips" on sips for insert with check (is_centre_member(centre_id));
create policy "Members can update sips" on sips for update using (is_centre_member(centre_id));

create table if not exists specialist_visits (
  id uuid default uuid_generate_v4() primary key,
  centre_id uuid references centres(id) on delete cascade not null,
  child_id uuid references children(id) on delete cascade,
  data jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);
alter table specialist_visits enable row level security;
create policy "Members can view specialist_visits" on specialist_visits for select using (is_centre_member(centre_id));
create policy "Members can insert specialist_visits" on specialist_visits for insert with check (is_centre_member(centre_id));
create policy "Members can update specialist_visits" on specialist_visits for update using (is_centre_member(centre_id));

create table if not exists child_voice (
  id uuid default uuid_generate_v4() primary key,
  centre_id uuid references centres(id) on delete cascade not null,
  child_id uuid references children(id) on delete cascade,
  data jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);
alter table child_voice enable row level security;
create policy "Members can view child_voice" on child_voice for select using (is_centre_member(centre_id));
create policy "Members can insert child_voice" on child_voice for insert with check (is_centre_member(centre_id));
create policy "Members can update child_voice" on child_voice for update using (is_centre_member(centre_id));

create table if not exists sustainability_goals (
  id uuid default uuid_generate_v4() primary key,
  centre_id uuid references centres(id) on delete cascade not null,
  data jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);
alter table sustainability_goals enable row level security;
create policy "Members can view sustainability_goals" on sustainability_goals for select using (is_centre_member(centre_id));
create policy "Members can insert sustainability_goals" on sustainability_goals for insert with check (is_centre_member(centre_id));
create policy "Members can update sustainability_goals" on sustainability_goals for update using (is_centre_member(centre_id));

create table if not exists landing_page_configs (
  id uuid default uuid_generate_v4() primary key,
  centre_id uuid references centres(id) on delete cascade not null,
  data jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);
alter table landing_page_configs enable row level security;
create policy "Members can view landing_page_configs" on landing_page_configs for select using (is_centre_member(centre_id));
create policy "Admins can insert landing_page_configs" on landing_page_configs for insert with check (is_centre_admin(centre_id));
create policy "Admins can update landing_page_configs" on landing_page_configs for update using (is_centre_admin(centre_id));

create table if not exists maintenance_logs (
  id uuid default uuid_generate_v4() primary key,
  centre_id uuid references centres(id) on delete cascade not null,
  data jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);
alter table maintenance_logs enable row level security;
create policy "Members can view maintenance_logs" on maintenance_logs for select using (is_centre_member(centre_id));
create policy "Members can insert maintenance_logs" on maintenance_logs for insert with check (is_centre_member(centre_id));
create policy "Members can update maintenance_logs" on maintenance_logs for update using (is_centre_member(centre_id));

create table if not exists resources (
  id uuid default uuid_generate_v4() primary key,
  centre_id uuid references centres(id) on delete cascade not null,
  name text not null,
  category text,
  data jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);
alter table resources enable row level security;
create policy "Members can view resources" on resources for select using (is_centre_member(centre_id));
create policy "Members can insert resources" on resources for insert with check (is_centre_member(centre_id));
create policy "Members can update resources" on resources for update using (is_centre_member(centre_id));

create table if not exists resource_bookings (
  id uuid default uuid_generate_v4() primary key,
  centre_id uuid references centres(id) on delete cascade not null,
  resource_id uuid references resources(id) on delete cascade,
  data jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);
alter table resource_bookings enable row level security;
create policy "Members can view resource_bookings" on resource_bookings for select using (is_centre_member(centre_id));
create policy "Members can insert resource_bookings" on resource_bookings for insert with check (is_centre_member(centre_id));
create policy "Members can update resource_bookings" on resource_bookings for update using (is_centre_member(centre_id));

create table if not exists wellbeing_moods (
  id uuid default uuid_generate_v4() primary key,
  centre_id uuid references centres(id) on delete cascade not null,
  child_id uuid references children(id) on delete cascade,
  data jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);
alter table wellbeing_moods enable row level security;
create policy "Members can view wellbeing_moods" on wellbeing_moods for select using (is_centre_member(centre_id));
create policy "Members can insert wellbeing_moods" on wellbeing_moods for insert with check (is_centre_member(centre_id));
create policy "Members can update wellbeing_moods" on wellbeing_moods for update using (is_centre_member(centre_id));

create table if not exists family_audit_logs (
  id uuid default uuid_generate_v4() primary key,
  centre_id uuid references centres(id) on delete cascade not null,
  user_id uuid references profiles(id),
  action text not null,
  details jsonb,
  created_at timestamptz default now()
);
alter table family_audit_logs enable row level security;
create policy "Members can view family_audit_logs" on family_audit_logs for select using (is_centre_member(centre_id));
create policy "System can insert family_audit_logs" on family_audit_logs for insert with check (true);
