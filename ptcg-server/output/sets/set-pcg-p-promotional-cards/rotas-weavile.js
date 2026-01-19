"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RotasWeavile = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class RotasWeavile extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Night Attack',
                cost: [D],
                damage: 0,
                text: 'Choose 1 of your opponent\'s Pokémon in play and put 1 damage counter on it.'
            },
            {
                name: 'Slash',
                cost: [C, C, C],
                damage: 30,
                text: ''
            }];
        this.set = 'PCGP';
        this.name = 'Rota\'s Weavile';
        this.fullName = 'Rota\'s Weavile PCGP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '89';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), selected => {
                const targets = selected || [];
                targets.forEach(target => {
                    const damageEffect = new attack_effects_1.PutCountersEffect(effect, 10);
                    damageEffect.target = target;
                    store.reduceEffect(state, damageEffect);
                });
                return state;
            });
        }
        return state;
    }
}
exports.RotasWeavile = RotasWeavile;
