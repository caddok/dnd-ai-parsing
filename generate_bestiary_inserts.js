const fs = require('fs');
const path = require('path');

function cleanText(text) {
    if (typeof text !== 'string') {
        return text;
    }
    return text.replace(/'/g, "''");
}

function generateInserts(jsonData, dbType, existingMonsterNames) {
    const inserts = {
        monsters: [],
        monster_speeds: [],
        monster_type_tags: [],
        monster_ac_entries: [],
        monster_saves: [],
        monster_skills: [],
        monster_senses_list: [],
        monster_resistances: [],
        monster_immunities: [],
        monster_condition_immunities: [],
        monster_languages_list: [],
        monster_spellcasting_entries: [],
        monster_traits: [],
        monster_actions: [],
        monster_reactions: [],
        monster_legendary_actions: [],
        monster_legendary_group: [],
        monster_environments: [],
        monster_attached_items: [],
        monster_tags: [],
        monster_variants: [],
        monster_other_sources: [],
        monster_reprinted_as: []
    };

    for (const monsterData of jsonData) {
        const name = cleanText(monsterData.name);

        if (existingMonsterNames.has(name)) {
            continue;
        }

        const source = cleanText(monsterData.source);
        const sourceIdSubquery = `(SELECT id FROM sources WHERE name ILIKE '${source}' LIMIT 1)`;

        const page = monsterData.page || 'NULL';
        const size = monsterData.size && monsterData.size.length > 0 ? cleanText(monsterData.size[0]) : 'NULL';
        const typeMain = monsterData.type && monsterData.type.type ? cleanText(monsterData.type.type) : 'NULL';
        const alignmentMain = monsterData.alignment && monsterData.alignment.length > 0 ? cleanText(monsterData.alignment.join('')) : 'NULL';
        const alignmentPrefix = monsterData.alignmentPrefix ? cleanText(monsterData.alignmentPrefix) : 'NULL';
        const hpAverage = monsterData.hp && monsterData.hp.average ? monsterData.hp.average : 'NULL';
        const hpFormula = monsterData.hp && monsterData.hp.formula ? cleanText(monsterData.hp.formula) : 'NULL';

        const strength = monsterData.str || 'NULL';
        const dexterity = monsterData.dex || 'NULL';
        const constitution = monsterData.con || 'NULL';
        const intelligence = monsterData.int || 'NULL';
        const wisdom = monsterData.wis || 'NULL';
        const charisma = monsterData.cha || 'NULL';

        const passivePerception = monsterData.passive || 'NULL';

        const challengeRating = monsterData.cr || {};
        const challengeRatingCr = challengeRating.cr ? cleanText(challengeRating.cr) : 'NULL';
        const challengeRatingCoven = challengeRating.coven ? cleanText(challengeRating.coven) : 'NULL';

        const hasToken = !!monsterData.hasToken;
        const hasFluff = !!monsterData.hasFluff;
        const hasFluffImages = !!monsterData.hasFluffImages;

        const dragonCastingColor = monsterData.dragonCastingColor ? cleanText(monsterData.dragonCastingColor) : 'NULL';
        const dragonAge = monsterData.dragonAge ? cleanText(monsterData.dragonAge) : 'NULL';
        const isNamedCreature = !!monsterData.isNamedCreature;

        const soundClip = monsterData.soundClip || {};
        const soundClipType = soundClip.type ? cleanText(soundClip.type) : 'NULL';
        const soundClipPath = soundClip.path ? cleanText(soundClip.path) : 'NULL';

        const monsterIdSubquery = `(SELECT id FROM monsters WHERE name ILIKE '${name}' LIMIT 1)`;

        if (dbType === 'postgres') {
            inserts.monsters.push(
                `INSERT INTO monsters (name, source_id, page, size, type_main, alignment_main, alignment_prefix, hp_average, hp_formula, strength, dexterity, constitution, intelligence, wisdom, charisma, passive_perception, challenge_rating_cr, challenge_rating_coven, has_token, has_fluff, has_fluff_images, dragon_casting_color, dragon_age, is_named_creature, sound_clip_type, sound_clip_path) VALUES (` +
                `'${name}', ${sourceIdSubquery}, ${page}, '${size}', '${typeMain}', '${alignmentMain}', ${alignmentPrefix !== 'NULL' ? `'${alignmentPrefix}'` : 'NULL'}, ${hpAverage}, ${hpFormula !== 'NULL' ? `'${hpFormula}'` : 'NULL'}, ` +
                `${strength}, ${dexterity}, ${constitution}, ${intelligence}, ${wisdom}, ${charisma}, ${passivePerception}, ` +
                `${challengeRatingCr !== 'NULL' ? `'${challengeRatingCr}'` : 'NULL'}, ${challengeRatingCoven !== 'NULL' ? `'${challengeRatingCoven}'` : 'NULL'}, ` +
                `${hasToken}, ${hasFluff}, ${hasFluffImages}, ${dragonCastingColor !== 'NULL' ? `'${dragonCastingColor}'` : 'NULL'}, ${dragonAge !== 'NULL' ? `'${dragonAge}'` : 'NULL'}, ${isNamedCreature}, ` +
                `${soundClipType !== 'NULL' ? `'${soundClipType}'` : 'NULL'}, ${soundClipPath !== 'NULL' ? `'${soundClipPath}'` : 'NULL'});`
            );
        } else if (dbType === 'sqlite') {
            inserts.monsters.push(
                `INSERT INTO monsters (name, source_id, page, size, type_main, alignment_main, alignment_prefix, hp_average, hp_formula, strength, dexterity, constitution, intelligence, wisdom, charisma, passive_perception, challenge_rating_cr, challenge_rating_coven, has_token, has_fluff, has_fluff_images, dragon_casting_color, dragon_age, is_named_creature, sound_clip_type, sound_clip_path) VALUES (` +
                `'${name}', ${sourceIdSubquery}, ${page}, '${size}', '${typeMain}', '${alignmentMain}', ${alignmentPrefix !== 'NULL' ? `'${alignmentPrefix}'` : 'NULL'}, ${hpAverage}, ${hpFormula !== 'NULL' ? `'${hpFormula}'` : 'NULL'}, ` +
                `${strength}, ${dexterity}, ${constitution}, ${intelligence}, ${wisdom}, ${charisma}, ${passivePerception}, ` +
                `${challengeRatingCr !== 'NULL' ? `'${challengeRatingCr}'` : 'NULL'}, ${challengeRatingCoven !== 'NULL' ? `'${challengeRatingCoven}'` : 'NULL'}, ` +
                `${hasToken ? 1 : 0}, ${hasFluff ? 1 : 0}, ${hasFluffImages ? 1 : 0}, ${dragonCastingColor !== 'NULL' ? `'${dragonCastingColor}'` : 'NULL'}, ${dragonAge !== 'NULL' ? `'${dragonAge}'` : 'NULL'}, ${isNamedCreature ? 1 : 0}, ` +
                `${soundClipType !== 'NULL' ? `'${soundClipType}'` : 'NULL'}, ${soundClipPath !== 'NULL' ? `'${soundClipPath}'` : 'NULL'});`
            );
        }

        // monster_speeds
        if (monsterData.speed) {
            for (const speedType in monsterData.speed) {
                if (monsterData.speed.hasOwnProperty(speedType) && speedType !== 'canHover') {
                    const speedValue = monsterData.speed[speedType];
                    let speed_value = 'NULL';
                    let condition = 'NULL';

                    if (typeof speedValue === 'number') {
                        speed_value = speedValue;
                    } else if (typeof speedValue === 'object' && speedValue !== null) {
                        speed_value = speedValue.number || 'NULL';
                        condition = speedValue.condition ? cleanText(speedValue.condition) : 'NULL';
                    }

                    const canHover = !!monsterData.speed.canHover;

                    if (dbType === 'postgres') {
                        inserts.monster_speeds.push(
                            `INSERT INTO monster_speeds (monster_id, speed_type, speed_value, condition, can_hover) VALUES (` +
                            `${monsterIdSubquery}, '${cleanText(speedType)}', ${speed_value}, ${condition !== 'NULL' ? `'${condition}'` : 'NULL'}, ${canHover});`
                        );
                    } else if (dbType === 'sqlite') {
                        inserts.monster_speeds.push(
                            `INSERT INTO monster_speeds (monster_id, speed_type, speed_value, condition, can_hover) VALUES (` +
                            `${monsterIdSubquery}, '${cleanText(speedType)}', ${speed_value}, ${condition !== 'NULL' ? `'${condition}'` : 'NULL'}, ${canHover ? 1 : 0});`
                        );
                    }
                }
            }
        }

        // monster_type_tags
        if (monsterData.type && monsterData.type.tags && Array.isArray(monsterData.type.tags)) {
            for (const tag of monsterData.type.tags) {
                inserts.monster_type_tags.push(
                    `INSERT INTO monster_type_tags (monster_id, tag) VALUES (${monsterIdSubquery}, '${cleanText(tag)}');`
                );
            }
        }

        // monster_ac_entries
        if (monsterData.ac && Array.isArray(monsterData.ac)) {
            for (const acEntry of monsterData.ac) {
                const acValue = acEntry.ac || 'NULL';
                const acType = acEntry.from && acEntry.from.length > 0 ? cleanText(acEntry.from[0]) : 'NULL';
                const acCondition = acEntry.condition ? cleanText(acEntry.condition) : 'NULL';
                const acBraces = !!acEntry.braces;
                if (dbType === 'postgres') {
                    inserts.monster_ac_entries.push(
                        `INSERT INTO monster_ac_entries (monster_id, ac_value, ac_type, ac_condition, ac_braces) VALUES (` +
                        `${monsterIdSubquery}, ${acValue}, ${acType !== 'NULL' ? `'${acType}'` : 'NULL'}, ${acCondition !== 'NULL' ? `'${acCondition}'` : 'NULL'}, ${acBraces});`
                    );
                } else if (dbType === 'sqlite') {
                    inserts.monster_ac_entries.push(
                        `INSERT INTO monster_ac_entries (monster_id, ac_value, ac_type, ac_condition, ac_braces) VALUES (` +
                        `${monsterIdSubquery}, ${acValue}, ${acType !== 'NULL' ? `'${acType}'` : 'NULL'}, ${acCondition !== 'NULL' ? `'${acCondition}'` : 'NULL'}, ${acBraces ? 1 : 0});`
                    );
                }
            }
        }

        // monster_saves
        if (monsterData.save) {
            for (const ability in monsterData.save) {
                if (monsterData.save.hasOwnProperty(ability)) {
                    inserts.monster_saves.push(
                        `INSERT INTO monster_saves (monster_id, ability, modifier) VALUES (${monsterIdSubquery}, '${cleanText(ability)}', '${cleanText(monsterData.save[ability])}');`
                    );
                }
            }
        }

        // monster_skills
        if (monsterData.skill) {
            for (const skillName in monsterData.skill) {
                if (monsterData.skill.hasOwnProperty(skillName)) {
                    const skillIdSubquery = `(SELECT id FROM skills WHERE name ILIKE '${cleanText(skillName)}' LIMIT 1)`;
                    const skillValue = monsterData.skill[skillName];
                    let modifier = 'NULL';
                    let otherData = 'NULL';

                    if (typeof skillValue === 'string') {
                        modifier = cleanText(skillValue);
                    } else if (typeof skillValue === 'object' && skillValue !== null) {
                        otherData = JSON.stringify(skillValue);
                        otherData = otherData.replace(/'/g, "''");
                    }

                    if (dbType === 'postgres') {
                        inserts.monster_skills.push(
                            `INSERT INTO monster_skills (monster_id, skill_id, modifier, other_data) VALUES (` +
                            `${monsterIdSubquery}, ${skillIdSubquery}, ${modifier !== 'NULL' ? `'${modifier}'` : 'NULL'}, ${otherData !== 'NULL' ? `'${otherData}'::jsonb` : 'NULL'});`
                        );
                    } else if (dbType === 'sqlite') {
                        inserts.monster_skills.push(
                            `INSERT INTO monster_skills (monster_id, skill_id, modifier, other_data) VALUES (` +
                            `${monsterIdSubquery}, ${skillIdSubquery}, ${modifier !== 'NULL' ? `'${modifier}'` : 'NULL'}, ${otherData !== 'NULL' ? `'${otherData}'` : 'NULL'});`
                        );
                    }
                }
            }
        }

        // monster_senses_list
        if (monsterData.senses && Array.isArray(monsterData.senses)) {
            for (const sense of monsterData.senses) {
                inserts.monster_senses_list.push(
                    `INSERT INTO monster_senses_list (monster_id, sense_description) VALUES (${monsterIdSubquery}, '${cleanText(sense)}');`
                );
            }
        }

        // monster_resistances
        if (monsterData.resist && Array.isArray(monsterData.resist)) {
            for (const resistEntry of monsterData.resist) {
                let damageType = 'NULL';
                let note = 'NULL';
                let condition = false;

                if (typeof resistEntry === 'string') {
                    damageType = cleanText(resistEntry);
                } else if (typeof resistEntry === 'object' && resistEntry !== null) {
                    damageType = resistEntry.resist && resistEntry.resist.length > 0 ? cleanText(resistEntry.resist.join(', ')) : 'NULL';
                    note = resistEntry.note ? cleanText(resistEntry.note) : 'NULL';
                    condition = !!resistEntry.cond;
                }
                if (dbType === 'postgres') {
                    inserts.monster_resistances.push(
                        `INSERT INTO monster_resistances (monster_id, damage_type, note, condition) VALUES (` +
                        `${monsterIdSubquery}, ${damageType !== 'NULL' ? `'${damageType}'` : 'NULL'}, ${note !== 'NULL' ? `'${note}'` : 'NULL'}, ${condition});`
                    );
                } else if (dbType === 'sqlite') {
                    inserts.monster_resistances.push(
                        `INSERT INTO monster_resistances (monster_id, damage_type, note, condition) VALUES (` +
                        `${monsterIdSubquery}, ${damageType !== 'NULL' ? `'${damageType}'` : 'NULL'}, ${note !== 'NULL' ? `'${note}'` : 'NULL'}, ${condition ? 1 : 0});`
                    );
                }
            }
        }

        // monster_immunities
        if (monsterData.immune && Array.isArray(monsterData.immune)) {
            for (const immuneEntry of monsterData.immune) {
                let damageType = 'NULL';
                let note = 'NULL';
                let condition = false;

                if (typeof immuneEntry === 'string') {
                    damageType = cleanText(immuneEntry);
                } else if (typeof immuneEntry === 'object' && immuneEntry !== null) {
                    damageType = immuneEntry.immune && immuneEntry.immune.length > 0 ? cleanText(immuneEntry.immune.join(', ')) : 'NULL';
                    note = immuneEntry.note ? cleanText(immuneEntry.note) : 'NULL';
                    condition = !!immuneEntry.cond;
                }
                if (dbType === 'postgres') {
                    inserts.monster_immunities.push(
                        `INSERT INTO monster_immunities (monster_id, damage_type, note, condition) VALUES (` +
                        `${monsterIdSubquery}, ${damageType !== 'NULL' ? `'${damageType}'` : 'NULL'}, ${note !== 'NULL' ? `'${note}'` : 'NULL'}, ${condition});`
                    );
                } else if (dbType === 'sqlite') {
                    inserts.monster_immunities.push(
                        `INSERT INTO monster_immunities (monster_id, damage_type, note, condition) VALUES (` +
                        `${monsterIdSubquery}, ${damageType !== 'NULL' ? `'${damageType}'` : 'NULL'}, ${note !== 'NULL' ? `'${note}'` : 'NULL'}, ${condition ? 1 : 0});`
                    );
                }
            }
        }

        // monster_condition_immunities
        if (monsterData.conditionImmune && Array.isArray(monsterData.conditionImmune)) {
            for (const conditionName of monsterData.conditionImmune) {
                inserts.monster_condition_immunities.push(
                    `INSERT INTO monster_condition_immunities (monster_id, condition_name) VALUES (${monsterIdSubquery}, '${cleanText(conditionName)}');`
                );
            }
        }

        // monster_languages_list
        if (monsterData.languages && Array.isArray(monsterData.languages)) {
            for (const language of monsterData.languages) {
                const lang = cleanText(language);
                if (lang.toLowerCase().includes('telepathy')) continue;

                const anyLangMatch = lang.match(/any (\w+) languages/i);
                if (anyLangMatch) {
                    const count = anyLangMatch[1] === 'one' ? 1 : 4;
                    const languageIdSubquery = `(SELECT id FROM languages WHERE name ILIKE 'any' LIMIT 1)`;
                    inserts.monster_languages_list.push(
                        `INSERT INTO monster_languages_list (monster_id, language_id, choice_count) VALUES (${monsterIdSubquery}, ${languageIdSubquery}, ${count});`
                    );
                    continue;
                }

                const plusMatch = lang.match(/(\w+)\s*plus\s*(.*)/i);
                if (plusMatch) {
                    const mainLang = plusMatch[1];
                    const otherPart = plusMatch[2];
                    const languageIdSubquery1 = `(SELECT id FROM languages WHERE name ILIKE '${mainLang}' LIMIT 1)`;
                    inserts.monster_languages_list.push(
                        `INSERT INTO monster_languages_list (monster_id, language_id) VALUES (${monsterIdSubquery}, ${languageIdSubquery1});`
                    );

                    const anyOtherMatch = otherPart.match(/any (\w+) other languages/i);
                    if (anyOtherMatch) {
                        const count = anyOtherMatch[1] === 'two' ? 2 : 1; // Add more cases if needed
                        const languageIdSubquery2 = `(SELECT id FROM languages WHERE name ILIKE 'any' LIMIT 1)`;
                        inserts.monster_languages_list.push(
                            `INSERT INTO monster_languages_list (monster_id, language_id, choice_count) VALUES (${monsterIdSubquery}, ${languageIdSubquery2}, ${count});`
                        );
                    }
                    continue;
                }

                const languageIdSubquery = `(SELECT id FROM languages WHERE name ILIKE '${lang}' LIMIT 1)`;
                inserts.monster_languages_list.push(
                    `INSERT INTO monster_languages_list (monster_id, language_id) VALUES (${monsterIdSubquery}, ${languageIdSubquery});`
                );
            }
        }

        // monster_spellcasting_entries
        if (monsterData.spellcasting && Array.isArray(monsterData.spellcasting)) {
            for (const spellcastingEntry of monsterData.spellcasting) {
                const scName = spellcastingEntry.name ? cleanText(spellcastingEntry.name) : 'NULL';
                const scType = spellcastingEntry.type ? cleanText(spellcastingEntry.type) : 'NULL';
                const scAbility = spellcastingEntry.ability ? cleanText(spellcastingEntry.ability) : 'NULL';
                const headerEntries = spellcastingEntry.headerEntries ? JSON.stringify(spellcastingEntry.headerEntries).replace(/'/g, "''") : 'NULL';
                const spellsByLevel = spellcastingEntry.spells ? JSON.stringify(spellcastingEntry.spells).replace(/'/g, "''") : 'NULL';
                const willSpells = spellcastingEntry.will ? JSON.stringify(spellcastingEntry.will).replace(/'/g, "''") : 'NULL';
                const dailySpells = spellcastingEntry.daily ? JSON.stringify(spellcastingEntry.daily).replace(/'/g, "''") : 'NULL';
                const footerEntries = spellcastingEntry.footerEntries ? JSON.stringify(spellcastingEntry.footerEntries).replace(/'/g, "''") : 'NULL';
                const displayAs = spellcastingEntry.displayAs ? cleanText(spellcastingEntry.displayAs) : 'NULL';

                if (dbType === 'postgres') {
                    inserts.monster_spellcasting_entries.push(
                        `INSERT INTO monster_spellcasting_entries (monster_id, name, type, ability, header_entries, spells_by_level, will_spells, daily_spells, footer_entries, display_as) VALUES (` +
                        `${monsterIdSubquery}, ${scName !== 'NULL' ? `'${scName}'` : 'NULL'}, ${scType !== 'NULL' ? `'${scType}'` : 'NULL'}, ${scAbility !== 'NULL' ? `'${scAbility}'` : 'NULL'}, ` +
                        `${headerEntries !== 'NULL' ? `'${headerEntries}'::jsonb` : 'NULL'}, ${spellsByLevel !== 'NULL' ? `'${spellsByLevel}'::jsonb` : 'NULL'}, ` +
                        `${willSpells !== 'NULL' ? `'${willSpells}'::jsonb` : 'NULL'}, ${dailySpells !== 'NULL' ? `'${dailySpells}'::jsonb` : 'NULL'}, ` +
                        `${footerEntries !== 'NULL' ? `'${footerEntries}'::jsonb` : 'NULL'}, ${displayAs !== 'NULL' ? `'${displayAs}'` : 'NULL'});`
                    );
                } else if (dbType === 'sqlite') {
                    inserts.monster_spellcasting_entries.push(
                        `INSERT INTO monster_spellcasting_entries (monster_id, name, type, ability, header_entries, spells_by_level, will_spells, daily_spells, footer_entries, display_as) VALUES (` +
                        `${monsterIdSubquery}, ${scName !== 'NULL' ? `'${scName}'` : 'NULL'}, ${scType !== 'NULL' ? `'${scType}'` : 'NULL'}, ${scAbility !== 'NULL' ? `'${scAbility}'` : 'NULL'}, ` +
                        `${headerEntries !== 'NULL' ? `'${headerEntries}'` : 'NULL'}, ${spellsByLevel !== 'NULL' ? `'${spellsByLevel}'` : 'NULL'}, ` +
                        `${willSpells !== 'NULL' ? `'${willSpells}'` : 'NULL'}, ${dailySpells !== 'NULL' ? `'${dailySpells}'` : 'NULL'}, ` +
                        `${footerEntries !== 'NULL' ? `'${footerEntries}'` : 'NULL'}, ${displayAs !== 'NULL' ? `'${displayAs}'` : 'NULL'});`
                    );
                }
            }
        }

        // monster_traits
        if (monsterData.trait && Array.isArray(monsterData.trait)) {
            for (const traitEntry of monsterData.trait) {
                const traitName = traitEntry.name ? cleanText(traitEntry.name) : 'NULL';
                const traitEntries = traitEntry.entries ? JSON.stringify(traitEntry.entries).replace(/'/g, "''") : 'NULL';
                if (dbType === 'postgres') {
                    inserts.monster_traits.push(
                        `INSERT INTO monster_traits (monster_id, name, entries) VALUES (` +
                        `${monsterIdSubquery}, ${traitName !== 'NULL' ? `'${traitName}'` : 'NULL'}, ${traitEntries !== 'NULL' ? `'${traitEntries}'::jsonb` : 'NULL'});`
                    );
                } else if (dbType === 'sqlite') {
                    inserts.monster_traits.push(
                        `INSERT INTO monster_traits (monster_id, name, entries) VALUES (` +
                        `${monsterIdSubquery}, ${traitName !== 'NULL' ? `'${traitName}'` : 'NULL'}, ${traitEntries !== 'NULL' ? `'${traitEntries}'` : 'NULL'});`
                    );
                }
            }
        }

        // monster_actions
        if (monsterData.action && Array.isArray(monsterData.action)) {
            for (const actionEntry of monsterData.action) {
                const actionName = actionEntry.name ? cleanText(actionEntry.name) : 'NULL';
                const actionEntries = actionEntry.entries ? JSON.stringify(actionEntry.entries).replace(/'/g, "''") : 'NULL';
                if (dbType === 'postgres') {
                    inserts.monster_actions.push(
                        `INSERT INTO monster_actions (monster_id, name, entries) VALUES (` +
                        `${monsterIdSubquery}, ${actionName !== 'NULL' ? `'${actionName}'` : 'NULL'}, ${actionEntries !== 'NULL' ? `'${actionEntries}'::jsonb` : 'NULL'});`
                    );
                } else if (dbType === 'sqlite') {
                    inserts.monster_actions.push(
                        `INSERT INTO monster_actions (monster_id, name, entries) VALUES (` +
                        `${monsterIdSubquery}, ${actionName !== 'NULL' ? `'${actionName}'` : 'NULL'}, ${actionEntries !== 'NULL' ? `'${actionEntries}'` : 'NULL'});`
                    );
                }
            }
        }

        // monster_reactions
        if (monsterData.reaction && Array.isArray(monsterData.reaction)) {
            for (const reactionEntry of monsterData.reaction) {
                const reactionName = reactionEntry.name ? cleanText(reactionEntry.name) : 'NULL';
                const reactionEntries = reactionEntry.entries ? JSON.stringify(reactionEntry.entries).replace(/'/g, "''") : 'NULL';
                if (dbType === 'postgres') {
                    inserts.monster_reactions.push(
                        `INSERT INTO monster_reactions (monster_id, name, entries) VALUES (` +
                        `${monsterIdSubquery}, ${reactionName !== 'NULL' ? `'${reactionName}'` : 'NULL'}, ${reactionEntries !== 'NULL' ? `'${reactionEntries}'::jsonb` : 'NULL'});`
                    );
                } else if (dbType === 'sqlite') {
                    inserts.monster_reactions.push(
                        `INSERT INTO monster_reactions (monster_id, name, entries) VALUES (` +
                        `${monsterIdSubquery}, ${reactionName !== 'NULL' ? `'${reactionName}'` : 'NULL'}, ${reactionEntries !== 'NULL' ? `'${reactionEntries}'` : 'NULL'});`
                    );
                }
            }
        }

        // monster_legendary_actions
        if (monsterData.legendary && Array.isArray(monsterData.legendary)) {
            for (const legendaryEntry of monsterData.legendary) {
                const legendaryName = legendaryEntry.name ? cleanText(legendaryEntry.name) : 'NULL';
                const legendaryEntries = legendaryEntry.entries ? JSON.stringify(legendaryEntry.entries).replace(/'/g, "''") : 'NULL';
                const legendaryCost = legendaryEntry.cost || 'NULL';
                if (dbType === 'postgres') {
                    inserts.monster_legendary_actions.push(
                        `INSERT INTO monster_legendary_actions (monster_id, name, entries, cost) VALUES (` +
                        `${monsterIdSubquery}, ${legendaryName !== 'NULL' ? `'${legendaryName}'` : 'NULL'}, ${legendaryEntries !== 'NULL' ? `'${legendaryEntries}'::jsonb` : 'NULL'}, ${legendaryCost});`
                    );
                } else if (dbType === 'sqlite') {
                    inserts.monster_legendary_actions.push(
                        `INSERT INTO monster_legendary_actions (monster_id, name, entries, cost) VALUES (` +
                        `${monsterIdSubquery}, ${legendaryName !== 'NULL' ? `'${legendaryName}'` : 'NULL'}, ${legendaryEntries !== 'NULL' ? `'${legendaryEntries}'` : 'NULL'}, ${legendaryCost});`
                    );
                }
            }
        }

        // monster_legendary_group
        if (monsterData.legendaryGroup) {
            const lgName = monsterData.legendaryGroup.name ? cleanText(monsterData.legendaryGroup.name) : 'NULL';
            const lgSource = monsterData.legendaryGroup.source ? cleanText(monsterData.legendaryGroup.source) : 'NULL';
            inserts.monster_legendary_group.push(
                `INSERT INTO monster_legendary_group (monster_id, name, source) VALUES (` +
                `${monsterIdSubquery}, ${lgName !== 'NULL' ? `'${lgName}'` : 'NULL'}, ${lgSource !== 'NULL' ? `'${lgSource}'` : 'NULL'});`
            );
        }

        // monster_environments
        if (monsterData.environment && Array.isArray(monsterData.environment)) {
            for (const env of monsterData.environment) {
                inserts.monster_environments.push(
                    `INSERT INTO monster_environments (monster_id, environment_name) VALUES (${monsterIdSubquery}, '${cleanText(env)}');`
                );
            }
        }

        // monster_attached_items
        if (monsterData.attachedItems && Array.isArray(monsterData.attachedItems)) {
            for (const item of monsterData.attachedItems) {
                inserts.monster_attached_items.push(
                    `INSERT INTO monster_attached_items (monster_id, item_name) VALUES (${monsterIdSubquery}, '${cleanText(item)}');`
                );
            }
        }

        // monster_tags (combining various tag arrays)
        const tagTypes = {
            traitTags: 'trait',
            senseTags: 'sense',
            actionTags: 'action',
            languageTags: 'language',
            damageTags: 'damage',
            damageTagsSpell: 'damage_spell',
            spellcastingTags: 'spellcasting',
            miscTags: 'misc',
            conditionInflict: 'condition_inflict',
            conditionInflictSpell: 'condition_inflict_spell',
            savingThrowForced: 'saving_throw_forced',
            savingThrowForcedSpell: 'saving_throw_forced_spell',
            damageTagsLegendary: 'damage_legendary',
            savingThrowForcedLegendary: 'saving_throw_forced_legendary'
        };

        for (const key in tagTypes) {
            if (monsterData[key] && Array.isArray(monsterData[key])) {
                for (const tag of monsterData[key]) {
                    inserts.monster_tags.push(
                        `INSERT INTO monster_tags (monster_id, tag_type, tag_name) VALUES (${monsterIdSubquery}, '${tagTypes[key]}', '${cleanText(tag)}');`
                    );
                }
            }
        }

        // monster_variants
        if (monsterData.variant && Array.isArray(monsterData.variant)) {
            for (const variantEntry of monsterData.variant) {
                const variantType = variantEntry.type ? cleanText(variantEntry.type) : 'NULL';
                const variantName = variantEntry.name ? cleanText(variantEntry.name) : 'NULL';
                const variantEntries = variantEntry.entries ? JSON.stringify(variantEntry.entries).replace(/'/g, "''") : 'NULL';
                const versionName = variantEntry._version && variantEntry._version.name ? cleanText(variantEntry._version.name) : 'NULL';
                const addHeadersAs = variantEntry._version && variantEntry._version.addHeadersAs ? cleanText(variantEntry._version.addHeadersAs) : 'NULL';

                if (dbType === 'postgres') {
                    inserts.monster_variants.push(
                        `INSERT INTO monster_variants (monster_id, type, name, entries, version_name, add_headers_as) VALUES (` +
                        `${monsterIdSubquery}, ${variantType !== 'NULL' ? `'${variantType}'` : 'NULL'}, ${variantName !== 'NULL' ? `'${variantName}'` : 'NULL'}, ` +
                        `${variantEntries !== 'NULL' ? `'${variantEntries}'::jsonb` : 'NULL'}, ${versionName !== 'NULL' ? `'${versionName}'` : 'NULL'}, ` +
                        `${addHeadersAs !== 'NULL' ? `'${addHeadersAs}'` : 'NULL'});`
                    );
                } else if (dbType === 'sqlite') {
                    inserts.monster_variants.push(
                        `INSERT INTO monster_variants (monster_id, type, name, entries, version_name, add_headers_as) VALUES (` +
                        `${monsterIdSubquery}, ${variantType !== 'NULL' ? `'${variantType}'` : 'NULL'}, ${variantName !== 'NULL' ? `'${variantName}'` : 'NULL'}, ` +
                        `${variantEntries !== 'NULL' ? `'${variantEntries}'` : 'NULL'}, ${versionName !== 'NULL' ? `'${versionName}'` : 'NULL'}, ` +
                        `${addHeadersAs !== 'NULL' ? `'${addHeadersAs}'` : 'NULL'});`
                    );
                }
            }
        }

        // monster_other_sources
        if (monsterData.otherSources && Array.isArray(monsterData.otherSources)) {
            for (const otherSource of monsterData.otherSources) {
                const osName = otherSource.source ? cleanText(otherSource.source) : 'NULL';
                const osPage = otherSource.page || 'NULL';
                inserts.monster_other_sources.push(
                    `INSERT INTO monster_other_sources (monster_id, source_name, page) VALUES (${monsterIdSubquery}, '${osName}', ${osPage});`
                );
            }
        }

        // monster_reprinted_as
        if (monsterData.reprintedAs && Array.isArray(monsterData.reprintedAs)) {
            for (const reprinted of monsterData.reprintedAs) {
                inserts.monster_reprinted_as.push(
                    `INSERT INTO monster_reprinted_as (monster_id, reprinted_name) VALUES (${monsterIdSubquery}, '${cleanText(reprinted)}');`
                );
            }
        }
    }

    return inserts;
}

function getExistingMonsterNames(filePath) {
    const existingMonsterNames = new Set();
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const monsterRegex = /INSERT INTO monsters \(name,.*?VALUES \('(.*?)',/g;
        let match;
        while ((match = monsterRegex.exec(content)) !== null) {
            existingMonsterNames.add(match[1].replace(/''/g, "'"));
        }
    }
    return existingMonsterNames;
}

async function main() {
    const scriptDir = 'C:\\Projects\\dnd-class-data';
    const rawDataDir = path.join(scriptDir, 'raw-data');
    const postgresInsertsPath = path.join(scriptDir, 'postgres', 'insert_bestiary_postgres.sql');
    const sqliteInsertsPath = path.join(scriptDir, 'sqlite', 'insert_bestiary_sqlite.sql');

    const bestiaryFiles = [
        'bestiary-xge.json',
        'bestiary-vgm.json',
        'bestiary-mtf.json',
        'bestiary-mpmm.json',
        'bestiary-mm.json',
        'bestiary-dmg.json'
    ];

    let allBestiaryData = [];

    for (const file of bestiaryFiles) {
        const filePath = path.join(rawDataDir, file);
        try {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            allBestiaryData.push(...(data.monster || []));
        } catch (error) {
            console.error(`Error reading ${file}: ${error.message}`);
        }
    }

    const pgExistingMonsterNames = getExistingMonsterNames(postgresInsertsPath);
    const sqliteExistingMonsterNames = getExistingMonsterNames(sqliteInsertsPath);

    const pgInserts = generateInserts(allBestiaryData, 'postgres', pgExistingMonsterNames);
    const sqliteInserts = generateInserts(allBestiaryData, 'sqlite', sqliteExistingMonsterNames);

    // Write PostgreSQL inserts
    let pgOutput = ''
    for (const table in pgInserts) {
        pgOutput += `-- ${table.replace(/_/g, ' ').replace(/monster/g, 'Monster')} Inserts\n` + pgInserts[table].join('\n') + '\n\n';
    }
    fs.writeFileSync(path.join(scriptDir, 'insert_bestiary_postgres.sql'), pgOutput, 'utf-8');
    console.log('Generated insert_bestiary_postgres.sql in the root directory.');

    // Write SQLite inserts
    let sqliteOutput = ''
    for (const table in sqliteInserts) {
        sqliteOutput += `-- ${table.replace(/_/g, ' ').replace(/monster/g, 'Monster')} Inserts\n` + sqliteInserts[table].join('\n') + '\n\n';
    }
    fs.writeFileSync(path.join(scriptDir, 'insert_bestiary_sqlite.sql'), sqliteOutput, 'utf-8');
    console.log('Generated insert_bestiary_sqlite.sql in the root directory.');
}

main();