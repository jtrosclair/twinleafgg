"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Yveltal = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Yveltal extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 130;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Blow Through',
                cost: [D],
                damage: 20,
                damageCalculation: '+',
                text: 'If there is any Stadium card in play, this attack does 20 more damage.'
            },
            {
                name: 'Shadow Impact',
                cost: [D, D, C],
                damage: 120,
                text: 'Put 3 damage counters on 1 of your Pokémon.'
            }
        ];
        this.set = 'UNM';
        this.setNumber = '139';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Yveltal';
        this.fullName = 'Yveltal UNM';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Blow Through
        // Ref: set-unbroken-bonds/dugtrio.ts (Home Ground - stadium check)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const stadiumCard = game_1.StateUtils.getStadiumCard(state);
            if (stadiumCard !== undefined) {
                effect.damage += 20;
            }
        }
        // Attack 2: Shadow Impact
        // Ref: set-lost-thunder/giratina.ts (Shadow Impact - put damage counters on own Pokemon)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), selected => {
                const targets = selected || [];
                targets.forEach(target => {
                    const putCountersEffect = new attack_effects_1.PutCountersEffect(effect, 30);
                    putCountersEffect.target = target;
                    store.reduceEffect(state, putCountersEffect);
                });
            });
        }
        return state;
    }
}
exports.Yveltal = Yveltal;
