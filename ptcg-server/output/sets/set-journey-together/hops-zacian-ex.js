"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HopsZacianex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class HopsZacianex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.HOPS, card_types_1.CardTag.POKEMON_ex];
        this.cardType = M;
        this.hp = 230;
        this.retreat = [C, C];
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.attacks = [{
                name: 'Insta-Strike',
                cost: [C],
                damage: 30,
                text: 'This attack also does 30 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Brave Slash',
                cost: [M, M, M, C],
                damage: 240,
                text: 'During your next turn, this Pokémon can\'t use Brave Slash.'
            }];
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.set = 'JTG';
        this.setNumber = '111';
        this.name = 'Hop\'s Zacian ex';
        this.fullName = 'Hop\'s Zacian ex JTG';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasBenched = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                return state;
            }
            state = store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                if (!targets || targets.length === 0) {
                    return;
                }
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 30);
                damageEffect.target = targets[0];
                store.reduceEffect(state, damageEffect);
            });
            return state;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            if (!player.active.cannotUseAttacksNextTurnPending.includes('Brave Slash')) {
                player.active.cannotUseAttacksNextTurnPending.push('Brave Slash');
            }
        }
        return state;
    }
}
exports.HopsZacianex = HopsZacianex;
