-- Monsters Inserts
INSERT INTO monsters (name, source_id, page, size, type_main, alignment_main, alignment_prefix, hp_average, hp_formula, strength, dexterity, constitution, intelligence, wisdom, charisma, passive_perception, challenge_rating_cr, challenge_rating_coven, has_token, has_fluff, has_fluff_images, dragon_casting_color, dragon_age, is_named_creature, sound_clip_type, sound_clip_path) VALUES ('Fraz-Urb''luu', (SELECT id FROM sources WHERE name ILIKE 'MTF' LIMIT 1), 146, 'L', 'fiend', 'CE', NULL, 337, '27d10 + 189', 29, 12, 25, 26, 24, 26, 24, '23', NULL, 1, 1, 1, NULL, NULL, 1, NULL, NULL);
INSERT INTO monsters (name, source_id, page, size, type_main, alignment_main, alignment_prefix, hp_average, hp_formula, strength, dexterity, constitution, intelligence, wisdom, charisma, passive_perception, challenge_rating_cr, challenge_rating_coven, has_token, has_fluff, has_fluff_images, dragon_casting_color, dragon_age, is_named_creature, sound_clip_type, sound_clip_path) VALUES ('Githyanki Kith''rak', (SELECT id FROM sources WHERE name ILIKE 'MTF' LIMIT 1), 205, 'M', 'humanoid', 'LE', NULL, 180, '24d8 + 72', 18, 16, 17, 16, 15, 17, 16, NULL, NULL, 1, 1, 1, NULL, NULL, 0, 'internal', 'bestiary/githyanki-kith_rak.mp3');
INSERT INTO monsters (name, source_id, page, size, type_main, alignment_main, alignment_prefix, hp_average, hp_formula, strength, dexterity, constitution, intelligence, wisdom, charisma, passive_perception, challenge_rating_cr, challenge_rating_coven, has_token, has_fluff, has_fluff_images, dragon_casting_color, dragon_age, is_named_creature, sound_clip_type, sound_clip_path) VALUES ('Graz''zt', (SELECT id FROM sources WHERE name ILIKE 'MTF' LIMIT 1), 149, 'L', 'fiend', 'CE', NULL, 346, '33d10 + 165', 22, 15, 21, 23, 21, 26, 22, NULL, NULL, 1, 1, 1, NULL, NULL, 1, NULL, NULL);
INSERT INTO monsters (name, source_id, page, size, type_main, alignment_main, alignment_prefix, hp_average, hp_formula, strength, dexterity, constitution, intelligence, wisdom, charisma, passive_perception, challenge_rating_cr, challenge_rating_coven, has_token, has_fluff, has_fluff_images, dragon_casting_color, dragon_age, is_named_creature, sound_clip_type, sound_clip_path) VALUES ('Fraz-Urb''luu', (SELECT id FROM sources WHERE name ILIKE 'MPMM' LIMIT 1), 129, 'L', 'fiend', 'CE', NULL, 337, '27d10 + 189', 29, 12, 25, 26, 24, 26, 24, '23', NULL, 1, 1, 1, NULL, NULL, 1, NULL, NULL);
INSERT INTO monsters (name, source_id, page, size, type_main, alignment_main, alignment_prefix, hp_average, hp_formula, strength, dexterity, constitution, intelligence, wisdom, charisma, passive_perception, challenge_rating_cr, challenge_rating_coven, has_token, has_fluff, has_fluff_images, dragon_casting_color, dragon_age, is_named_creature, sound_clip_type, sound_clip_path) VALUES ('Githyanki Kith''rak', (SELECT id FROM sources WHERE name ILIKE 'MPMM' LIMIT 1), 140, 'M', 'humanoid', 'A', NULL, 180, '24d8 + 72', 18, 16, 17, 16, 15, 17, 16, NULL, NULL, 1, 1, 1, NULL, NULL, 0, 'internal', 'bestiary/githyanki-kith_rak.mp3');
INSERT INTO monsters (name, source_id, page, size, type_main, alignment_main, alignment_prefix, hp_average, hp_formula, strength, dexterity, constitution, intelligence, wisdom, charisma, passive_perception, challenge_rating_cr, challenge_rating_coven, has_token, has_fluff, has_fluff_images, dragon_casting_color, dragon_age, is_named_creature, sound_clip_type, sound_clip_path) VALUES ('Graz''zt', (SELECT id FROM sources WHERE name ILIKE 'MPMM' LIMIT 1), 148, 'L', 'fiend', 'CE', NULL, 346, '33d10 + 165', 22, 15, 21, 23, 21, 26, 22, NULL, NULL, 1, 1, 1, NULL, NULL, 1, NULL, NULL);
INSERT INTO monsters (name, source_id, page, size, type_main, alignment_main, alignment_prefix, hp_average, hp_formula, strength, dexterity, constitution, intelligence, wisdom, charisma, passive_perception, challenge_rating_cr, challenge_rating_coven, has_token, has_fluff, has_fluff_images, dragon_casting_color, dragon_age, is_named_creature, sound_clip_type, sound_clip_path) VALUES ('Will-o''-Wisp', (SELECT id FROM sources WHERE name ILIKE 'MM' LIMIT 1), 301, 'T', 'NULL', 'CE', NULL, 22, '9d4', 1, 28, 10, 13, 14, 11, 12, NULL, NULL, 1, 1, 1, NULL, NULL, 0, 'internal', 'bestiary/will-o-wisp.mp3');

-- Monster speeds Inserts
INSERT INTO monster_speeds (monster_id, speed_type, speed_value, condition, can_hover) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'walk', 40, NULL, 0);
INSERT INTO monster_speeds (monster_id, speed_type, speed_value, condition, can_hover) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'fly', 40, NULL, 0);
INSERT INTO monster_speeds (monster_id, speed_type, speed_value, condition, can_hover) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Githyanki Kith''rak' LIMIT 1), 'walk', 30, NULL, 0);
INSERT INTO monster_speeds (monster_id, speed_type, speed_value, condition, can_hover) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'walk', 40, NULL, 0);
INSERT INTO monster_speeds (monster_id, speed_type, speed_value, condition, can_hover) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'walk', 40, NULL, 0);
INSERT INTO monster_speeds (monster_id, speed_type, speed_value, condition, can_hover) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'fly', 40, NULL, 0);
INSERT INTO monster_speeds (monster_id, speed_type, speed_value, condition, can_hover) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Githyanki Kith''rak' LIMIT 1), 'walk', 30, NULL, 0);
INSERT INTO monster_speeds (monster_id, speed_type, speed_value, condition, can_hover) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'walk', 40, NULL, 0);
INSERT INTO monster_speeds (monster_id, speed_type, speed_value, condition, can_hover) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Will-o''-Wisp' LIMIT 1), 'walk', 0, NULL, 1);
INSERT INTO monster_speeds (monster_id, speed_type, speed_value, condition, can_hover) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Will-o''-Wisp' LIMIT 1), 'fly', 50, '(hover)', 1);

