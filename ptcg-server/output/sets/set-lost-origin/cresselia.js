"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cresselia = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Cresselia extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 120;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Moonglow Reverse',
                cost: [P],
                damage: 0,
                text: 'Move 2 damage counters from each of your Pokémon to 1 of your opponent\'s Pokémon.'
            },
            {
                name: 'Lunar Blast',
                cost: [P, P, C],
                damage: 110,
                text: ''
            }
        ];
        this.set = 'LOR';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '74';
        this.name = 'Cresselia';
        this.fullName = 'Cresselia LOR';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const targets = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (cardList.damage > 0) {
                    targets.push(cardList);
                }
            });
            let totalHealed = 0;
            targets.forEach(target => {
                const damageToMove = Math.min(target.damage, 20);
                target.damage -= damageToMove;
                totalHealed += damageToMove;
            });
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { min: 1, max: 1, allowCancel: false }), selected => {
                const selectedTargets = selected || [];
                selectedTargets.forEach(target => {
                    const putCountersEffect = new attack_effects_1.PutCountersEffect(effect, totalHealed);
                    putCountersEffect.target = target;
                    store.reduceEffect(state, putCountersEffect);
                });
                return state;
            });
        }
        return state;
    }
}
exports.Cresselia = Cresselia;
