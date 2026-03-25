"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shedinja = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Shedinja extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Nincada';
        this.cardType = P;
        this.hp = 60;
        this.retreat = [];
        this.powers = [{
                name: 'Empty Shell',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'If this Pokemon is Knocked Out, your opponent can\'t take any Prize cards for it.'
            }];
        this.attacks = [
            {
                name: 'Cursed Drop',
                cost: [P],
                damage: 0,
                text: 'Put 3 damage counters on your opponent\'s Pokemon in any way you like.'
            }
        ];
        this.set = 'DRX';
        this.setNumber = '48';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Shedinja';
        this.fullName = 'Shedinja DRX';
    }
    reduceEffect(store, state, effect) {
        // Ability: Empty Shell - No prizes when KO'd
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target.cards.includes(this)) {
            const pokemonCard = effect.target.getPokemonCard();
            if (pokemonCard === this) {
                const player = game_1.StateUtils.findOwner(state, effect.target);
                if (!(0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                    effect.prizeCount = 0;
                }
            }
        }
        // Attack: Cursed Drop
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE)(3, store, state, effect);
        }
        return state;
    }
}
exports.Shedinja = Shedinja;