-- Monster type tags Inserts
INSERT INTO monster_type_tags (monster_id, tag) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'demon');
INSERT INTO monster_type_tags (monster_id, tag) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Githyanki Kith''rak' LIMIT 1), 'gith');
INSERT INTO monster_type_tags (monster_id, tag) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'demon');
INSERT INTO monster_type_tags (monster_id, tag) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'shapechanger');
INSERT INTO monster_type_tags (monster_id, tag) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'demon');
INSERT INTO monster_type_tags (monster_id, tag) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Githyanki Kith''rak' LIMIT 1), 'gith');
INSERT INTO monster_type_tags (monster_id, tag) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'demon');

-- Monster ac entries Inserts
INSERT INTO monster_ac_entries (monster_id, ac_value, ac_type, ac_condition, ac_braces) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 18, 'natural armor', NULL, 0);
INSERT INTO monster_ac_entries (monster_id, ac_value, ac_type, ac_condition, ac_braces) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Githyanki Kith''rak' LIMIT 1), 18, '{@item plate armor|phb}', NULL, 0);
INSERT INTO monster_ac_entries (monster_id, ac_value, ac_type, ac_condition, ac_braces) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 20, 'natural armor', NULL, 0);
INSERT INTO monster_ac_entries (monster_id, ac_value, ac_type, ac_condition, ac_braces) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 18, 'natural armor', NULL, 0);
INSERT INTO monster_ac_entries (monster_id, ac_value, ac_type, ac_condition, ac_braces) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Githyanki Kith''rak' LIMIT 1), 18, '{@item plate armor|PHB|plate}', NULL, 0);
INSERT INTO monster_ac_entries (monster_id, ac_value, ac_type, ac_condition, ac_braces) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 20, 'natural armor', NULL, 0);
INSERT INTO monster_ac_entries (monster_id, ac_value, ac_type, ac_condition, ac_braces) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Will-o''-Wisp' LIMIT 1), NULL, NULL, NULL, 0);

-- Monster saves Inserts
INSERT INTO monster_saves (monster_id, ability, modifier) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'dex', '+8');
INSERT INTO monster_saves (monster_id, ability, modifier) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'con', '+14');
INSERT INTO monster_saves (monster_id, ability, modifier) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'int', '+15');
INSERT INTO monster_saves (monster_id, ability, modifier) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'wis', '+14');
INSERT INTO monster_saves (monster_id, ability, modifier) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Githyanki Kith''rak' LIMIT 1), 'con', '+7');
INSERT INTO monster_saves (monster_id, ability, modifier) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Githyanki Kith''rak' LIMIT 1), 'int', '+7');
INSERT INTO monster_saves (monster_id, ability, modifier) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Githyanki Kith''rak' LIMIT 1), 'wis', '+6');
INSERT INTO monster_saves (monster_id, ability, modifier) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'dex', '+9');
INSERT INTO monster_saves (monster_id, ability, modifier) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'con', '+12');
INSERT INTO monster_saves (monster_id, ability, modifier) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'wis', '+12');
INSERT INTO monster_saves (monster_id, ability, modifier) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'dex', '+8');
INSERT INTO monster_saves (monster_id, ability, modifier) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'con', '+14');
INSERT INTO monster_saves (monster_id, ability, modifier) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'int', '+15');
INSERT INTO monster_saves (monster_id, ability, modifier) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'wis', '+14');
INSERT INTO monster_saves (monster_id, ability, modifier) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Githyanki Kith''rak' LIMIT 1), 'con', '+7');
INSERT INTO monster_saves (monster_id, ability, modifier) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Githyanki Kith''rak' LIMIT 1), 'int', '+7');
INSERT INTO monster_saves (monster_id, ability, modifier) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Githyanki Kith''rak' LIMIT 1), 'wis', '+6');
INSERT INTO monster_saves (monster_id, ability, modifier) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'dex', '+9');
INSERT INTO monster_saves (monster_id, ability, modifier) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'con', '+12');
INSERT INTO monster_saves (monster_id, ability, modifier) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'wis', '+12');

