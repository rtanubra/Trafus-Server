CREATE TABLE trafus_teams (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
);

CREATE TABLE trafus_users(
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    user_name TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    team_id INTEGER REFERENCES trafus_teams(id) ON DELETE CASCADE NOT NULL 
);

CREATE TABLE trafus_categories(
    id SERIAL PRIMARY KEY,
    team_id INTEGER REFERENCES trafus_teams(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    budget FLOAT(8) NOT NULL
);

CREATE TABLE trafus_expenses(
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES trafus_categories(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    expense FLOAT(8) NOT NULL
);

