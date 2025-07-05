-- Create custom enum types to manage statuses
CREATE TYPE public.contract_status AS ENUM ('Sent', 'Signed', 'In Progress', 'Renewed', 'Finished');
CREATE TYPE public.payment_status AS ENUM ('Upcoming', 'Paid', 'Overdue');
CREATE TYPE public.maintenance_request_status AS ENUM ('Submitted', 'In Progress', 'Completed');
CREATE TYPE public.user_role AS ENUM ('Admin', 'User');

-- PROFILES table to store user data, linked to Supabase Auth
CREATE TABLE public.profiles (
    id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name text,
    email text UNIQUE,
    avatar_url text,
    role user_role DEFAULT 'User'::public.user_role,
    updated_at timestamptz,
    created_at timestamptz DEFAULT now()
);

-- VENDORS table for maintenance
CREATE TABLE public.vendors (
    id bigserial PRIMARY KEY,
    name text NOT NULL,
    contact_email text,
    specialty text,
    created_at timestamptz DEFAULT now()
);

-- PROPERTIES table
CREATE TABLE public.properties (
    id bigserial PRIMARY KEY,
    name text NOT NULL,
    address text NOT NULL,
    image_url text,
    owner_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now()
);

-- CONTRACTS table linking properties, landlords, and tenants
CREATE TABLE public.contracts (
    id bigserial PRIMARY KEY,
    property_id bigint NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    landlord_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    tenant_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    start_date date NOT NULL,
    end_date date NOT NULL,
    rent_amount numeric(10, 2) NOT NULL,
    status public.contract_status DEFAULT 'Sent'::public.contract_status,
    created_at timestamptz DEFAULT now()
);

-- PAYMENTS table generated from contracts
CREATE TABLE public.payments (
    id bigserial PRIMARY KEY,
    contract_id bigint NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,
    property_id bigint NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    amount numeric(10, 2) NOT NULL,
    due_date date NOT NULL,
    status public.payment_status DEFAULT 'Upcoming'::public.payment_status,
    paid_date date,
    created_at timestamptz DEFAULT now()
);

-- MAINTENANCE_REQUESTS table
CREATE TABLE public.maintenance_requests (
    id bigserial PRIMARY KEY,
    property_id bigint NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    description text NOT NULL,
    status public.maintenance_request_status DEFAULT 'Submitted'::public.maintenance_request_status,
    submitted_date date NOT NULL DEFAULT CURRENT_DATE,
    initiated_by text,
    assigned_vendor_id bigint REFERENCES public.vendors(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now()
);

-- MAINTENANCE_ACTIVITIES table for logging request history
CREATE TABLE public.maintenance_activities (
    id bigserial PRIMARY KEY,
    request_id bigint NOT NULL REFERENCES public.maintenance_requests(id) ON DELETE CASCADE,
    "timestamp" timestamptz NOT NULL DEFAULT now(),
    description text NOT NULL,
    author_id uuid NOT NULL REFERENCES public.profiles(id),
    created_at timestamptz DEFAULT now()
);

-- Function to automatically create a profile for a new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, avatar_url, role)
    VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', 'User');
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute the function on new user creation
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- Enable Row Level Security (RLS) for all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_activities ENABLE ROW LEVEL SECURITY;


-- RLS POLICIES

-- Profiles: Users can see all profiles, but only update their own.
CREATE POLICY "Allow users to view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow users to update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Vendors: For now, all authenticated users can see vendors.
CREATE POLICY "Allow authenticated users to view vendors" ON public.vendors FOR SELECT USING (auth.role() = 'authenticated');

-- Properties: Users can see properties they own or are a tenant of. Admins can do anything.
CREATE POLICY "Allow full access to admins" ON public.properties
FOR ALL
USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'Admin')
WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'Admin');

CREATE POLICY "Allow users to view their properties" ON public.properties
FOR SELECT
USING (
    owner_id = auth.uid() OR
    id IN (
        SELECT property_id FROM public.contracts WHERE tenant_id = auth.uid()
    )
);

-- Contracts: Users can see contracts where they are the landlord or tenant. Admins can do anything.
CREATE POLICY "Allow full access to admins on contracts" ON public.contracts
FOR ALL
USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'Admin')
WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'Admin');

CREATE POLICY "Allow users to view their contracts" ON public.contracts
FOR SELECT
USING (landlord_id = auth.uid() OR tenant_id = auth.uid());

-- Payments: Users can see payments related to contracts they are part of. Admins can do anything.
CREATE POLICY "Allow full access to admins on payments" ON public.payments
FOR ALL
USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'Admin')
WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'Admin');

CREATE POLICY "Allow users to view their payments" ON public.payments
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.contracts
        WHERE id = payments.contract_id AND (landlord_id = auth.uid() OR tenant_id = auth.uid())
    )
);

-- Maintenance Requests: Users can see requests for properties they own or rent. Admins can do anything.
CREATE POLICY "Allow full access to admins on maintenance" ON public.maintenance_requests
FOR ALL
USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'Admin')
WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'Admin');

CREATE POLICY "Allow users to manage their maintenance requests" ON public.maintenance_requests
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.properties p
        LEFT JOIN public.contracts c ON p.id = c.property_id
        WHERE p.id = maintenance_requests.property_id AND (p.owner_id = auth.uid() OR c.tenant_id = auth.uid())
    )
);

-- Maintenance Activities: Users can see activities for requests they have access to.
CREATE POLICY "Allow users to view maintenance activities" ON public.maintenance_activities
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.maintenance_requests mr
        JOIN public.properties p ON mr.property_id = p.id
        LEFT JOIN public.contracts c ON p.id = c.property_id
        WHERE mr.id = maintenance_activities.request_id AND (p.owner_id = auth.uid() OR c.tenant_id = auth.uid())
    )
);