-- Monster skills Inserts
INSERT INTO monster_skills (monster_id, skill_id, modifier, other_data) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), (SELECT id FROM skills WHERE name ILIKE 'deception' LIMIT 1), '+15', NULL);
INSERT INTO monster_skills (monster_id, skill_id, modifier, other_data) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), (SELECT id FROM skills WHERE name ILIKE 'perception' LIMIT 1), '+14', NULL);
INSERT INTO monster_skills (monster_id, skill_id, modifier, other_data) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), (SELECT id FROM skills WHERE name ILIKE 'stealth' LIMIT 1), '+8', NULL);
INSERT INTO monster_skills (monster_id, skill_id, modifier, other_data) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Githyanki Kith''rak' LIMIT 1), (SELECT id FROM skills WHERE name ILIKE 'intimidation' LIMIT 1), '+7', NULL);
INSERT INTO monster_skills (monster_id, skill_id, modifier, other_data) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Githyanki Kith''rak' LIMIT 1), (SELECT id FROM skills WHERE name ILIKE 'perception' LIMIT 1), '+6', NULL);
INSERT INTO monster_skills (monster_id, skill_id, modifier, other_data) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), (SELECT id FROM skills WHERE name ILIKE 'deception' LIMIT 1), '+15', NULL);
INSERT INTO monster_skills (monster_id, skill_id, modifier, other_data) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), (SELECT id FROM skills WHERE name ILIKE 'insight' LIMIT 1), '+12', NULL);
INSERT INTO monster_skills (monster_id, skill_id, modifier, other_data) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), (SELECT id FROM skills WHERE name ILIKE 'perception' LIMIT 1), '+12', NULL);
INSERT INTO monster_skills (monster_id, skill_id, modifier, other_data) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), (SELECT id FROM skills WHERE name ILIKE 'persuasion' LIMIT 1), '+15', NULL);
INSERT INTO monster_skills (monster_id, skill_id, modifier, other_data) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), (SELECT id FROM skills WHERE name ILIKE 'deception' LIMIT 1), '+15', NULL);
INSERT INTO monster_skills (monster_id, skill_id, modifier, other_data) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), (SELECT id FROM skills WHERE name ILIKE 'perception' LIMIT 1), '+14', NULL);
INSERT INTO monster_skills (monster_id, skill_id, modifier, other_data) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), (SELECT id FROM skills WHERE name ILIKE 'stealth' LIMIT 1), '+8', NULL);
INSERT INTO monster_skills (monster_id, skill_id, modifier, other_data) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Githyanki Kith''rak' LIMIT 1), (SELECT id FROM skills WHERE name ILIKE 'intimidation' LIMIT 1), '+7', NULL);
INSERT INTO monster_skills (monster_id, skill_id, modifier, other_data) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Githyanki Kith''rak' LIMIT 1), (SELECT id FROM skills WHERE name ILIKE 'perception' LIMIT 1), '+6', NULL);
INSERT INTO monster_skills (monster_id, skill_id, modifier, other_data) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), (SELECT id FROM skills WHERE name ILIKE 'deception' LIMIT 1), '+15', NULL);
INSERT INTO monster_skills (monster_id, skill_id, modifier, other_data) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), (SELECT id FROM skills WHERE name ILIKE 'perception' LIMIT 1), '+12', NULL);
INSERT INTO monster_skills (monster_id, skill_id, modifier, other_data) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), (SELECT id FROM skills WHERE name ILIKE 'persuasion' LIMIT 1), '+15', NULL);

-- Monster senses list Inserts
INSERT INTO monster_senses_list (monster_id, sense_description) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'truesight 120 ft.');
INSERT INTO monster_senses_list (monster_id, sense_description) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'truesight 120 ft.');
INSERT INTO monster_senses_list (monster_id, sense_description) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'truesight 120 ft.');
INSERT INTO monster_senses_list (monster_id, sense_description) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'truesight 120 ft.');
INSERT INTO monster_senses_list (monster_id, sense_description) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Will-o''-Wisp' LIMIT 1), 'darkvision 120 ft.');

-- Monster resistances Inserts
INSERT INTO monster_resistances (monster_id, damage_type, note, condition) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'cold', NULL, 0);
INSERT INTO monster_resistances (monster_id, damage_type, note, condition) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'fire', NULL, 0);
INSERT INTO monster_resistances (monster_id, damage_type, note, condition) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'lightning', NULL, 0);
INSERT INTO monster_resistances (monster_id, damage_type, note, condition) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'cold', NULL, 0);
INSERT INTO monster_resistances (monster_id, damage_type, note, condition) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'fire', NULL, 0);
INSERT INTO monster_resistances (monster_id, damage_type, note, condition) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'lightning', NULL, 0);
INSERT INTO monster_resistances (monster_id, damage_type, note, condition) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'cold', NULL, 0);
INSERT INTO monster_resistances (monster_id, damage_type, note, condition) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'fire', NULL, 0);
INSERT INTO monster_resistances (monster_id, damage_type, note, condition) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'lightning', NULL, 0);
INSERT INTO monster_resistances (monster_id, damage_type, note, condition) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'cold', NULL, 0);
INSERT INTO monster_resistances (monster_id, damage_type, note, condition) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'fire', NULL, 0);
INSERT INTO monster_resistances (monster_id, damage_type, note, condition) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'lightning', NULL, 0);
INSERT INTO monster_resistances (monster_id, damage_type, note, condition) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Will-o''-Wisp' LIMIT 1), 'acid', NULL, 0);
INSERT INTO monster_resistances (monster_id, damage_type, note, condition) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Will-o''-Wisp' LIMIT 1), 'cold', NULL, 0);
INSERT INTO monster_resistances (monster_id, damage_type, note, condition) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Will-o''-Wisp' LIMIT 1), 'fire', NULL, 0);
INSERT INTO monster_resistances (monster_id, damage_type, note, condition) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Will-o''-Wisp' LIMIT 1), 'necrotic', NULL, 0);
INSERT INTO monster_resistances (monster_id, damage_type, note, condition) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Will-o''-Wisp' LIMIT 1), 'thunder', NULL, 0);
INSERT INTO monster_resistances (monster_id, damage_type, note, condition) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Will-o''-Wisp' LIMIT 1), 'bludgeoning, piercing, slashing', 'from nonmagical attacks', 1);

-- Monster immunities Inserts
INSERT INTO monster_immunities (monster_id, damage_type, note, condition) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'poison', NULL, 0);
INSERT INTO monster_immunities (monster_id, damage_type, note, condition) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'bludgeoning, piercing, slashing', 'that is nonmagical', 1);
INSERT INTO monster_immunities (monster_id, damage_type, note, condition) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'poison', NULL, 0);
INSERT INTO monster_immunities (monster_id, damage_type, note, condition) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'bludgeoning, piercing, slashing', 'that is nonmagical', 1);
INSERT INTO monster_immunities (monster_id, damage_type, note, condition) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'poison', NULL, 0);
INSERT INTO monster_immunities (monster_id, damage_type, note, condition) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'bludgeoning, piercing, slashing', 'that is nonmagical', 1);
INSERT INTO monster_immunities (monster_id, damage_type, note, condition) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'poison', NULL, 0);
INSERT INTO monster_immunities (monster_id, damage_type, note, condition) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'bludgeoning, piercing, slashing', 'that is nonmagical', 1);
INSERT INTO monster_immunities (monster_id, damage_type, note, condition) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Will-o''-Wisp' LIMIT 1), 'lightning', NULL, 0);
INSERT INTO monster_immunities (monster_id, damage_type, note, condition) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Will-o''-Wisp' LIMIT 1), 'poison', NULL, 0);

