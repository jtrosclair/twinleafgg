"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Persian = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Persian extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Meowth';
        this.cardType = C;
        this.hp = 100;
        this.weakness = [{ type: F }];
        this.retreat = [];
        this.powers = [{
                name: 'Gathering of Cats',
                powerType: game_1.PowerType.ABILITY,
                text: 'Ignore all Energy in the attack costs of each of your Pokémon in play that has the Caturday attack.'
            }];
        this.attacks = [{
                name: 'Claw Slash',
                cost: [C, C, C],
                damage: 90,
                text: ''
            }];
        this.set = 'UNB';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '148';
        this.name = 'Persian';
        this.fullName = 'Persian UNB';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckAttackCostEffect) {
            const player = effect.player;
            let isPersianInPlay = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isPersianInPlay = true;
                }
            });
            if (!isPersianInPlay) {
                return state;
            }
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            const pokemonCard = player.active.getPokemonCard();
            const pokemonAttacks = new check_effects_1.CheckPokemonAttacksEffect(player);
            store.reduceEffect(state, pokemonAttacks);
            if (pokemonCard && pokemonAttacks.attacks.some(attack => attack.name === 'Caturday')) {
                effect.cost = [];
            }
        }
        return state;
    }
}
exports.Persian = Persian;
