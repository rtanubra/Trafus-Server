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

INSERT INTO trafus_categories(team_id, name, budget)
VALUES
    (1,'Food and Wine',300),
    (1,'Transportation',350),
    (1,'Insurance',450),
    (2,'Food and Wine',200),
    (2,'Transportation',450),
    (2,'Insurance',350);

INSERT INTO trafus_expenses(category_id, name, expense)
VALUES
  (1,'Beer',30),
  (1,'Wine',23),
  (1,'Beef',80),
  (4,'Beer',19),
  (4,'Wine',23),
  (4,'Beef',10),
  (2,'GO-1',138),
  (2,'GO-2',128),
  (3,'Insurance bi-mnthly-1',175),
  (3,'Insurance bi-mnthly-2',175),
  (5,'GO-1',138),
  (5,'GO-2',126),
  (6,'Insurance bi-mnthly-1',125),
  (6,'Insurance bi-mnthly-2',175);

  END;

  