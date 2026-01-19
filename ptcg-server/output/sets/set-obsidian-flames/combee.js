"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Combee = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Combee extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 50;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Share',
                cost: [G],
                damage: 0,
                text: 'Heal 20 damage from 1 of your Benched Pokémon.'
            },
            {
                name: 'Ram',
                cost: [G, G],
                damage: 20,
                text: ''
            }
        ];
        this.set = 'OBF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '8';
        this.name = 'Combee';
        this.fullName = 'Combee OBF';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                if (!targets || targets.length === 0) {
                    return;
                }
                const damageEffect = new attack_effects_1.HealTargetEffect(effect, 40);
                damageEffect.target = targets[0];
                store.reduceEffect(state, damageEffect);
            });
        }
        return state;
    }
}
exports.Combee = Combee;
