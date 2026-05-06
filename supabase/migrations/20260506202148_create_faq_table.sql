-- Create faq table
create table if not exists faq (
  id            bigserial primary key,
  question      text not null,
  answer        text not null,
  category      text,
  order_index   smallint default 0,
  active        boolean default true,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create index if not exists faq_category on faq (category);
create index if not exists faq_active on faq (active);
create index if not exists faq_order on faq (order_index);
