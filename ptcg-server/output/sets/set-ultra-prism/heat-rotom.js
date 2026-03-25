"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeatRotom = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const trainer_card_1 = require("../../game/store/card/trainer-card");
class HeatRotom extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 90;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.powers = [{
                name: 'Roto Motor',
                powerType: game_1.PowerType.ABILITY,
                text: 'If you have 9 or more Pokémon Tool cards in your discard pile, ignore all Energy in the attack cost of each of this Pokémon\'s attacks.'
            }];
        this.attacks = [
            {
                name: 'Heat Blast',
                cost: [R, C, C],
                damage: 80,
                text: ''
            }
        ];
        this.set = 'UPR';
        this.setNumber = '24';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Heat Rotom';
        this.fullName = 'Heat Rotom UPR';
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
        return state;
    }
}
exports.HeatRotom = HeatRotom;
