# Supabase setup (Customer Portal brand → model → issue → confirm)

This project’s new customer booking flow depends on two catalog tables and customer-scoped RLS on `public.repairs`.

## Required tables

### 1) `public.brands`
```sql
create table if not exists public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  logo_url text,
  created_at timestamptz not null default now()
);
```

### 2) `public.device_models`
```sql
create table if not exists public.device_models (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brands(id) on delete cascade,
  model_name text not null,
  created_at timestamptz not null default now()
);

create index if not exists device_models_brand_id_idx on public.device_models(brand_id);
```

> Note: the frontend also supports a legacy schema where `device_models` has a `brand` text column. Prefer the FK schema above.

## Optional columns for `public.repairs`

The frontend will **work even if these columns do not exist**, but the spec expects them:

```sql
alter table public.repairs
  add column if not exists brand text,
  add column if not exists model text;
```

The booking flow always stores the issue in the existing issue column (`issue` or `issue_description`) and sets:
- `status = 'Booked'`
- customer id column (`customer_user_id` or `customer_id`) = `auth.uid()`

## Row Level Security (RLS)

Enable RLS on catalog tables (read-only to everyone is typical):

```sql
alter table public.brands enable row level security;
alter table public.device_models enable row level security;

-- Allow anyone (including anon) to read the catalog (or restrict as needed)
create policy "brands_select_all"
on public.brands
for select
to public
using (true);

create policy "device_models_select_all"
on public.device_models
for select
to public
using (true);
```

### Repairs policies (customer owns their rows)

> IMPORTANT: Column names vary by deployment. Use the customer id column that exists in your `public.repairs` table:
- `customer_user_id` (preferred, backend_api schema), OR
- `customer_id` (older demo schema)

Enable RLS:

```sql
alter table public.repairs enable row level security;
```

#### Customer can insert their own repairs
**If using `customer_user_id`:**
```sql
create policy "repairs_insert_own"
on public.repairs
for insert
to authenticated
with check (customer_user_id = auth.uid());
```

**If using `customer_id`:**
```sql
create policy "repairs_insert_own"
on public.repairs
for insert
to authenticated
with check (customer_id = auth.uid());
```

#### Customer can view only their own repairs
**If using `customer_user_id`:**
```sql
create policy "repairs_select_own"
on public.repairs
for select
to authenticated
using (customer_user_id = auth.uid());
```

**If using `customer_id`:**
```sql
create policy "repairs_select_own"
on public.repairs
for select
to authenticated
using (customer_id = auth.uid());
```

## Minimal seed data (example)
```sql
insert into public.brands (name, logo_url)
values
  ('Apple', null),
  ('Samsung', null),
  ('Xiaomi (Mi)', null),
  ('Realme', null),
  ('OnePlus', null),
  ('Oppo', null),
  ('Vivo', null)
on conflict (name) do nothing;
```

Then insert models:
```sql
-- Example for Apple: replace <apple_brand_id> with the UUID from public.brands
insert into public.device_models (brand_id, model_name)
values
  ('<apple_brand_id>', 'iPhone 11'),
  ('<apple_brand_id>', 'iPhone 12'),
  ('<apple_brand_id>', 'iPhone 13');
```
