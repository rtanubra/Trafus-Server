ALTER TABLE trafus_expense
    ADD user_id INTEGER NOT NULL 
        DEFAULT 1
    Add date_created DATE NOT NULL 
        DEFAULT  GETDATE();