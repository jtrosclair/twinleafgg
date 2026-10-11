"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Espeon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Espeon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Eevee';
        this.hp = 110;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Miraculous Shine',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Devolve each of your opponent\'s evolved Pokémon by putting the highest Stage Evolution card on it into your opponent\'s hand.'
            },
            {
                name: 'Super Psy Bolt',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 90,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '69';
        this.name = 'Espeon';
        this.fullName = 'Espeon 30C';
    }
    reduceEffect(store, state, effect) {
        // Ref: set-ancient-origins/claydol.ts (Rewind — devolve each opponent evolved Pokémon)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.active.getPokemons().length > 1) {
                (0, prefabs_1.DEVOLVE_POKEMON)(store, state, opponent.active, opponent.hand);
            }
            opponent.bench.forEach(benchSpot => {
                if (benchSpot.cards.length > 0 && benchSpot.getPokemons().length > 1) {
                    (0, prefabs_1.DEVOLVE_POKEMON)(store, state, benchSpot, opponent.hand);
                }
            });
        }
        return state;
    }
}
exports.Espeon = Espeon;
