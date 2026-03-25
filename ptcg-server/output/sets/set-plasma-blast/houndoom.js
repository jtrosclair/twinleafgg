"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Houndoom = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_2 = require("../../game/store/prefabs/prefabs");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
class Houndoom extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Houndour';
        this.cardType = D;
        this.hp = 100;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Dark Clamp',
                cost: [D, C],
                damage: 30,
                text: 'The Defending Pok\u00e9mon can\'t retreat during your opponent\'s next turn.'
            },
            {
                name: 'Blazing Claws',
                cost: [D, C, C],
                damage: 60,
                damageCalculation: '+',
                text: 'If the Defending Pok\u00e9mon is a Team Plasma Pok\u00e9mon, this attack does 60 more damage, and the Defending Pok\u00e9mon is now Burned.'
            }
        ];
        this.set = 'PLB';
        this.setNumber = '56';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Houndoom';
        this.fullName = 'Houndoom PLB';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.BLOCK_RETREAT)(store, state, effect, this);
        }
        (0, prefabs_2.BLOCK_RETREAT_IF_MARKER)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        (0, prefabs_2.REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const defendingCard = opponent.active.getPokemonCard();
            if (defendingCard && defendingCard.tags.includes(card_types_1.CardTag.TEAM_PLASMA)) {
                effect.damage += 60;
                (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED)(store, state, effect);
            }
        }
        return state;
    }
}
exports.Houndoom = Houndoom;
