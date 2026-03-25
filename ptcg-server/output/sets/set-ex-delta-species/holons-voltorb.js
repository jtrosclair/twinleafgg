"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HolonsVoltorb = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class HolonsVoltorb extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.HOLONS];
        this.cardType = L;
        this.hp = 40;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.powers = [{
                name: 'Special Energy Effect',
                powerType: game_1.PowerType.HOLONS_SPECIAL_ENERGY_EFFECT,
                useFromHand: true,
                text: 'You may attach this as an Energy card from your hand to 1 of your Pokémon. While attached, this card is a Special Energy card and provides [C] Energy. [Click this effect to use it.]'
            }];
        this.attacks = [{
                name: 'Thundershock',
                cost: [L],
                damage: 10,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
            }];
        this.set = 'DS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '71';
        this.name = 'Holon\'s Voltorb';
        this.fullName = 'Holon\'s Voltorb DS';
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        // EnergyCard interface properties
        this.text = '';
        this.isBlocked = false;
        this.blendedEnergies = [];
        this.blendedEnergyCount = 1;
        this.energyEffect = undefined;
    }
    reduceEffect(store, state, effect) {
        // Auto-detect if we've been removed from energies and reset superType back to POKEMON
        if (this.superType === card_types_1.SuperType.ENERGY) {
            const cardList = game_1.StateUtils.findCardList(state, this);
            if (!(cardList instanceof game_1.PokemonCardList) || !cardList.energies.cards.includes(this)) {
                this.superType = card_types_1.SuperType.POKEMON;
            }
        }
        // The Special Energy Stuff
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if (player.energyPlayedTurn === state.turn) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            player.energyPlayedTurn = state.turn;
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_ATTACH_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                if (!targets || targets.length === 0) {
                    return;
                }
                // Moving it onto the pokemon - first to main cards array, then to energies
                effect.preventDefault = true;
                player.hand.moveCardTo(this, targets[0]);
                if (!targets[0].energies.cards.includes(this)) {
                    targets[0].energies.cards.push(this);
                }
                this.superType = card_types_1.SuperType.ENERGY;
            });
        }
        // Provide energy when attached as energy and included in CheckProvidedEnergyEffect
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.energies.cards.includes(this)) {
            effect.energyMap.push({ card: this, provides: this.provides });
        }
        // Thundershock
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, (result => {
                if (result) {
                    (0, prefabs_1.ADD_PARALYZED_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
                }
            }));
        }
        return state;
    }
}
exports.HolonsVoltorb = HolonsVoltorb;