-- Monster condition immunities Inserts
INSERT INTO monster_condition_immunities (monster_id, condition_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'charmed');
INSERT INTO monster_condition_immunities (monster_id, condition_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'exhaustion');
INSERT INTO monster_condition_immunities (monster_id, condition_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'frightened');
INSERT INTO monster_condition_immunities (monster_id, condition_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'poisoned');
INSERT INTO monster_condition_immunities (monster_id, condition_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'charmed');
INSERT INTO monster_condition_immunities (monster_id, condition_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'exhaustion');
INSERT INTO monster_condition_immunities (monster_id, condition_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'frightened');
INSERT INTO monster_condition_immunities (monster_id, condition_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'poisoned');
INSERT INTO monster_condition_immunities (monster_id, condition_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'charmed');
INSERT INTO monster_condition_immunities (monster_id, condition_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'exhaustion');
INSERT INTO monster_condition_immunities (monster_id, condition_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'frightened');
INSERT INTO monster_condition_immunities (monster_id, condition_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'poisoned');
INSERT INTO monster_condition_immunities (monster_id, condition_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'charmed');
INSERT INTO monster_condition_immunities (monster_id, condition_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'exhaustion');
INSERT INTO monster_condition_immunities (monster_id, condition_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'frightened');
INSERT INTO monster_condition_immunities (monster_id, condition_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'poisoned');
INSERT INTO monster_condition_immunities (monster_id, condition_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Will-o''-Wisp' LIMIT 1), 'exhaustion');
INSERT INTO monster_condition_immunities (monster_id, condition_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Will-o''-Wisp' LIMIT 1), 'grappled');
INSERT INTO monster_condition_immunities (monster_id, condition_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Will-o''-Wisp' LIMIT 1), 'paralyzed');
INSERT INTO monster_condition_immunities (monster_id, condition_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Will-o''-Wisp' LIMIT 1), 'poisoned');
INSERT INTO monster_condition_immunities (monster_id, condition_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Will-o''-Wisp' LIMIT 1), 'prone');
INSERT INTO monster_condition_immunities (monster_id, condition_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Will-o''-Wisp' LIMIT 1), 'restrained');
INSERT INTO monster_condition_immunities (monster_id, condition_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Will-o''-Wisp' LIMIT 1), 'unconscious');

-- Monster languages list Inserts
INSERT INTO monster_languages_list (monster_id, language_id) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), (SELECT id FROM languages WHERE name ILIKE 'all' LIMIT 1));
INSERT INTO monster_languages_list (monster_id, language_id) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Githyanki Kith''rak' LIMIT 1), (SELECT id FROM languages WHERE name ILIKE 'Gith' LIMIT 1));
INSERT INTO monster_languages_list (monster_id, language_id) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), (SELECT id FROM languages WHERE name ILIKE 'all' LIMIT 1));
INSERT INTO monster_languages_list (monster_id, language_id) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), (SELECT id FROM languages WHERE name ILIKE 'all' LIMIT 1));
INSERT INTO monster_languages_list (monster_id, language_id) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Githyanki Kith''rak' LIMIT 1), (SELECT id FROM languages WHERE name ILIKE 'Gith' LIMIT 1));
INSERT INTO monster_languages_list (monster_id, language_id) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), (SELECT id FROM languages WHERE name ILIKE 'all' LIMIT 1));
INSERT INTO monster_languages_list (monster_id, language_id) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Will-o''-Wisp' LIMIT 1), (SELECT id FROM languages WHERE name ILIKE 'the languages it knew in life' LIMIT 1));

-- Monster spellcasting entries Inserts
INSERT INTO monster_spellcasting_entries (monster_id, name, type, ability, header_entries, spells_by_level, will_spells, daily_spells, footer_entries, display_as) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'Innate Spellcasting', 'spellcasting', 'cha', '["Fraz-Urb''luu''s spellcasting ability is Charisma (spell save {@dc 23}). Fraz-Urb''luu can innately cast the following spells, requiring no material components:"]', NULL, '["{@spell alter self} (can become Medium when changing his appearance)","{@spell detect magic}","{@spell dispel magic}","{@spell phantasmal force}"]', '{"3e":["{@spell confusion}","{@spell dream}","{@spell mislead}","{@spell programmed illusion}","{@spell seeming}"],"1e":["{@spell mirage arcane}","{@spell modify memory}","{@spell project image}"]}', NULL, NULL);
INSERT INTO monster_spellcasting_entries (monster_id, name, type, ability, header_entries, spells_by_level, will_spells, daily_spells, footer_entries, display_as) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Githyanki Kith''rak' LIMIT 1), 'Innate Spellcasting (Psionics)', 'spellcasting', 'int', '["The githyanki''s innate spellcasting ability is Intelligence (spell save {@dc 15}, {@hit 7} to hit with spell attacks). It can innately cast the following spells, requiring no components:"]', NULL, '["{@spell mage hand} (the hand is invisible)"]', '{"3e":["{@spell blur}","{@spell jump}","{@spell misty step}","{@spell nondetection} (self only)"],"1e":["{@spell plane shift}","{@spell telekinesis}"]}', NULL, NULL);
INSERT INTO monster_spellcasting_entries (monster_id, name, type, ability, header_entries, spells_by_level, will_spells, daily_spells, footer_entries, display_as) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'Innate Spellcasting', 'spellcasting', 'cha', '["Graz''zt''s spellcasting ability is Charisma (spell save {@dc 23}). He can innately cast the following spells, requiring no material components:"]', NULL, '["{@spell charm person}","{@spell crown of madness}","{@spell detect magic}","{@spell dispel magic}","{@spell dissonant whispers}"]', '{"3e":["{@spell counterspell}","{@spell darkness}","{@spell dominate person}","{@spell sanctuary}","{@spell telekinesis}","{@spell teleport}"],"1e":["{@spell dominate monster}","{@spell greater invisibility}"]}', NULL, NULL);
INSERT INTO monster_spellcasting_entries (monster_id, name, type, ability, header_entries, spells_by_level, will_spells, daily_spells, footer_entries, display_as) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'Spellcasting', 'spellcasting', 'cha', '["Fraz-Urb''luu casts one of the following spells, requiring no material components and using Charisma as the spellcasting ability (spell save {@dc 23}):"]', NULL, '["{@spell alter self} (can become Medium when changing his appearance)","{@spell detect magic}","{@spell dispel magic}","{@spell phantasmal force}"]', '{"3e":["{@spell mislead}","{@spell programmed illusion}","{@spell seeming}"],"1e":["{@spell modify memory}","{@spell project image}"]}', NULL, 'action');
INSERT INTO monster_spellcasting_entries (monster_id, name, type, ability, header_entries, spells_by_level, will_spells, daily_spells, footer_entries, display_as) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Githyanki Kith''rak' LIMIT 1), 'Spellcasting (Psionics)', 'spellcasting', 'int', '["The githyanki casts one of the following spells, requiring no spell components and using Intelligence as the spellcasting ability (spell save {@dc 15}):"]', NULL, '["{@spell mage hand} (the hand is invisible)"]', '{"3e":["{@spell blur}","{@spell nondetection} (self only)"],"1e":["{@spell plane shift}","{@spell telekinesis}"]}', NULL, 'action');
INSERT INTO monster_spellcasting_entries (monster_id, name, type, ability, header_entries, spells_by_level, will_spells, daily_spells, footer_entries, display_as) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'Spellcasting', 'spellcasting', 'cha', '["Graz''zt casts one of the following spells, requiring no material components and using Charisma as the spellcasting ability (spell save {@dc 23}):"]', NULL, '["{@spell charm person}","{@spell detect magic}","{@spell dispel magic}"]', '{"3e":["{@spell darkness}","{@spell dominate person}","{@spell telekinesis}","{@spell teleport}"],"1e":["{@spell dominate monster}","{@spell greater invisibility}"]}', NULL, 'action');

