-- Create custom types
create type public.user_role as enum ('Admin', 'User');
create type public.contract_status as enum ('Sent', 'Signed', 'In Progress', 'Renewed', 'Finished');
create type public.payment_status as enum ('Upcoming', 'Paid', 'Overdue');
create type public.maintenance_request_status as enum ('Submitted', 'In Progress', 'Completed');
create type public.maintenance_initiator as enum ('Tenant', 'Landlord');

-- USERS Table: Stores public user data
create table public.users (
  id uuid not null references auth.users(id) on delete cascade primary key,
  name text,
  email text,
  avatar text,
  role user_role not null
);
comment on table public.users is 'Public user data, synced from auth.users';

-- VENDORS Table
create table public.vendors (
    id uuid not null default gen_random_uuid() primary key,
    name text not null,
    contact_email text,
    specialty text
);
comment on table public.vendors is 'Third-party vendors for maintenance';

-- PROPERTIES Table
create table public.properties (
  id uuid not null default gen_random_uuid() primary key,
  name text not null,
  address text not null,
  image_url text,
  owner_id uuid references public.users(id) on delete cascade not null
);
comment on table public.properties is 'Rental properties managed in the app';

-- CONTRACTS Table
create table public.contracts (
  id uuid not null default gen_random_uuid() primary key,
  property_id uuid references public.properties(id) on delete cascade not null,
  landlord_id uuid references public.users(id) on delete cascade not null,
  tenant_id uuid references public.users(id) on delete cascade not null,
  start_date date not null,
  end_date date not null,
  status contract_status not null,
  rent_amount numeric(10, 2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
comment on table public.contracts is 'Rental agreements for properties';

-- PAYMENTS Table
create table public.payments (
  id uuid not null default gen_random_uuid() primary key,
  contract_id uuid references public.contracts(id) on delete cascade not null,
  property_id uuid references public.properties(id) on delete cascade not null,
  amount numeric(10, 2) not null,
  due_date date not null,
  status payment_status not null,
  paid_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
comment on table public.payments is 'Payment history for contracts';

-- MAINTENANCE_REQUESTS Table
create table public.maintenance_requests (
  id uuid not null default gen_random_uuid() primary key,
  property_id uuid references public.properties(id) on delete cascade not null,
  description text not null,
  status maintenance_request_status not null,
  submitted_date date not null,
  initiated_by maintenance_initiator not null,
  assigned_vendor_id uuid references public.vendors(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
comment on table public.maintenance_requests is 'Maintenance requests for properties';

-- MAINTENANCE_ACTIVITIES Table
create table public.maintenance_activities (
    id uuid not null default gen_random_uuid() primary key,
    request_id uuid references public.maintenance_requests(id) on delete cascade not null,
    "timestamp" timestamp with time zone not null,
    description text not null,
    author_id uuid references public.users(id) on delete cascade not null
);
comment on table public.maintenance_activities is 'Log of activities for a maintenance request';

-- COMMUNICATIONS Table
create table public.communications (
    id uuid not null default gen_random_uuid() primary key,
    property_id uuid references public.properties(id) on delete cascade not null,
    user_ids uuid[] not null,
    messages jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
comment on table public.communications is 'Messaging hub for properties';

-- NOTIFICATIONS Table
create table public.notifications (
    id uuid not null default gen_random_uuid() primary key,
    user_id uuid not null references auth.users(id) on delete cascade,
    title text not null,
    description text,
    read boolean default false not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
comment on table public.notifications is 'User-specific notifications';

-- Function to create a public user profile upon new user signup
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, name, email, avatar, role)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email,
    new.raw_user_meta_data->>'avatar_url',
    'User' -- Default role for new users
  );
  return new;
end;
$$;

-- Trigger to execute the function on new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- Helper function to get user role
create function public.get_user_role(user_id uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
begin
  return (select role from users where id = user_id);
end;
$$;


-- POLICIES
-- Enable RLS for all tables
alter table public.users enable row level security;
alter table public.vendors enable row level security;
alter table public.properties enable row level security;
alter table public.contracts enable row level security;
alter table public.payments enable row level security;
alter table public.maintenance_requests enable row level security;
alter table public.maintenance_activities enable row level security;
alter table public.communications enable row level security;
alter table public.notifications enable row level security;

-- Policies for USERS table
create policy "Allow read access to all authenticated users" on public.users for select using (auth.role() = 'authenticated');
create policy "Allow users to update their own profile" on public.users for update using (auth.uid() = id) with check (auth.uid() = id);

-- Policies for PROPERTIES table
create policy "Allow read access to owners and tenants" on public.properties for select using (
    (auth.uid() = owner_id) OR
    (exists(select 1 from contracts where property_id = properties.id and tenant_id = auth.uid()))
);
create policy "Allow full access for owners" on public.properties for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- Policies for CONTRACTS table
create policy "Allow read access to involved parties" on public.contracts for select using (auth.uid() = landlord_id or auth.uid() = tenant_id);
create policy "Allow full access to landlords" on public.contracts for all using (auth.uid() = landlord_id) with check (auth.uid() = landlord_id);

-- Policies for PAYMENTS table
create policy "Allow read access to involved parties" on public.payments for select using (
    exists(select 1 from contracts where id = payments.contract_id and (landlord_id = auth.uid() or tenant_id = auth.uid()))
);
create policy "Allow landlords to manage payments" on public.payments for all using (
    exists(select 1 from contracts where id = payments.contract_id and landlord_id = auth.uid())
) with check (
    exists(select 1 from contracts where id = payments.contract_id and landlord_id = auth.uid())
);

-- Policies for VENDORS table
create policy "Allow read access for all authenticated users" on public.vendors for select using (auth.role() = 'authenticated');
create policy "Allow admins to manage vendors" on public.vendors for all using (get_user_role(auth.uid()) = 'Admin') with check (get_user_role(auth.uid()) = 'Admin');

-- Policies for MAINTENANCE_REQUESTS table
create policy "Allow read access to property owners and tenants" on public.maintenance_requests for select using (
    (exists(select 1 from properties where id = maintenance_requests.property_id and owner_id = auth.uid())) or
    (exists(select 1 from contracts where property_id = maintenance_requests.property_id and tenant_id = auth.uid()))
);
create policy "Allow insert for property owners and tenants" on public.maintenance_requests for insert with check (
    (exists(select 1 from properties where id = maintenance_requests.property_id and owner_id = auth.uid())) or
    (exists(select 1 from contracts where property_id = maintenance_requests.property_id and tenant_id = auth.uid()))
);
create policy "Allow owners to update and delete requests" on public.maintenance_requests for update, delete using (
    exists(select 1 from properties where id = maintenance_requests.property_id and owner_id = auth.uid())
);

-- Policies for MAINTENANCE_ACTIVITIES table
create policy "Allow read access for related users" on public.maintenance_activities for select using (
    exists(select 1 from maintenance_requests where id = maintenance_activities.request_id) -- RLS on maintenance_requests will be checked
);
create policy "Allow users to add activities to accessible requests" on public.maintenance_activities for insert with check (
    author_id = auth.uid() and
    exists(select 1 from maintenance_requests where id = maintenance_activities.request_id)
);
create policy "Allow activity author or property owner to delete" on public.maintenance_activities for delete using (
    (author_id = auth.uid()) or
    (exists(select 1 from maintenance_requests mr join properties p on mr.property_id = p.id where mr.id = maintenance_activities.request_id and p.owner_id = auth.uid()))
);

-- Policies for COMMUNICATIONS table
create policy "Allow access to participants only" on public.communications for all
    using (auth.uid() = any(user_ids))
    with check (auth.uid() = any(user_ids));

-- Policies for NOTIFICATIONS table
create policy "Allow users to manage their own notifications" on public.notifications for all
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);
