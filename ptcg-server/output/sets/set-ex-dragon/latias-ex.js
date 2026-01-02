"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Latiasex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_message_1 = require("../../game/game-message");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Latiasex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = C;
        this.hp = 90;
        this.weakness = [{ type: C }];
        this.resistance = [{ type: P, value: -30 }, { type: F, value: -30 }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Hypnoblast',
                cost: [C],
                damage: 10,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Asleep.'
            },
            {
                name: 'Mist Ball',
                cost: [R, W, C],
                damage: 100,
                text: 'Discard a [R] Energy and a [W] Energy attached to Latias ex.'
            }];
        this.set = 'DR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '93';
        this.name = 'Latias ex';
        this.fullName = 'Latias ex DR';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.AFTER_ATTACK(effect, 0, this)) {
            prefabs_1.COIN_FLIP_PROMPT(store, state, effect.player, result => {
                if (result) {
                    prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
                }
            });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            state = store.prompt(state, new game_1.ChooseEnergyPrompt(player.id, game_message_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, checkProvidedEnergy.energyMap, [card_types_1.CardType.FIRE, card_types_1.CardType.WATER], { allowCancel: false }), energy => {
                const cards = (energy || []).map(e => e.card);
                const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                discardEnergy.target = player.active;
                store.reduceEffect(state, discardEnergy);
            });
        }
        return state;
    }
}
exports.Latiasex = Latiasex;
