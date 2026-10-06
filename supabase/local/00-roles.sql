-- Roles que Supabase trae de fábrica; acá se crean a mano para la base local.
create role anon nologin noinherit;
create role authenticated nologin noinherit;
create role authenticator login noinherit password 'local';
grant anon, authenticated to authenticator;
create schema if not exists extensions;
