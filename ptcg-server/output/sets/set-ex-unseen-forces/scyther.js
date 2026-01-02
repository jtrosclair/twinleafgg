"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scyther = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Scyther extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 60;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Twin Play',
                cost: [C],
                damage: 0,
                text: 'Search your deck for up to 2 in any combination of Scyther and Scyther ex and put them onto your Bench. Shuffle your deck afterward.'
            },
            {
                name: 'Agility',
                cost: [C, C],
                damage: 20,
                text: 'Flip a coin. If heads, prevent all effects of an attack, including damage, done to Scyther during your opponent\'s next turn.'
            }];
        this.set = 'UF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '46';
        this.name = 'Scyther';
        this.fullName = 'Scyther UF';
        this.AGILITY_MARKER = 'AGILITY_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const blocked = [];
            player.deck.cards.forEach((card, index) => {
                // eslint-disable-next-line no-empty
                if (card instanceof pokemon_card_1.PokemonCard && (card.name === 'Scyther' || card.name === 'Scyther ex')) {
                    // If the card is Scyther or Scyther ex, it can be searched
                }
                else {
                    blocked.push(index);
                }
            });
            prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(store, state, player, {}, { min: 0, max: 2, blocked });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            prefabs_1.COIN_FLIP_PROMPT(store, state, effect.player, result => {
                if (result) {
                    this.marker.addMarker(this.AGILITY_MARKER, this);
                    prefabs_1.ADD_MARKER(this.AGILITY_MARKER, effect.opponent, this);
                }
            });
        }
        if ((effect instanceof attack_effects_1.PutDamageEffect || effect instanceof attack_effects_1.PutCountersEffect) && effect.target.getPokemonCard() === this) {
            if (this.marker.hasMarker(this.AGILITY_MARKER, this)) {
                effect.preventDefault = true;
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && prefabs_1.HAS_MARKER(this.AGILITY_MARKER, effect.player, this)) {
            prefabs_1.REMOVE_MARKER(this.AGILITY_MARKER, effect.player, this);
            this.marker.removeMarker(this.AGILITY_MARKER, this);
        }
        return state;
    }
}
exports.Scyther = Scyther;
