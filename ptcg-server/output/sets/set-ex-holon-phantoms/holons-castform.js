"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HolonsCastform = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class HolonsCastform extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.HOLONS];
        this.cardType = C;
        this.hp = 50;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.powers = [{
                name: 'Special Energy Effect',
                powerType: game_1.PowerType.HOLONS_SPECIAL_ENERGY_EFFECT,
                useFromHand: true,
                text: 'You may attach this as an Energy card from your hand to 1 of your Pokémon that already has an Energy card attached to it. When you attach this card, return an Energy card attached to that Pokémon to your hand. While attached, this card is a Special Energy card and provides every type of Energy but 2 Energy at a time. (Has no effect other than providing Energy.) [Click this effect to use it.]'
            }];
        this.attacks = [{
                name: 'Delta Draw',
                cost: [C],
                damage: 0,
                text: 'Count the number of Pokémon you have in play that has δ on its card. Draw up to that many cards.'
            }];
        this.set = 'HP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '44';
        this.name = 'Holon\'s Castform';
        this.fullName = 'Holon\'s Castform HP';
        // Which energies this provides when not attached as an energy
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        // EnergyCard interface properties
        this.text = '';
        this.isBlocked = false;
        this.blendedEnergies = [];
        this.energyEffect = undefined;
    }
    reduceEffect(store, state, effect) {
        // The Special Energy Stuff
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if (player.energyPlayedTurn === state.turn) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            player.energyPlayedTurn = state.turn;
            let isEnergyOnBench = false;
            let isEnergyOnActive = false;
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, player.active);
            state = store.reduceEffect(state, checkProvidedEnergy);
            const activeEnergyCount = checkProvidedEnergy.energyMap.length;
            if (activeEnergyCount > 0) {
                isEnergyOnActive = true;
            }
            const blockedTo = [];
            if (!isEnergyOnActive) {
                const target = {
                    player: game_1.PlayerType.BOTTOM_PLAYER,
                    slot: game_1.SlotType.ACTIVE,
                    index: 0
                };
                blockedTo.push(target);
            }
            player.bench.forEach((bench, index) => {
                if (bench.cards.length === 0) {
                    return;
                }
                const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, bench);
                state = store.reduceEffect(state, checkProvidedEnergy);
                const energyCount = checkProvidedEnergy.energyMap.length;
                if (energyCount > 0) {
                    isEnergyOnBench = true;
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
            if (!isEnergyOnActive && !isEnergyOnBench) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_ATTACH_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false, blocked: blockedTo }), targets => {
                if (!targets || targets.length === 0) {
                    return;
                }
                const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, targets[0]);
                state = store.reduceEffect(state, checkProvidedEnergy);
                return store.prompt(state, new game_1.ChooseEnergyPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGIES_TO_HAND, checkProvidedEnergy.energyMap, [card_types_1.CardType.COLORLESS], { allowCancel: false }), energy => {
                    const cards = (energy || []).map(e => e.card);
                    store.log(state, game_1.GameLog.LOG_PLAYER_CHOOSES, { name: player.name, string: '' + cards[0].name });
                    targets[0].moveCardsTo(cards, player.hand);
                    // Moving it onto the pokemon - first to main cards array, then to energies
                    effect.preventDefault = true;
                    player.hand.moveCardTo(this, targets[0]);
                    if (!targets[0].energies.cards.includes(this)) {
                        targets[0].energies.cards.push(this);
                    }
                });
            });
        }
        // Provide energy when attached as energy and included in CheckProvidedEnergyEffect
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.energies.cards.includes(this)) {
            effect.energyMap.push({ card: this, provides: [card_types_1.CardType.ANY, card_types_1.CardType.ANY] });
        }
        // Delta Draw
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            let deltasInPlay = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, card => {
                var _a;
                if ((_a = card.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.DELTA_SPECIES)) {
                    deltasInPlay++;
                }
            });
            (0, prefabs_1.DRAW_UP_TO_X_CARDS)(store, state, player, deltasInPlay);
        }
        return state;
    }
}
exports.HolonsCastform = HolonsCastform;
