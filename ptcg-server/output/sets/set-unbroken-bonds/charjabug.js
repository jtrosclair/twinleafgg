"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Charjabug = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Charjabug extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Grubbin';
        this.cardType = L;
        this.hp = 80;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: M, value: -20 }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Battery',
                powerType: game_1.PowerType.ABILITY,
                useFromHand: true,
                text: 'Once during your turn (before your attack), you may attach this card from your hand to 1 of your Vikavolt or Vikavolt-GX as a Special Energy card. This card provides 2 [L] Energy only while it\'s attached to a Pokémon.'
            }];
        this.attacks = [{
                name: 'Pierce',
                cost: [C, C, C],
                damage: 60,
                text: ''
            }];
        this.set = 'UNB';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '58';
        this.name = 'Charjabug';
        this.fullName = 'Charjabug UNB';
        this.provides = [card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        // EnergyCard interface properties
        this.text = '';
        this.isBlocked = false;
        this.blendedEnergies = [];
        this.energyEffect = undefined;
    }
    reduceEffect(store, state, effect) {
        var _a, _b;
        // The Special Energy Stuff
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            if (player.energyPlayedTurn === state.turn) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            player.energyPlayedTurn = state.turn;
            let isVikavoltActive = false;
            let isVikavoltBenched = false;
            const blockedTo = [];
            if (((_a = player.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.name) !== 'Vikavolt' && ((_b = player.active.getPokemonCard()) === null || _b === void 0 ? void 0 : _b.name) !== 'Vikavolt-GX') {
                const target = {
                    player: game_1.PlayerType.BOTTOM_PLAYER,
                    slot: game_1.SlotType.ACTIVE,
                    index: 0
                };
                blockedTo.push(target);
            }
            else {
                isVikavoltActive = true;
            }
            player.bench.forEach((bench, index) => {
                var _a, _b;
                if (bench.cards.length === 0) {
                    return;
                }
                if (((_a = bench.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.name) === 'Vikavolt' || ((_b = bench.getPokemonCard()) === null || _b === void 0 ? void 0 : _b.name) === 'Vikavolt-GX') {
                    isVikavoltBenched = true;
                }
                else {
                    const target = {
                        player: game_1.PlayerType.BOTTOM_PLAYER,
                        slot: game_1.SlotType.BENCH,
                        index
                    };
                    blockedTo.push(target);
                }
            });
            if (!isVikavoltActive && !isVikavoltBenched) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_ATTACH_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false, blocked: blockedTo }), targets => {
                if (!targets || targets.length === 0) {
                    return;
                }
                // Moving it onto the pokemon - first to main cards array, then to energies
                effect.preventDefault = true;
                player.hand.moveCardTo(this, targets[0]);
                if (!targets[0].energies.cards.includes(this)) {
                    targets[0].energies.cards.push(this);
                }
            });
        }
        // Provide energy when attached as energy and included in CheckProvidedEnergyEffect
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.energies.cards.includes(this)) {
            effect.energyMap.push({ card: this, provides: this.provides });
        }
        return state;
    }
}
exports.Charjabug = Charjabug;
