
import json
import os

def clean_text(text):
    """Removes markdown-like markers from text."""
    if not isinstance(text, str):
        return text
    # Remove {@tag text|source|...} and similar patterns
    text = text.replace('"', '"')
    text = text.replace("'", "''")
    return text

def parse_item_entries(item_id, entries, db_type):
    insert_statements = []
    for i, entry in enumerate(entries):
        entry_type = entry.get("type", "string")
        content = None
        data = None

        if entry_type == "string":
            content = clean_text(entry.get('data')) # Assuming 'data' key holds the string content
        elif entry_type == "list":
            # For lists, store the whole structure as JSON
            data = json.dumps(entry.get('data'))
        elif entry_type == "entries":
            # For nested entries, store the whole structure as JSON
            data = json.dumps(entry.get('data'))
        elif entry_type == "table":
            # For tables, store the whole structure as JSON
            data = json.dumps(entry.get('data'))
        else:
            # Default to string if type is unknown or not specified
            content = clean_text(str(entry.get('data')))

        if db_type == "postgres":
            insert_statements.append(
                f"INSERT INTO item_entries (item_id, entry_order, type, content, data) VALUES (" 
                f"{item_id}, {i}, '{entry_type}', {f"'{content}'" if content is not None else "NULL"}, " 
                f"{f"'{data}'::jsonb" if data is not None else "NULL"});"
            )
        elif db_type == "sqlite":
            insert_statements.append(
                f"INSERT INTO item_entries (item_id, entry_order, type, content, data) VALUES (" 
                f"{item_id}, {i}, '{entry_type}', {f"'{content}'" if content is not None else "NULL"}, " 
                f"{f"'{data}'" if data is not None else "NULL"});"
            )
    return insert_statements

