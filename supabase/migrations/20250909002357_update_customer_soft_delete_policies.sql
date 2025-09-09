-- Update existing customer RLS policies to handle soft delete
-- This migration updates policies to exclude soft-deleted customers (status = 0)

-- Drop existing policies
drop policy if exists "customer_select_own" on public.customer;
drop policy if exists "customer_update_own" on public.customer;
drop policy if exists "customer_delete_own" on public.customer;

-- Recreate policies with soft delete support
-- Select: only owner can read active customers (status = 1)
create policy "customer_select_own"
on public.customer
for select
using (auth.uid() = user_id and status = 1);

-- Insert: only owner can insert their row
create policy "customer_insert_own"
on public.customer
for insert
with check (auth.uid() = user_id);

-- Update: only owner can update their row (including soft delete)
create policy "customer_update_own"
on public.customer
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Remove delete policy since we use soft delete (UPDATE status = 0)
-- No delete policy needed as we use UPDATE for soft delete