-- Monster traits Inserts
INSERT INTO monster_traits (monster_id, name, entries) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'Legendary Resistance (3/Day)', '["If Fraz-Urb''luu fails a saving throw, he can choose to succeed instead."]');
INSERT INTO monster_traits (monster_id, name, entries) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'Magic Resistance', '["Fraz-Urb''luu has advantage on saving throws against spells and other magical effects."]');
INSERT INTO monster_traits (monster_id, name, entries) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'Magic Weapons', '["Fraz-Urb''luu''s weapon attacks are magical."]');
INSERT INTO monster_traits (monster_id, name, entries) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'Undetectable', '["Fraz-Urb''luu can''t be targeted by divination magic, perceived through magical scrying sensors, or detected by abilities that sense demons or fiends."]');
INSERT INTO monster_traits (monster_id, name, entries) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Githyanki Kith''rak' LIMIT 1), 'Rally the Troops', '["As a bonus action, the githyanki can magically end the {@condition charmed} and {@condition frightened} conditions on itself and each creature of its choice that it can see within 30 feet of it."]');
INSERT INTO monster_traits (monster_id, name, entries) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'Shapechanger', '["Graz''zt can use his action to polymorph into a form that resembles a Medium humanoid, or back into his true form. Aside from his size, his statistics are the same in each form. Any equipment he is wearing or carrying isn''t transformed."]');
INSERT INTO monster_traits (monster_id, name, entries) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'Legendary Resistance (3/Day)', '["If Graz''zt fails a saving throw, he can choose to succeed instead."]');
INSERT INTO monster_traits (monster_id, name, entries) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'Magic Resistance', '["Graz''zt has advantage on saving throws against spells and other magical effects."]');
INSERT INTO monster_traits (monster_id, name, entries) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'Magic Weapons', '["Graz''zt''s weapon attacks are magical."]');
INSERT INTO monster_traits (monster_id, name, entries) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'Legendary Resistance (3/Day)', '["If Fraz-Urb''luu fails a saving throw, he can choose to succeed instead."]');
INSERT INTO monster_traits (monster_id, name, entries) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'Magic Resistance', '["Fraz-Urb''luu has advantage on saving throws against spells and other magical effects."]');
INSERT INTO monster_traits (monster_id, name, entries) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'Undetectable', '["Fraz-Urb''luu can''t be targeted by divination magic, perceived through magical scrying sensors, or detected by abilities that sense demons or Fiends."]');
INSERT INTO monster_traits (monster_id, name, entries) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'Legendary Resistance (3/Day)', '["If Graz''zt fails a saving throw, he can choose to succeed instead."]');
INSERT INTO monster_traits (monster_id, name, entries) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'Magic Resistance', '["Graz''zt has advantage on saving throws against spells and other magical effects."]');
INSERT INTO monster_traits (monster_id, name, entries) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Will-o''-Wisp' LIMIT 1), 'Consume Life', '["As a bonus action, the will-o''-wisp can target one creature it can see within 5 feet of it that has 0 hit points and is still alive. The target must succeed on a {@dc 10} Constitution saving throw against this magic or die. If the target dies, the will-o''-wisp regains 10 ({@dice 3d6}) hit points."]');
INSERT INTO monster_traits (monster_id, name, entries) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Will-o''-Wisp' LIMIT 1), 'Ephemeral', '["The will-o''-wisp can''t wear or carry anything."]');
INSERT INTO monster_traits (monster_id, name, entries) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Will-o''-Wisp' LIMIT 1), 'Incorporeal Movement', '["The will-o''-wisp can move through other creatures and objects as if they were {@quickref difficult terrain||3}. It takes 5 ({@damage 1d10}) force damage if it ends its turn inside an object."]');
INSERT INTO monster_traits (monster_id, name, entries) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Will-o''-Wisp' LIMIT 1), 'Variable Illumination', '["The will-o''-wisp sheds bright light in a 5 to 20-foot radius and dim light for an additional number of ft. equal to the chosen radius. The will-o''-wisp can alter the radius as a bonus action."]');

