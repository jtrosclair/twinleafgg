"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lickitung = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Lickitung extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.DELTA_SPECIES];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 60;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Lap Up',
                cost: [C],
                damage: 0,
                text: 'Draw 2 cards.'
            },
            {
                name: 'Delta Mind',
                cost: [P],
                damage: 0,
                text: 'Put 1 damage counter on 1 of your opponent\'s Pokémon. If that Pokémon has delta on its card, put 3 damage counters instead.'
            }];
        this.set = 'DF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '19';
        this.name = 'Lickitung';
        this.fullName = 'Lickitung DF';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            prefabs_1.DRAW_CARDS(effect.player, 2);
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                var _a, _b;
                if (!targets || targets.length === 0) {
                    return;
                }
                let damageAmount = 10;
                if ((_b = (_a = targets[0].getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags) === null || _b === void 0 ? void 0 : _b.includes(card_types_1.CardTag.DELTA_SPECIES)) {
                    damageAmount = 30;
                }
                const damageEffect = new attack_effects_1.PutCountersEffect(effect, damageAmount);
                damageEffect.target = targets[0];
                store.reduceEffect(state, damageEffect);
            });
        }
        return state;
    }
}
exports.Lickitung = Lickitung;
