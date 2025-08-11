CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    source TEXT NOT NULL,
    page INTEGER,
    UNIQUE (name, source)
);

CREATE TABLE IF NOT EXISTS book_entries (
    id SERIAL PRIMARY KEY,
    book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    entry_order FLOAT NOT NULL, -- To maintain the order and hierarchy of entries
    type TEXT, -- e.g., 'section', 'entries', 'list', 'table', 'image'
    name TEXT, -- Name of the entry/section
    content TEXT, -- Cleaned text content of the entry
    list_items JSONB, -- For entries of type 'list'
    table_caption TEXT, -- For entries of type 'table'
    table_col_labels JSONB, -- For entries of type 'table'
    table_col_styles JSONB, -- For entries of type 'table'
    table_rows JSONB, -- For entries of type 'table'
    raw_json JSONB NOT NULL -- Stores the original raw JSON for the entry
);
