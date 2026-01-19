"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DarkTyranitar = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class DarkTyranitar extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.DARK];
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Dark Pupitar';
        this.cardType = F;
        this.additionalCardTypes = [D];
        this.hp = 120;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Sand Damage',
                powerType: game_1.PowerType.POKEBODY,
                text: 'As long as Dark Tyranitar is your Active Pokémon, put 1 damage counter on each of your opponent\'s Benched Basic Pokémon between turns. You can\'t use more than 1 Sand Damage Poké-Body between turns.'
            }];
        this.attacks = [
            {
                name: 'Second Strike',
                cost: [F, C, C],
                damage: 50,
                damageCalculation: '+',
                text: 'If the Defending Pokémon already has at least 2 damage counters on it, this attack does 50 damage plus 20 more damage.'
            }
        ];
        this.set = 'TRR';
        this.setNumber = '20';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Dark Tyranitar';
        this.fullName = 'Dark Tyranitar TRR 20';
    }
    reduceEffect(store, state, effect) {
        // Sand Damage
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
        // Second Strike
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            if (effect.opponent.active.damage >= 20) {
                effect.damage += 20;
            }
        }
        return state;
    }
}
exports.DarkTyranitar = DarkTyranitar;
