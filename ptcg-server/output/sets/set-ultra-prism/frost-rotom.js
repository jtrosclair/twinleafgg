"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FrostRotom = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const energy_card_1 = require("../../game/store/card/energy-card");
class FrostRotom extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 90;
        this.weakness = [{ type: M }];
        this.retreat = [C];
        this.powers = [{
                name: 'Roto Motor',
                powerType: game_1.PowerType.ABILITY,
                text: 'If you have 9 or more Pokémon Tool cards in your discard pile, ignore all Energy in the attack cost of each of this Pokémon\'s attacks.'
            }];
        this.attacks = [
            {
                name: 'Frost Crush',
                cost: [W, C],
                damage: 10,
                damageCalculation: '+',
                text: 'This attack does 20 more damage times the amount of Energy attached to all of your opponent\'s Pokémon.'
            }
        ];
        this.set = 'UPR';
        this.setNumber = '41';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Frost Rotom';
        this.fullName = 'Frost Rotom UPR';
    }
    reduceEffect(store, state, effect) {
        // Ability: Roto Motor (passive - ignore energy cost if 9+ tools in discard)
        // Ref: set-steam-siege/yanmega.ts (Sonic Vision - CheckAttackCostEffect passive)
        if (effect instanceof check_effects_1.CheckAttackCostEffect && effect.player.active.cards.includes(this)) {
            const player = effect.player;
            if (player.active.getPokemonCard() !== this) {
                return state;
            }
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            const toolCount = player.discard.cards.filter(c => c instanceof trainer_card_1.TrainerCard && c.trainerType === card_types_1.TrainerType.TOOL).length;
            if (toolCount >= 9) {
                effect.cost = [];
            }
        }
        // Attack 1: Frost Crush
        // Ref: set-guardians-rising/honchkrow.ts (Raven's Claw - counting across opponent's Pokemon)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let totalEnergy = 0;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                totalEnergy += cardList.cards.filter(c => c instanceof energy_card_1.EnergyCard).length;
            });
            effect.damage += 20 * totalEnergy;
        }
        return state;
    }
}
exports.FrostRotom = FrostRotom;
