"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DarkPupitar = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class DarkPupitar extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.DARK];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Larvitar';
        this.cardType = F;
        this.additionalCardTypes = [D];
        this.hp = 80;
        this.weakness = [{ type: G }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Dark Streak',
                cost: [C, C],
                damage: 20,
                text: 'Flip a coin. If heads, each Defending Pokémon is now Paralyzed.'
            },
            {
                name: 'Rock Tumble',
                cost: [F, C, C],
                damage: 40,
                text: 'This attack\'s damage is not affected by Resistance.'
            }
        ];
        this.set = 'TRR';
        this.setNumber = '41';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Dark Pupitar';
        this.fullName = 'Dark Pupitar TRR';
    }
    reduceEffect(store, state, effect) {
        // Dark Streak
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, prefabs_1.ADD_PARALYZED_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
                }
            });
        }
        // Rock Tumble
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            effect.ignoreResistance = true;
        }
        return state;
    }
}
exports.DarkPupitar = DarkPupitar;
