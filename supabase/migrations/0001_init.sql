-- Recast: initial schema (products, cart, orders)

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null default '',
  price_cents integer not null check (price_cents >= 0),
  category text not null,
  image_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  -- checkout has no real payment provider behind it (design decision, see BRIEF):
  -- every order is created already "paid" the moment it's placed.
  status text not null default 'paid',
  total_cents integer not null check (total_cents >= 0),
  created_at timestamptz not null default now()
);

-- Line items snapshot product name/price at purchase time, so an order's
-- history stays accurate even if the product catalog changes later.
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  product_name text not null,
  unit_price_cents integer not null check (unit_price_cents >= 0),
  quantity integer not null check (quantity > 0)
);

alter table public.products enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- products: public catalog, read-only from the client (writes go through
-- the service role only, e.g. a seed script).
create policy "products are publicly readable"
  on public.products for select
  using (true);

-- cart_items: a user can only ever see/touch their own cart.
create policy "users manage their own cart items"
  on public.cart_items for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- orders: a user can create and read only their own orders.
create policy "users read their own orders"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "users create their own orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

-- order_items: readable/insertable only through an order the same user owns.
create policy "users read their own order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
        and orders.user_id = auth.uid()
    )
  );

create policy "users create their own order items"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
        and orders.user_id = auth.uid()
    )
  );
