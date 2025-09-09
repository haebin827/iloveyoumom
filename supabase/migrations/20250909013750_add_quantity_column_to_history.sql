-- Add quantity column to history table
-- This migration adds a quantity column to store product quantities separately from product names

-- Add quantity column with default value of 1
alter table public.history 
add column quantity integer default 1;

-- Set quantity to 1 for existing records
update public.history 
set quantity = 1 
where quantity is null;