def generate_inserts(json_data, db_type):
    item_inserts = []
    item_entry_inserts = []
    source_inserts = []
    sources = {}  # To store unique sources and their IDs

    # Start source ID from 1 for both databases
    current_source_id = 1

    for item_data in json_data:
        name = clean_text(item_data.get("name"))
        source = clean_text(item_data.get("source"))
        page = item_data.get("page")
        item_type = clean_text(item_data.get("type"))
        rarity = clean_text(item_data.get("rarity"))
        weight = item_data.get("weight")
        value = item_data.get("value")
        attunement = item_data.get("reqAttune") is not None
        req_attune = clean_text(item_data.get("reqAttune"))
        tier = clean_text(item_data.get("tier"))
        recharge = clean_text(item_data.get("recharge"))
        charges = item_data.get("charges")
        dmg1 = clean_text(item_data.get("dmg1"))
        dmg2 = clean_text(item_data.get("dmg2"))
        dmg_type = clean_text(item_data.get("dmgType"))
        range_val = clean_text(item_data.get("range"))
        weapon_category = clean_text(item_data.get("weaponCategory"))
        ammo_type = clean_text(item_data.get("ammoType"))

        # Booleans
        is_container = bool(item_data.get("container"))
        is_staff = bool(item_data.get("staff"))
        is_wand = bool(item_data.get("wand"))
        is_rod = bool(item_data.get("rod"))
        is_sentient = bool(item_data.get("sentient"))
        is_cursed = bool(item_data.get("curse"))
        is_srd = bool(item_data.get("srd"))
        is_basic_rules = bool(item_data.get("basicRules"))

        # Handle properties (array of strings)
        properties = item_data.get("property")
        properties_json = json.dumps(properties) if properties else None

        # Handle roll_data (can be complex, store as JSON)
        roll_data = item_data.get("roll")
        roll_data_json = json.dumps(roll_data) if roll_data else None

        # Handle misc_data (catch-all for other fields not explicitly mapped)
        misc_data = {k: v for k, v in item_data.items() if k not in [
            "name", "source", "page", "type", "rarity", "weight", "value",
            "reqAttune", "tier", "recharge", "charges", "roll", "dmg1", "dmg2",
            "dmgType", "range", "weaponCategory", "ammoType", "container",
            "staff", "wand", "rod", "sentient", "curse", "srd", "basicRules",
            "property", "entries", "_meta", "reqAttuneTags", "bonusSpellAttack",
            "bonusSpellSaveDc", "focus", "bonusWeapon", "hasFluffImages",
            "hasFluff", "resist", "conditionImmune", "ability", "attachedSpells",
            "group", "scfType", "detail1", "tattoo", "hasRefs", "additionalSources",
            "additionalEntries", "lootTables", "miscTags", "age", "arrow",
            "packContents", "needleBlowgun", "bolt", "dagger", "bulletFirearm",
            "bulletSling", "club", "crossbow", "hammer", "bow", "sword", "polearm",
            "lance", "net", "spear", "rapier", "scfType", "ac", "strength", "stealth",
            "vehAc", "vehHp", "vehSpeed", "crew", "capPassenger", "capCargo",
            "cellEnergy", "light", "modifySpeed"
        ]}
        misc_data_json = json.dumps(misc_data) if misc_data else None

        # Determine stealth_disadvantage and strength_req for armor
        stealth_disadvantage = False
        strength_req = None
        armor_ac = None
        armor_dex_mod = False

        if item_type in ["LA", "MA", "HA"]:
            armor_ac = item_data.get("ac")
            if item_data.get("stealth") == True:
                stealth_disadvantage = True
            if item_data.get("strength"):
                try:
                    strength_req = int(item_data["strength"])
                except ValueError:
                    pass # Handle cases where strength is not a simple integer

            # Determine armor_dex_mod
            if item_type == "LA":
                armor_dex_mod = True
            elif item_type == "MA":
                armor_dex_mod = True # Medium armor typically adds Dex mod up to +2
            elif item_type == "HA":
                armor_dex_mod = False # Heavy armor does not add Dex mod

        # Add source to the sources dictionary if not already present
        if source not in sources:
            sources[source] = current_source_id
            source_inserts.append(f"INSERT INTO sources (name) VALUES ('{source}');")
            current_source_id += 1
        
        source_id = sources[source]

        # Construct the INSERT statement for the items table
        if db_type == "postgres":
            item_inserts.append(
                f"INSERT INTO items (name, source_id, page, type, rarity, weight, value, attunement, req_attune, tier, recharge, charges, roll_data, dmg1, dmg2, dmg_type, properties, range, stealth_disadvantage, strength_req, armor_ac, armor_dex_mod, weapon_category, ammo_type, is_container, is_staff, is_wand, is_rod, is_sentient, is_cursed, is_srd, is_basic_rules, misc_data) VALUES (" 
                f"'{name}', {source_id}, {page if page is not None else 'NULL'}, {f"'{item_type}'" if item_type is not None else "NULL"}, {f"'{rarity}'" if rarity is not None else "NULL"}, {weight if weight is not None else 'NULL'}, {value if value is not None else 'NULL'}, {str(attunement).lower()}, {f"'{req_attune}'" if req_attune is not None else "NULL"}, {f"'{tier}'" if tier is not None else "NULL"}, {f"'{recharge}'" if recharge is not None else "NULL"}, {charges if charges is not None else 'NULL'}, {f"'{roll_data_json}'::jsonb" if roll_data_json is not None else "NULL"}, {f"'{dmg1}'" if dmg1 is not None else "NULL"}, {f"'{dmg2}'" if dmg2 is not None else "NULL"}, {f"'{dmg_type}'" if dmg_type is not None else "NULL"}, {f"'{properties_json}'::jsonb" if properties_json is not None else "NULL"}, {f"'{range_val}'" if range_val is not None else "NULL"}, {str(stealth_disadvantage).lower()}, {strength_req if strength_req is not None else 'NULL'}, {armor_ac if armor_ac is not None else 'NULL'}, {str(armor_dex_mod).lower()}, {f"'{weapon_category}'" if weapon_category is not None else "NULL"}, {f"'{ammo_type}'" if ammo_type is not None else "NULL"}, {str(is_container).lower()}, {str(is_staff).lower()}, {str(is_wand).lower()}, {str(is_rod).lower()}, {str(is_sentient).lower()}, {str(is_cursed).lower()}, {str(is_srd).lower()}, {str(is_basic_rules).lower()}, {f"'{misc_data_json}'::jsonb" if misc_data_json is not None else "NULL"});"
            )
        elif db_type == "sqlite":
            item_inserts.append(
                f"INSERT INTO items (name, source_id, page, type, rarity, weight, value, attunement, req_attune, tier, recharge, charges, roll_data, dmg1, dmg2, dmg_type, properties, range, stealth_disadvantage, strength_req, armor_ac, armor_dex_mod, weapon_category, ammo_type, is_container, is_staff, is_wand, is_rod, is_sentient, is_cursed, is_srd, is_basic_rules, misc_data) VALUES (" 
                f"'{name}', {source_id}, {page if page is not None else 'NULL'}, {f"'{item_type}'" if item_type is not None else "NULL"}, {f"'{rarity}'" if rarity is not None else "NULL"}, {weight if weight is not None else 'NULL'}, {value if value is not None else 'NULL'}, {int(attunement)}, {f"'{req_attune}'" if req_attune is not None else "NULL"}, {f"'{tier}'" if tier is not None else "NULL"}, {f"'{recharge}'" if recharge is not None else "NULL"}, {charges if charges is not None else 'NULL'}, {f"'{roll_data_json}'" if roll_data_json is not None else "NULL"}, {f"'{dmg1}'" if dmg1 is not None else "NULL"}, {f"'{dmg2}'" if dmg2 is not None else "NULL"}, {f"'{dmg_type}'" if dmg_type is not None else "NULL"}, {f"'{properties_json}'" if properties_json is not None else "NULL"}, {f"'{range_val}'" if range_val is not None else "NULL"}, {int(stealth_disadvantage)}, {strength_req if strength_req is not None else 'NULL'}, {armor_ac if armor_ac is not None else 'NULL'}, {int(armor_dex_mod)}, {f"'{weapon_category}'" if weapon_category is not None else "NULL"}, {f"'{ammo_type}'" if ammo_type is not None else "NULL"}, {int(is_container)}, {int(is_staff)}, {int(is_wand)}, {int(is_rod)}, {int(is_sentient)}, {int(is_cursed)}, {int(is_srd)}, {int(is_basic_rules)}, {f"'{misc_data_json}'" if misc_data_json is not None else "NULL"});"
            )

        # For item_entries, we need the ID of the item just inserted.
        # Since we're generating a script, we'll use a placeholder or rely on
        # the order of insertion if IDs are auto-incrementing.
        # For simplicity in this script, we'll assume a sequential ID for item_entries
        # based on the order of items processed. In a real DB, you'd use RETURNING ID.
        # Here, we'll just use a counter for item_id for item_entries.
        # This is a simplification and might need adjustment for actual database import.
        item_id_placeholder = len(item_inserts) # This will act as a pseudo-ID

        entries = item_data.get("entries")
        if entries:
            item_entry_inserts.extend(parse_item_entries(item_id_placeholder, entries, db_type))

    return source_inserts, item_inserts, item_entry_inserts

