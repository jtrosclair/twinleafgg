"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Glalie = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attach_energy_prompt_1 = require("../../game/store/prompts/attach-energy-prompt");
const card_types_1 = require("../../game/store/card/card-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_message_1 = require("../../game/game-message");
const state_utils_1 = require("../../game/store/state-utils");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
class Glalie extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.TEAM_PLASMA];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Snorunt';
        this.cardType = W;
        this.hp = 100;
        this.weakness = [{ type: M }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Powder Snow',
                cost: [W, C],
                damage: 30,
                text: 'The Defending Pok\u00e9mon is now Asleep.'
            },
            {
                name: 'Reflect Energy',
                cost: [W, C, C],
                damage: 60,
                text: 'Move a [W] Energy from this Pok\u00e9mon to 1 of your Benched Pok\u00e9mon.'
            }
        ];
        this.set = 'PLB';
        this.setNumber = '22';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Glalie';
        this.fullName = 'Glalie PLB';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const hasBench = player.bench.some(b => b.cards.length > 0);
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, player.active);
            state = store.reduceEffect(state, checkProvidedEnergy);
            const waterProvidingCards = new Set();
            checkProvidedEnergy.energyMap.forEach(em => {
                if (em.card.superType === card_types_1.SuperType.ENERGY
                    && (em.provides.includes(card_types_1.CardType.WATER) || em.provides.includes(card_types_1.CardType.ANY))) {
                    waterProvidingCards.add(em.card);
                }
            });
            const blocked = [];
            player.active.cards.forEach((card, index) => {
                if (card.superType !== card_types_1.SuperType.ENERGY || !waterProvidingCards.has(card)) {
                    blocked.push(index);
                }
            });
            if (blocked.length !== player.active.cards.length && hasBench) {
                return store.prompt(state, new attach_energy_prompt_1.AttachEnergyPrompt(player.id, game_message_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.active, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false, blocked }), transfers => {
                    if (transfers && transfers.length > 0) {
                        for (const transfer of transfers) {
                            const target = state_utils_1.StateUtils.getTarget(state, player, transfer.to);
                            player.active.moveCardTo(transfer.card, target);
                        }
                    }
                });
            }
        }
        return state;
    }
}
exports.Glalie = Glalie;
