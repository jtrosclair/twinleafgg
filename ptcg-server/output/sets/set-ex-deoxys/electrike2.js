"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Electrike2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Electrike2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 50;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Recharge',
                cost: [L],
                damage: 0,
                text: 'Search your deck for a [L] Energy card and attach it to Electrike. Shuffle your deck afterward.',
            },
            {
                name: 'Quick Attack',
                cost: [C, C],
                damage: 10,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 10 damage plus 20 more damage.',
            }];
        this.set = 'DX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '60';
        this.name = 'Electrike';
        this.fullName = 'Electrike DX 60';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, player.deck, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, name: 'Lightning Energy' }, { allowCancel: false, min: 0, max: 1 }), transfers => {
                transfers = transfers || [];
                // Attach energy if selected
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    (0, prefabs_1.MOVE_CARDS)(store, state, player.deck, target, { cards: [transfer.card], sourceCard: this, sourceEffect: this.attacks[0] });
                }
                (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, attack_effects_1.FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE)(store, state, effect, 20);
        }
        return state;
    }
}
exports.Electrike2 = Electrike2;