def main():
    script_dir = "C:\\Projects\\dnd-class-data"
    raw_data_dir = os.path.join(script_dir, "raw-data")
    postgres_output_dir = os.path.join(script_dir, "postgres")
    sqlite_output_dir = os.path.join(script_dir, "sqlite")

    os.makedirs(postgres_output_dir, exist_ok=True)
    os.makedirs(sqlite_output_dir, exist_ok=True)

    items_json_path = os.path.join(raw_data_dir, "items.json")
    items_base_json_path = os.path.join(raw_data_dir, "items-base.json")

    all_items_data = []

    with open(items_json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        all_items_data.extend(data.get("item", []))

    with open(items_base_json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        all_items_data.extend(data.get("baseitem", []))

    # Generate Postgres inserts
    pg_source_inserts, pg_item_inserts, pg_item_entry_inserts = generate_inserts(all_items_data, "postgres")
    with open(os.path.join(postgres_output_dir, "insert_items_postgres.sql"), "w", encoding='utf-8') as f:
        f.write("-- Source Inserts\n")
        f.write("\n".join(pg_source_inserts))
        f.write("\n\n-- Item Inserts\n")
        f.write("\n".join(pg_item_inserts))
        f.write("\n\n-- Item Entry Inserts\n")
        f.write("\n".join(pg_item_entry_inserts))

    # Generate SQLite inserts
    sqlite_source_inserts, sqlite_item_inserts, sqlite_item_entry_inserts = generate_inserts(all_items_data, "sqlite")
    with open(os.path.join(sqlite_output_dir, "insert_items_sqlite.sql"), "w", encoding='utf-8') as f:
        f.write("-- Source Inserts\n")
        f.write("\n".join(sqlite_source_inserts))
        f.write("\n\n-- Item Inserts\n")
        f.write("\n".join(sqlite_item_inserts))
        f.write("\n\n-- Item Entry Inserts\n")
        f.write("\n".join(sqlite_item_entry_inserts))

    print("Generated insert_items_postgres.sql and insert_items_sqlite.sql")

if __name__ == "__main__":
    main()
