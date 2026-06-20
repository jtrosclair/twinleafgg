"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Miraidon = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const energy_card_1 = require("../../game/store/card/energy-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Miraidon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 120;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.powers = [{
                name: 'Photon Code',
                powerType: game_1.PowerType.ABILITY,
                text: 'If this Pokémon is in the Active Spot and is Knocked Out by damage from 1 of your opponent\'s Pokémon\'s attacks, move 2 Basic [L] Energy from this Pokémon to 1 of your Benched Pokémon.',
            }];
        this.attacks = [{
                name: 'Thunder',
                cost: [L, L],
                damage: 90,
                text: 'This Pokémon also does 30 damage to itself.',
            }];
        this.set = 'M5';
        this.setNumber = '27';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Miraidon';
        this.fullName = 'Miraidon M5';
    }
    isEligibleBasicLightningEnergy(card) {
        return card instanceof energy_card_1.EnergyCard
            && card.energyType === card_types_1.EnergyType.BASIC
            && card.provides.some(p => p === card_types_1.CardType.LIGHTNING || p === card_types_1.CardType.ANY || p === card_types_1.CardType.WLFM);
    }
    reduceEffect(store, state, effect) {
        // Ref: set-paradox-rift/veluza.ts (Filet Memento)
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target.cards.includes(this)) {
            const player = effect.player;
            if (effect.target !== player.active) {
                return state;
            }
            if (!player.marker.hasMarker(player.DAMAGE_DEALT_MARKER)) {
                return state;
            }
            if (!(0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                const activeCopy = new game_1.PokemonCardList();
                activeCopy.cards = effect.target.cards.slice();
                const blocked = activeCopy.cards
                    .map((c, idx) => (this.isEligibleBasicLightningEnergy(c) ? -1 : idx))
                    .filter(idx => idx >= 0);
                return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, activeCopy, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY }, {
                    blocked,
                    validCardTypes: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.ANY, card_types_1.CardType.WLFM],
                    allowCancel: false,
                    min: 0,
                    max: 2,
                }), transfers => {
                    transfers = transfers || [];
                    let moved = 0;
                    for (const transfer of transfers) {
                        if (!transfer || !this.isEligibleBasicLightningEnergy(transfer.card)) {
                            continue;
                        }
                        if (moved >= 2) {
                            break;
                        }
                        const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                        state = (0, prefabs_1.MOVE_CARDS)(store, state, player.discard, target, { cards: [transfer.card] });
                        moved += 1;
                    }
                });
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF)(store, state, effect, 30);
        }
        return state;
    }
}
exports.Miraidon = Miraidon;
