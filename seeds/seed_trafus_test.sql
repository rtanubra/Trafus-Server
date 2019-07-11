BEGIN;
TRUNCATE
  trafus_expenses,
  trafus_categories,
  trafus_users,
  trafus_teams
  RESTART IDENTITY CASCADE;

INSERT INTO trafus_teams (name)
VALUES 
    ('team_1'),
    ('team_2');

INSERT INTO trafus_users (user_name,name , password,team_id)
VALUES
  ('dunder', 'Dunder Mifflin','hello_dunder',1),
  ('deboop', 'Bodeep Deboop', 'hello_deboop',1),
  ('bodeep', 'big Deboop', 'hello_bodeep',2),
  ('bloggs', 'Charlie Bloggs', 'hello_bloggs',2);

END;