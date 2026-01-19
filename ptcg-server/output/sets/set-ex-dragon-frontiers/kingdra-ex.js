"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kingdraex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Kingdraex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Seadra';
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.DELTA_SPECIES];
        this.cardType = F;
        this.hp = 140;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.powers = [{
                name: 'Extra Smoke',
                powerType: game_1.PowerType.POKEBODY,
                text: 'Any damage done to your Stage 2 Pokémon-ex by your opponent\'s attacks is reduced by 10 (before applying Weakness and Resistance).'
            }];
        this.attacks = [{
                name: 'Energy Link',
                cost: [F, C],
                damage: 40,
                text: 'Search your discard pile for an Energy card and attach it to Kingdra ex.'
            },
            {
                name: 'Protective Swirl',
                cost: [F, C, C],
                damage: 80,
                text: 'Kingdra ex has no Weakness during your opponent\'s next turn.'
            }];
        this.set = 'DF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '94';
        this.name = 'Kingdra ex';
        this.fullName = 'Kingdra ex DF';
        this.PROTECTIVE_MARKER = 'PROTECTIVE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutDamageEffect && !(0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, effect.player, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let isKingdraInPlay = false;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                if (card === this) {
                    isKingdraInPlay = true;
                }
            });
            if (!isKingdraInPlay) {
                return state;
            }
            const target = effect.target.getPokemonCard();
            if ((target === null || target === void 0 ? void 0 : target.stage) === card_types_1.Stage.STAGE_2 && (target === null || target === void 0 ? void 0 : target.tags.includes(card_types_1.CardTag.POKEMON_ex))) {
                effect.damage -= 10;
            }
        }
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            const player = effect.player;
            if (!player.discard.cards.some(card => card.superType === card_types_1.SuperType.ENERGY)) {
                return state;
            }
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_ACTIVE, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: 1, max: 1 }), transfers => {
                transfers = transfers || [];
                // cancelled by user
                if (transfers.length === 0) {
                    return;
                }
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    (0, prefabs_1.MOVE_CARDS)(store, state, player.discard, target, { cards: [transfer.card], sourceCard: this, sourceEffect: this.attacks[0] });
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.ADD_MARKER)(this.PROTECTIVE_MARKER, effect.player.active, this);
        }
        if (effect instanceof check_effects_1.CheckPokemonStatsEffect && (0, prefabs_1.HAS_MARKER)(this.PROTECTIVE_MARKER, effect.target, this)) {
            if (effect.target.getPokemonCard() === this) {
                effect.weakness = [];
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, pokemon => {
                if ((0, prefabs_1.HAS_MARKER)(this.PROTECTIVE_MARKER, pokemon, this)) {
                    (0, prefabs_1.REMOVE_MARKER)(this.PROTECTIVE_MARKER, pokemon, this);
                }
            });
        }
        return state;
    }
}
exports.Kingdraex = Kingdraex;
