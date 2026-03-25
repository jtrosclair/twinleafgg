"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bronzong = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Bronzong extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Bronzor';
        this.cardType = M;
        this.hp = 110;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C, C, C, C];
        this.powers = [{
                name: 'Heal Block',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Damage can\'t be healed from any Pokémon (both yours and your opponent\'s). (Damage counters can still be moved.)'
            }];
        this.attacks = [{
                name: 'Oracle Inflict',
                cost: [M, C, C],
                damage: 30,
                text: 'Does 10 more damage for each card in your opponent\'s hand.'
            }];
        this.set = 'NXD';
        this.setNumber = '76';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Bronzong';
        this.fullName = 'Bronzong NXD';
    }
    reduceEffect(store, state, effect) {
        // Heal Block - prevent all healing
        if (effect instanceof game_effects_1.HealEffect) {
            // Check if any Bronzong with this ability is in play
            let bronzongInPlay = false;
            let bronzongOwner = null;
            state.players.forEach(player => {
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                    if (cardList.getPokemonCard() === this) {
                        bronzongInPlay = true;
                        bronzongOwner = player;
                    }
                });
            });
            if (bronzongInPlay && bronzongOwner) {
                if (!(0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, bronzongOwner, this)) {
                    effect.preventDefault = true;
                }
            }
        }
        // Oracle Inflict - bonus damage based on opponent's hand size
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            const handSize = opponent.hand.cards.length;
            effect.damage += handSize * 10;
        }
        return state;
    }
}
exports.Bronzong = Bronzong;