-- Monster actions Inserts
INSERT INTO monster_actions (monster_id, name, entries) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'Multiattack', '["Fraz-Urb''luu makes three attacks: one with his bite and two with his fists."]');
INSERT INTO monster_actions (monster_id, name, entries) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'Bite', '["{@atk mw} {@hit 16} to hit, reach 10 ft., one target. {@h}19 ({@damage 3d6 + 9}) piercing damage."]');
INSERT INTO monster_actions (monster_id, name, entries) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'Fist', '["{@atk mw} {@hit 16} to hit, reach 10 ft., one target. {@h}22 ({@damage 3d8 + 9}) bludgeoning damage."]');
INSERT INTO monster_actions (monster_id, name, entries) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Githyanki Kith''rak' LIMIT 1), 'Multiattack', '["The githyanki makes three greatsword attacks."]');
INSERT INTO monster_actions (monster_id, name, entries) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Githyanki Kith''rak' LIMIT 1), 'Greatsword', '["{@atk mw} {@hit 8} to hit, reach 5 ft., one target. {@h}11 ({@damage 2d6 + 4}) slashing damage plus 17 ({@damage 5d6}) psychic damage."]');
INSERT INTO monster_actions (monster_id, name, entries) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'Multiattack', '["Graz''zt attacks twice with Wave of Sorrow."]');
INSERT INTO monster_actions (monster_id, name, entries) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'Wave of Sorrow (Greatsword)', '["{@atk mw} {@hit 13} to hit, reach 10 ft., one target. {@h}20 ({@damage 4d6 + 6}) slashing damage plus 10 ({@damage 3d6}) acid damage."]');
INSERT INTO monster_actions (monster_id, name, entries) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'Teleport', '["Graz''zt magically teleports, along with any equipment he is wearing or carrying, up to 120 feet to an unoccupied space he can see."]');
INSERT INTO monster_actions (monster_id, name, entries) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'Multiattack', '["Fraz-Urb''luu makes one Bite attack and two Fist attacks, and he uses Phantasmal Terror."]');
INSERT INTO monster_actions (monster_id, name, entries) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'Bite', '["{@atk mw} {@hit 16} to hit, reach 10 ft., one target. {@h}19 ({@damage 3d6 + 9}) force damage."]');
INSERT INTO monster_actions (monster_id, name, entries) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'Fist', '["{@atk mw} {@hit 16} to hit, reach 10 ft., one target. {@h}22 ({@damage 3d8 + 9}) force damage."]');
INSERT INTO monster_actions (monster_id, name, entries) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'Phantasmal Terror', '["Fraz-Urb''luu targets one creature he can see within 120 feet of him. The target must succeed on a {@dc 23} Wisdom saving throw, or it takes 16 ({@damage 3d10}) psychic damage and is {@condition frightened} of Fraz-Urb''luu until the end of its next turn."]');
INSERT INTO monster_actions (monster_id, name, entries) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Githyanki Kith''rak' LIMIT 1), 'Multiattack', '["The githyanki makes three Greatsword attacks."]');
INSERT INTO monster_actions (monster_id, name, entries) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Githyanki Kith''rak' LIMIT 1), 'Greatsword', '["{@atk mw} {@hit 8} to hit, reach 5 ft., one target. {@h}11 ({@damage 2d6 + 4}) slashing damage plus 17 ({@damage 5d6}) psychic damage."]');
INSERT INTO monster_actions (monster_id, name, entries) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'Multiattack', '["Graz''zt makes two Wave of Sorrow attacks. He can replace one attack with a use of Spellcasting."]');
INSERT INTO monster_actions (monster_id, name, entries) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'Wave of Sorrow (Greatsword)', '["{@atk mw} {@hit 13} to hit, reach 10 ft., one target. {@h}20 ({@damage 4d6 + 6}) force damage plus 14 ({@damage 4d6}) acid damage."]');
INSERT INTO monster_actions (monster_id, name, entries) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'Teleport', '["Graz''zt teleports, along with any equipment he is wearing or carrying, up to 120 feet to an unoccupied space he can see."]');
INSERT INTO monster_actions (monster_id, name, entries) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Will-o''-Wisp' LIMIT 1), 'Shock', '["{@atk ms} {@hit 4} to hit, reach 5 ft., one creature. {@h}9 ({@damage 2d8}) lightning damage."]');
INSERT INTO monster_actions (monster_id, name, entries) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Will-o''-Wisp' LIMIT 1), 'Invisibility', '["The will-o''-wisp and its light magically become {@condition invisible} until it attacks or uses its Consume Life, or until its {@status concentration} ends (as if {@status concentration||concentrating} on a spell)."]');

-- Monster reactions Inserts
INSERT INTO monster_reactions (monster_id, name, entries) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Githyanki Kith''rak' LIMIT 1), 'Parry', '["The githyanki adds 4 to its AC against one melee attack that would hit it. To do so, the githyanki must see the attacker and be wielding a melee weapon."]');
INSERT INTO monster_reactions (monster_id, name, entries) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Githyanki Kith''rak' LIMIT 1), 'Parry', '["The githyanki adds 4 to its AC against one melee attack that would hit it. To do so, the githyanki must see the attacker and be wielding a melee weapon."]');
INSERT INTO monster_reactions (monster_id, name, entries) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'Negate Spell {@recharge 5}', '["Graz''zt tries to interrupt a spell he sees a creature casting within 60 feet of him. If the spell is 3rd level or lower, the spell fails and has no effect. If the spell is 4th level or higher, Graz''zt makes a Charisma check against a DC of 10 + the spell''s level. On a success, the spell fails and has no effect."]');

-- Monster legendary actions Inserts
INSERT INTO monster_legendary_actions (monster_id, name, entries, cost) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'Tail', '["{@atk mw} {@hit 16} to hit, reach 15 ft., one target. {@h}20 ({@damage 2d10 + 9}) bludgeoning damage. If the target is a Large or smaller creature, it is also {@condition grappled} (escape {@dc 24}). The {@condition grappled} target is also {@condition restrained}. Fraz-Urb''luu can grapple only one creature with his tail at a time."]', NULL);
INSERT INTO monster_legendary_actions (monster_id, name, entries, cost) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'Phantasmal Killer (Costs 2 Actions)', '["Fraz-Urb''luu casts {@spell phantasmal killer}, no {@status concentration} required."]', NULL);
INSERT INTO monster_legendary_actions (monster_id, name, entries, cost) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'Attack', '["Graz''zt attacks once with Wave of Sorrow."]', NULL);
INSERT INTO monster_legendary_actions (monster_id, name, entries, cost) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'Dance, My Puppet', '["One creature {@condition charmed} by Graz''zt that Graz''zt can see must use its reaction to move up to its speed as Graz''zt directs."]', NULL);
INSERT INTO monster_legendary_actions (monster_id, name, entries, cost) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'Sow Discord', '["Graz''zt casts {@spell crown of madness} or dissonant whispers."]', NULL);
INSERT INTO monster_legendary_actions (monster_id, name, entries, cost) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'Teleport', '["Graz''zt uses his Teleport action."]', NULL);
INSERT INTO monster_legendary_actions (monster_id, name, entries, cost) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'Tail', '["{@atk mw} {@hit 16} to hit, reach 15 ft., one target. {@h}20 ({@damage 2d10 + 9}) force damage. If the target is a Large or smaller creature, it is also {@condition grappled} (escape {@dc 24}), and it is {@condition restrained} until the grapple ends. Fraz-Urb''luu can grapple only one creature with his tail at a time."]', NULL);
INSERT INTO monster_legendary_actions (monster_id, name, entries, cost) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'Terror (Costs 2 Actions)', '["Fraz-Urb''luu uses Phantasmal Terror."]', NULL);
INSERT INTO monster_legendary_actions (monster_id, name, entries, cost) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'Abyssal Magic', '["Graz''zt uses Spellcasting or Teleport."]', NULL);
INSERT INTO monster_legendary_actions (monster_id, name, entries, cost) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'Attack', '["Graz''zt makes one Wave of Sorrow attack."]', NULL);
INSERT INTO monster_legendary_actions (monster_id, name, entries, cost) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'Dance, My Puppet!', '["One creature {@condition charmed} by Graz''zt that Graz''zt can see must use its reaction to move up to its speed as Graz''zt directs."]', NULL);

