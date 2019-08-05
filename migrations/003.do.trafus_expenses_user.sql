ALTER TABLE trafus_expenses
    ADD creator_id INTEGER REFERENCES trafus_users(id) ON DELETE CASCADE NOT NULL DEFAULT 1;
