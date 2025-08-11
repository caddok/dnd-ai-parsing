
CREATE TABLE IF NOT EXISTS decks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    source_id INTEGER REFERENCES sources(id),
    page INTEGER,
    has_card_art BOOLEAN,
    back_image_type VARCHAR(50),
    back_image_path TEXT,
    back_image_width INTEGER,
    back_image_height INTEGER,
    back_image_credit TEXT
);

CREATE TABLE IF NOT EXISTS deck_cards (
    id SERIAL PRIMARY KEY,
    deck_id INTEGER REFERENCES decks(id) ON DELETE CASCADE,
    uid TEXT,
    replacement BOOLEAN,
    count INTEGER
);

CREATE TABLE IF NOT EXISTS deck_entries (
    id SERIAL PRIMARY KEY,
    deck_id INTEGER REFERENCES decks(id) ON DELETE CASCADE,
    entry_order INTEGER NOT NULL,
    type VARCHAR(50),
    content TEXT,
    list_items JSONB,
    table_caption TEXT,
    table_col_labels JSONB,
    table_col_styles JSONB,
    table_rows JSONB,
    footnotes JSONB,
    raw_json JSONB
);

CREATE TABLE IF NOT EXISTS deck_other_sources (
    id SERIAL PRIMARY KEY,
    deck_id INTEGER REFERENCES decks(id) ON DELETE CASCADE,
    source_name VARCHAR(255),
    page INTEGER
);

