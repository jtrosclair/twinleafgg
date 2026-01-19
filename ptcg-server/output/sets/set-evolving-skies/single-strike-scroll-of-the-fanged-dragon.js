"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingleStrikeScrollOfTheFangedDragon = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class SingleStrikeScrollOfTheFangedDragon extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.tags = [card_types_1.CardTag.SINGLE_STRIKE];
        this.regulationMark = 'E';
        this.set = 'EVS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '158';
        this.name = 'Single Strike Scroll of the Fanged Dragon';
        this.fullName = 'Single Strike Scroll of the Fanged Dragon EVS';
        this.attacks = [{
                name: 'Superstrong Slash',
                cost: [F, M, M, C, C],
                damage: 300,
                text: 'Discard all Energy from this Pokémon.'
            }];
        this.text = 'The Single Strike Pokémon this card is attached to can use the attack on this card. (You still need the necessary Energy to use this attack.)';
    }
    reduceEffect(store, state, effect) {
        var _a, _b;
        if (effect instanceof check_effects_1.CheckPokemonAttacksEffect && ((_a = effect.player.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tools.includes(this)) &&
            !effect.attacks.includes(this.attacks[0]) && ((_b = effect.player.active.getPokemonCard()) === null || _b === void 0 ? void 0 : _b.tags.includes(card_types_1.CardTag.SINGLE_STRIKE))) {
            if ((0, prefabs_1.IS_TOOL_BLOCKED)(store, state, effect.player, this)) {
                return state;
            }
            effect.attacks.push(this.attacks[0]);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            (0, prefabs_1.DISCARD_ALL_ENERGY_FROM_POKEMON)(store, state, effect, this);
        }
        return state;
    }
}
exports.SingleStrikeScrollOfTheFangedDragon = SingleStrikeScrollOfTheFangedDragon;