-- Monster legendary group Inserts
INSERT INTO monster_legendary_group (monster_id, name, source) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'Fraz-Urb''luu', 'MTF');
INSERT INTO monster_legendary_group (monster_id, name, source) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'Graz''zt', 'MTF');
INSERT INTO monster_legendary_group (monster_id, name, source) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'Fraz-Urb''luu', 'MPMM');
INSERT INTO monster_legendary_group (monster_id, name, source) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'Graz''zt', 'MPMM');

-- Monster environments Inserts
INSERT INTO monster_environments (monster_id, environment_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Githyanki Kith''rak' LIMIT 1), 'desert');
INSERT INTO monster_environments (monster_id, environment_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Githyanki Kith''rak' LIMIT 1), 'mountain');
INSERT INTO monster_environments (monster_id, environment_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Githyanki Kith''rak' LIMIT 1), 'urban');
INSERT INTO monster_environments (monster_id, environment_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Githyanki Kith''rak' LIMIT 1), 'desert');
INSERT INTO monster_environments (monster_id, environment_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Githyanki Kith''rak' LIMIT 1), 'mountain');
INSERT INTO monster_environments (monster_id, environment_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Githyanki Kith''rak' LIMIT 1), 'urban');
INSERT INTO monster_environments (monster_id, environment_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Will-o''-Wisp' LIMIT 1), 'forest');
INSERT INTO monster_environments (monster_id, environment_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Will-o''-Wisp' LIMIT 1), 'swamp');
INSERT INTO monster_environments (monster_id, environment_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Will-o''-Wisp' LIMIT 1), 'urban');

-- Monster attached items Inserts
INSERT INTO monster_attached_items (monster_id, item_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Githyanki Kith''rak' LIMIT 1), 'greatsword|phb');
INSERT INTO monster_attached_items (monster_id, item_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Githyanki Kith''rak' LIMIT 1), 'greatsword|phb');

-- Monster tags Inserts
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'trait', 'Legendary Resistances');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'trait', 'Magic Resistance');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'trait', 'Magic Weapons');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'sense', 'U');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'action', 'Multiattack');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'language', 'TP');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'language', 'XX');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'damage', 'B');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'damage', 'P');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'damage_spell', 'B');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'damage_spell', 'P');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'damage_spell', 'S');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'damage_spell', 'Y');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'spellcasting', 'I');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'misc', 'MW');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'misc', 'RCH');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'condition_inflict', 'grappled');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'condition_inflict', 'restrained');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'condition_inflict_spell', 'blinded');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'condition_inflict_spell', 'charmed');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'condition_inflict_spell', 'deafened');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'condition_inflict_spell', 'incapacitated');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'condition_inflict_spell', 'invisible');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'saving_throw_forced_spell', 'charisma');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'saving_throw_forced_spell', 'intelligence');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'saving_throw_forced_spell', 'wisdom');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'damage_legendary', 'Y');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'saving_throw_forced_legendary', 'wisdom');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Githyanki Kith''rak' LIMIT 1), 'action', 'Multiattack');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Githyanki Kith''rak' LIMIT 1), 'action', 'Parry');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Githyanki Kith''rak' LIMIT 1), 'language', 'GTH');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Githyanki Kith''rak' LIMIT 1), 'damage', 'S');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Githyanki Kith''rak' LIMIT 1), 'damage', 'Y');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Githyanki Kith''rak' LIMIT 1), 'spellcasting', 'I');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Githyanki Kith''rak' LIMIT 1), 'spellcasting', 'P');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Githyanki Kith''rak' LIMIT 1), 'misc', 'MLW');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Githyanki Kith''rak' LIMIT 1), 'misc', 'MW');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Githyanki Kith''rak' LIMIT 1), 'condition_inflict_spell', 'restrained');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Githyanki Kith''rak' LIMIT 1), 'saving_throw_forced_spell', 'charisma');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'trait', 'Legendary Resistances');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'trait', 'Magic Resistance');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'trait', 'Magic Weapons');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'trait', 'Shapechanger');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'sense', 'U');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'action', 'Multiattack');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'action', 'Teleport');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'language', 'TP');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'language', 'XX');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'damage', 'A');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'damage', 'S');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'damage_spell', 'Y');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'spellcasting', 'I');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'misc', 'MLW');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'misc', 'MW');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'misc', 'RCH');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'condition_inflict_spell', 'charmed');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'condition_inflict_spell', 'invisible');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'condition_inflict_spell', 'restrained');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'saving_throw_forced_spell', 'wisdom');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'saving_throw_forced_legendary', 'wisdom');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'trait', 'Legendary Resistances');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'trait', 'Magic Resistance');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'sense', 'U');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'action', 'Multiattack');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'language', 'TP');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'language', 'XX');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'damage', 'O');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'damage', 'Y');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'damage_spell', 'B');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'damage_spell', 'P');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'damage_spell', 'S');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'damage_spell', 'Y');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'spellcasting', 'O');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'misc', 'MW');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'misc', 'RCH');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'condition_inflict', 'frightened');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'condition_inflict', 'grappled');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'condition_inflict_spell', 'blinded');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'condition_inflict_spell', 'charmed');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'condition_inflict_spell', 'deafened');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'condition_inflict_spell', 'incapacitated');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'condition_inflict_spell', 'invisible');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'saving_throw_forced', 'wisdom');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'saving_throw_forced_spell', 'charisma');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'saving_throw_forced_spell', 'intelligence');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'saving_throw_forced_spell', 'wisdom');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'damage_legendary', 'Y');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'saving_throw_forced_legendary', 'wisdom');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Githyanki Kith''rak' LIMIT 1), 'action', 'Multiattack');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Githyanki Kith''rak' LIMIT 1), 'action', 'Parry');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Githyanki Kith''rak' LIMIT 1), 'language', 'GTH');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Githyanki Kith''rak' LIMIT 1), 'damage', 'S');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Githyanki Kith''rak' LIMIT 1), 'damage', 'Y');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Githyanki Kith''rak' LIMIT 1), 'spellcasting', 'P');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Githyanki Kith''rak' LIMIT 1), 'misc', 'MLW');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Githyanki Kith''rak' LIMIT 1), 'misc', 'MW');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Githyanki Kith''rak' LIMIT 1), 'condition_inflict_spell', 'restrained');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Githyanki Kith''rak' LIMIT 1), 'saving_throw_forced_spell', 'charisma');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'trait', 'Legendary Resistances');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'trait', 'Magic Resistance');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'sense', 'U');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'action', 'Multiattack');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'action', 'Shapechanger');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'action', 'Teleport');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'language', 'TP');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'language', 'XX');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'damage', 'A');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'damage', 'O');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'spellcasting', 'O');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'misc', 'MLW');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'misc', 'MW');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'misc', 'RCH');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'condition_inflict_spell', 'charmed');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'condition_inflict_spell', 'invisible');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'condition_inflict_spell', 'restrained');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'saving_throw_forced_spell', 'wisdom');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Will-o''-Wisp' LIMIT 1), 'trait', 'Incorporeal Movement');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Will-o''-Wisp' LIMIT 1), 'sense', 'SD');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Will-o''-Wisp' LIMIT 1), 'language', 'LF');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Will-o''-Wisp' LIMIT 1), 'damage', 'L');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Will-o''-Wisp' LIMIT 1), 'damage', 'O');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Will-o''-Wisp' LIMIT 1), 'misc', 'AOE');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Will-o''-Wisp' LIMIT 1), 'condition_inflict', 'invisible');
INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Will-o''-Wisp' LIMIT 1), 'saving_throw_forced', 'constitution');

