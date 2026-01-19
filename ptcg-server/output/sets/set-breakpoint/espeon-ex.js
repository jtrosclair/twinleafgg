"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EspeonEX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class EspeonEX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_EX];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 170;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Miraculous Shine',
                cost: [C],
                damage: 0,
                text: 'Devolve each of your opponent\'s evolved Pokémon and put the highest Stage Evolution card on it into your opponent\'s hand.'
            }, {
                name: 'Psyshock',
                cost: [P, C, C],
                damage: 70,
                shredAttack: true,
                text: 'This attack\'s damage isn\'t affected by any effects on your opponent\'s Active Pokémon.'
            }];
        this.set = 'BKP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '52';
        this.name = 'Espeon EX';
        this.fullName = 'Espeon EX BKP';
    }
    reduceEffect(store, state, effect) {
        // Miraculous Shine
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.active.getPokemonCard()) {
                const activePokemon = opponent.active.getPokemons();
                if (activePokemon.length > 0) {
                    (0, prefabs_1.DEVOLVE_POKEMON)(store, state, opponent.active, opponent.hand);
                }
            }
            opponent.bench.forEach(benchSpot => {
                if (benchSpot.getPokemonCard()) {
                    const benchPokemon = benchSpot.getPokemons();
                    if (benchPokemon.length > 0) {
                        (0, prefabs_1.DEVOLVE_POKEMON)(store, state, benchSpot, opponent.hand);
                    }
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, attack_effects_1.THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS)(store, state, effect, 70);
        }
        return state;
    }
}
exports.EspeonEX = EspeonEX;
