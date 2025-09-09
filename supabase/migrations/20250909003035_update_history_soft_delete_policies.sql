-- Update existing history RLS policies to handle soft delete
-- This migration updates policies to exclude soft-deleted history records (status = 0)

-- Drop existing policies
drop policy if exists "history_select_own" on public.history;
drop policy if exists "history_update_own" on public.history;
drop policy if exists "history_delete_own" on public.history;

-- Recreate policies with soft delete support
-- Select: only owner can read active history records (status = 1)
create policy "history_select_own"
on public.history
for select
using (auth.uid() = user_id and status = 1);

-- Insert: only owner can insert their row
create policy "history_insert_own"
on public.history
for insert
with check (auth.uid() = user_id);

-- Update: only owner can update their row (including soft delete)
create policy "history_update_own"
on public.history
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Remove delete policy since we use soft delete (UPDATE status = 0)
-- No delete policy needed as we use UPDATE for soft delete

-- Add trigger to automatically soft delete history records when customer is soft deleted
-- This trigger will set history.status = 0 when customer.status = 0
create or replace function soft_delete_customer_history()
returns trigger as $$
begin
  if OLD.status = 1 and NEW.status = 0 then
    -- Customer is being soft deleted, soft delete all their history
    update public.history 
    set status = 0 
    where customer_id = NEW.id and status = 1;
  end if;
  return NEW;
end;
$$ language plpgsql security definer;

-- Create trigger on customer table
drop trigger if exists trigger_soft_delete_customer_history on public.customer;
create trigger trigger_soft_delete_customer_history
  after update on public.customer
  for each row
  execute function soft_delete_customer_history();