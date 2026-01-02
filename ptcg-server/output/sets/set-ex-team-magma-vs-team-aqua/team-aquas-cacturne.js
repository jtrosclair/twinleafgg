"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamAquasCacturne = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const costs_1 = require("../../game/store/prefabs/costs");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class TeamAquasCacturne extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Team Aqua\'s Cacnea';
        this.tags = [card_types_1.CardTag.TEAM_AQUA];
        this.cardType = G;
        this.additionalCardTypes = [D];
        this.hp = 80;
        this.weakness = [{ type: R }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Dark Bind',
                cost: [D],
                damage: 10,
                text: 'You may discard a [D] Energy card attached to Team Aqua\'s Cacturne. If you do, the Defending Pokémon is now Paralyzed.'
            },
            {
                name: 'Poison Barb',
                cost: [G, C, C],
                damage: 40,
                text: 'The Defending Pokémon is now Poisoned.'
            }];
        this.set = 'MA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '1';
        this.name = 'Team Aqua\'s Cacturne';
        this.fullName = 'Team Aqua\'s Cacturne MA';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            prefabs_1.CONFIRMATION_PROMPT(store, state, effect.player, result => {
                if (result) {
                    costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1, card_types_1.CardType.DARK);
                    attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
                }
            });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED(store, state, effect);
        }
        return state;
    }
}
exports.TeamAquasCacturne = TeamAquasCacturne;
