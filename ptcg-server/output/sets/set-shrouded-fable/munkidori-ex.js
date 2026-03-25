"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Munkidoriex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Munkidoriex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = D;
        this.weakness = [{ type: F }];
        this.hp = 210;
        this.retreat = [C];
        this.powers = [{
                name: 'Oh No You Don\'t',
                powerType: game_1.PowerType.ABILITY,
                text: 'If this Pokémon is Knocked Out by damage from an attack from your opponent\'s Pokémon, and if you have any Pecharunt ex in play, your opponent takes 1 fewer Prize card.'
            }];
        this.attacks = [{
                name: 'Dirty Headbutt',
                cost: [D, D, C],
                damage: 190,
                text: 'During your next turn, this Pokémon can\'t use Dirty Headbutt.'
            }];
        this.regulationMark = 'H';
        this.set = 'SFA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '37';
        this.name = 'Munkidori ex';
        this.fullName = 'Munkidori ex SFA';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target.cards.includes(this)) {
            const player = effect.player;
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            if (player.pecharuntexIsInPlay == true) {
                effect.prizeCount -= 1;
            }
        }
        // Dirty Headbutt
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            if (!player.active.cannotUseAttacksNextTurnPending.includes('Dirty Headbutt')) {
                player.active.cannotUseAttacksNextTurnPending.push('Dirty Headbutt');
            }
        }
        return state;
    }
}
exports.Munkidoriex = Munkidoriex;
