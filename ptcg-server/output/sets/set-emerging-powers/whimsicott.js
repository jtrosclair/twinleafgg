"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Whimsicott = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const attach_energy_prompt_1 = require("../../game/store/prompts/attach-energy-prompt");
class Whimsicott extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Cottonee';
        this.cardType = G;
        this.hp = 80;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: W, value: -20 }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Helping Hand',
                cost: [C],
                damage: 0,
                text: 'Search your deck for a basic Energy card and attach it to 1 of your Benched Pokémon. Shuffle your deck afterward.'
            },
            {
                name: 'Cotton Guard',
                cost: [G],
                damage: 30,
                text: 'During your opponent\'s next turn, any damage done to this Pokémon by attacks is reduced by 30 (after applying Weakness and Resistance).'
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '11';
        this.name = 'Whimsicott';
        this.fullName = 'Whimsicott EPO';
        this.COTTON_GUARD_MARKER = 'WHIMSICOTT_COTTON_GUARD_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const hasBench = player.bench.some(b => b.cards.length > 0);
            if (!hasBench) {
                (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
                return state;
            }
            return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_ATTACH, player.deck, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { min: 0, max: 1, allowCancel: false }), cards => {
                if (cards && cards.length > 0) {
                    return store.prompt(state, new attach_energy_prompt_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.deck, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: false, min: 0, max: 1 }), transfers => {
                        for (const transfer of transfers || []) {
                            const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                            player.deck.moveCardTo(cards[0], target);
                        }
                        (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
                    });
                }
                else {
                    (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            player.active.marker.addMarker(this.COTTON_GUARD_MARKER, this);
        }
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.target.marker.hasMarker(this.COTTON_GUARD_MARKER, this)) {
            effect.damage = Math.max(0, effect.damage - 30);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.active.marker.removeMarker(this.COTTON_GUARD_MARKER, this);
        }
        return state;
    }
}
exports.Whimsicott = Whimsicott;
