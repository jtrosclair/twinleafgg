"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Flygonex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Flygonex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.DELTA_SPECIES, card_types_1.CardTag.POKEMON_ex];
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Vibrava';
        this.cardType = P;
        this.hp = 150;
        this.retreat = [C, C];
        this.powers = [{
                name: 'Sand Damage',
                powerType: game_1.PowerType.POKEBODY,
                text: 'As long as Flygon ex is your Active Pokémon, put 1 damage counter on each of your opponent\'s Benched Basic Pokémon between turns. You can\'t use more than 1 Sand Damage Poké-Body between turns.'
            }];
        this.attacks = [{
                name: 'Psychic Pulse',
                cost: [P, P, C],
                damage: 80,
                text: 'Does 10 damage to each of your opponent\'s Benched Pokémon that has any damage counters on it. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }];
        this.set = 'DF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '92';
        this.name = 'Flygon ex';
        this.fullName = 'Flygon ex DF 92';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.BetweenTurnsEffect && effect.player.active.getPokemonCard() === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if ((0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                if (cardList === opponent.active) {
                    return;
                }
                // ex era ruling is that this should mean unevolved
                if (cardList.getPokemons().length === 1 || card.tags.includes(card_types_1.CardTag.LEGEND)) {
                    cardList.damage += (10);
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const opponent = effect.opponent;
            const benched = opponent.bench.filter(b => b.cards.length > 0);
            benched.forEach(target => {
                if (target.damage !== 0) {
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, 10);
                    damageEffect.target = target;
                    store.reduceEffect(state, damageEffect);
                }
            });
        }
        return state;
    }
}
exports.Flygonex = Flygonex;
