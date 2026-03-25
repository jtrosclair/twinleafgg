"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Azelf = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Azelf extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 60;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Trading Places',
                cost: [C],
                damage: 0,
                text: 'Switch this Pokémon with 1 of your Benched Pokémon.'
            },
            {
                name: 'Psyjamming',
                cost: [P, C, C],
                damage: 0,
                text: 'Move as many Special Energy attached to your opponent\'s Pokémon to your opponent\'s other Pokémon in any way you like.'
            }
        ];
        this.set = 'PLB';
        this.setNumber = '38';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Azelf';
        this.fullName = 'Azelf PLB';
        this.usedTradingPlaces = false;
        this.usedPsyjamming = false;
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Trading Places - switch after damage
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            this.usedTradingPlaces = true;
        }
        // Attack 2: Psyjamming - move opponent's special energy
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            this.usedPsyjamming = true;
        }
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.usedTradingPlaces) {
            this.usedTradingPlaces = false;
            const player = effect.player;
            if (player.bench.some((b) => b.cards.length > 0)) {
                state = (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, player) || state;
            }
        }
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.usedPsyjamming) {
            this.usedPsyjamming = false;
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Build blocked map - only allow moving Special Energy cards
            const blockedMap = [];
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                const blocked = [];
                cardList.cards.forEach((c, index) => {
                    if (c.superType !== card_types_1.SuperType.ENERGY || c.energyType !== card_types_1.EnergyType.SPECIAL) {
                        blocked.push(index);
                    }
                });
                if (blocked.length !== cardList.cards.length) {
                    blockedMap.push({ source: target, blocked });
                }
            });
            if (blockedMap.length === 0) {
                return state;
            }
            return store.prompt(state, new game_1.MoveEnergyPrompt(player.id, game_1.GameMessage.MOVE_ENERGY_CARDS, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], {}, { allowCancel: true, blockedMap }), transfers => {
                if (transfers === null) {
                    return;
                }
                for (const transfer of transfers) {
                    if (transfer.from.player === transfer.to.player
                        && transfer.from.slot === transfer.to.slot
                        && transfer.from.index === transfer.to.index) {
                        continue;
                    }
                    const source = game_1.StateUtils.getTarget(state, opponent, transfer.from);
                    const target = game_1.StateUtils.getTarget(state, opponent, transfer.to);
                    source.moveCardTo(transfer.card, target);
                }
            });
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            this.usedTradingPlaces = false;
            this.usedPsyjamming = false;
        }
        return state;
    }
}
exports.Azelf = Azelf;