-- Monster variants Inserts


-- Monster other sources Inserts
INSERT INTO monster_other_sources (monster_id, source_name, page) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'OotA', 238);
INSERT INTO monster_other_sources (monster_id, source_name, page) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'OotA', 241);
INSERT INTO monster_other_sources (monster_id, source_name, page) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'MTF', 146);
INSERT INTO monster_other_sources (monster_id, source_name, page) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Githyanki Kith''rak' LIMIT 1), 'MTF', 205);
INSERT INTO monster_other_sources (monster_id, source_name, page) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'MTF', 149);
INSERT INTO monster_other_sources (monster_id, source_name, page) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Will-o''-Wisp' LIMIT 1), 'CoS', NULL);
INSERT INTO monster_other_sources (monster_id, source_name, page) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Will-o''-Wisp' LIMIT 1), 'HotDQ', NULL);
INSERT INTO monster_other_sources (monster_id, source_name, page) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Will-o''-Wisp' LIMIT 1), 'PotA', NULL);
INSERT INTO monster_other_sources (monster_id, source_name, page) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Will-o''-Wisp' LIMIT 1), 'TftYP', NULL);
INSERT INTO monster_other_sources (monster_id, source_name, page) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Will-o''-Wisp' LIMIT 1), 'ToA', NULL);
INSERT INTO monster_other_sources (monster_id, source_name, page) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Will-o''-Wisp' LIMIT 1), 'WDMM', NULL);
INSERT INTO monster_other_sources (monster_id, source_name, page) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Will-o''-Wisp' LIMIT 1), 'GoS', NULL);
INSERT INTO monster_other_sources (monster_id, source_name, page) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Will-o''-Wisp' LIMIT 1), 'DIP', NULL);
INSERT INTO monster_other_sources (monster_id, source_name, page) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Will-o''-Wisp' LIMIT 1), 'BGDIA', NULL);
INSERT INTO monster_other_sources (monster_id, source_name, page) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Will-o''-Wisp' LIMIT 1), 'IDRotF', NULL);
INSERT INTO monster_other_sources (monster_id, source_name, page) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Will-o''-Wisp' LIMIT 1), 'CM', NULL);
INSERT INTO monster_other_sources (monster_id, source_name, page) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Will-o''-Wisp' LIMIT 1), 'WBtW', NULL);
INSERT INTO monster_other_sources (monster_id, source_name, page) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Will-o''-Wisp' LIMIT 1), 'CRCotN', NULL);
INSERT INTO monster_other_sources (monster_id, source_name, page) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Will-o''-Wisp' LIMIT 1), 'JttRC', NULL);
INSERT INTO monster_other_sources (monster_id, source_name, page) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Will-o''-Wisp' LIMIT 1), 'LoX', NULL);
INSERT INTO monster_other_sources (monster_id, source_name, page) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Will-o''-Wisp' LIMIT 1), 'PSI', NULL);
INSERT INTO monster_other_sources (monster_id, source_name, page) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Will-o''-Wisp' LIMIT 1), 'AATM', NULL);
INSERT INTO monster_other_sources (monster_id, source_name, page) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Will-o''-Wisp' LIMIT 1), 'SatO', NULL);
INSERT INTO monster_other_sources (monster_id, source_name, page) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Will-o''-Wisp' LIMIT 1), 'BMT', NULL);
INSERT INTO monster_other_sources (monster_id, source_name, page) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Will-o''-Wisp' LIMIT 1), 'VEoR', NULL);
INSERT INTO monster_other_sources (monster_id, source_name, page) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Will-o''-Wisp' LIMIT 1), 'QftIS', NULL);

-- Monster reprinted as Inserts
INSERT INTO monster_reprinted_as (monster_id, reprinted_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Fraz-Urb''luu' LIMIT 1), 'Fraz-Urb''luu|MPMM');
INSERT INTO monster_reprinted_as (monster_id, reprinted_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Githyanki Kith''rak' LIMIT 1), 'Githyanki Kith''rak|MPMM');
INSERT INTO monster_reprinted_as (monster_id, reprinted_name) VALUES ((SELECT id FROM monsters WHERE name ILIKE 'Graz''zt' LIMIT 1), 'Graz''zt|MPMM');

