"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Numel = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Numel extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 80;
        this.weakness = [{ type: W }];
        this.resistance = [];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Incandescent Body',
                powerType: game_1.PowerType.ABILITY,
                text: 'If this Pokémon is in the Active Spot and is damaged by an attack from your opponent\'s Pokémon (even if this Pokémon is Knocked Out), the Attacking Pokémon is now Burned.',
            }];
        this.attacks = [{
                name: 'Combustion',
                cost: [R, C],
                damage: 20,
                text: ''
            }];
        this.regulationMark = 'I';
        this.set = 'ASC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '27';
        this.name = 'Numel';
        this.fullName = 'Numel M2a';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.AfterDamageEffect && effect.target.cards.includes(this)) {
            const player = effect.player;
            const targetPlayer = game_1.StateUtils.findOwner(state, effect.target);
            if (effect.damage <= 0 || player === targetPlayer || targetPlayer.active !== effect.target) {
                return state;
            }
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            if (state.phase === game_1.GamePhase.ATTACK) {
                effect.source.addSpecialCondition(card_types_1.SpecialCondition.BURNED);
            }
        }
        return state;
    }
}
exports.Numel = Numel;
