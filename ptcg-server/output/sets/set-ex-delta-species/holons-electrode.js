"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HolonsElectrode = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class HolonsElectrode extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Holon\'s Voltorb';
        this.tags = [card_types_1.CardTag.HOLONS];
        this.cardType = L;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.retreat = [];
        this.powers = [{
                name: 'Special Energy Effect',
                powerType: game_1.PowerType.HOLONS_SPECIAL_ENERGY_EFFECT,
                useFromHand: true,
                text: 'You may attach this as an Energy card from your hand to 1 of your Pokémon that already has an Energy card attached to it. When you attach this card, return an Energy card attached to that Pokémon to your hand. While attached, this card is a Special Energy card and provides every type of Energy but 2 Energy at a time. (Has no effect other than providing Energy.) [Click this effect to use it.]'
            }];
        this.attacks = [{
                name: 'Dazzle Blast',
                cost: [L, C],
                damage: 30,
                text: 'The Defending Pokémon is now Confused.'
            }];
        this.set = 'DS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '21';
        this.name = 'Holon\'s Electrode';
        this.fullName = 'Holon\'s Electrode DS';
        // Which energies this provides when attached as an energy
        this.provides = [card_types_1.CardType.ANY, card_types_1.CardType.ANY];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        // EnergyCard interface properties
        this.text = '';
        this.isBlocked = false;
        this.blendedEnergies = [];
        this.energyEffect = undefined;
    }
    reduceEffect(store, state, effect) {
        // The Special Energy Stuff
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
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
                    // Moving it onto the pokemon
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
            effect.energyMap.push({ card: this, provides: this.provides });
        }
        // Dazzle Blast
        if (prefabs_1.AFTER_ATTACK(effect, 0, this)) {
            prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
        }
        return state;
    }
}
exports.HolonsElectrode = HolonsElectrode;
