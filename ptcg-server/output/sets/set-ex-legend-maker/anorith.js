"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Anorith = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Anorith extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Claw Fossil';
        this.cardType = F;
        this.hp = 70;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Influence',
                cost: [C],
                damage: 0,
                text: 'Search your deck for Omanyte, Kabuto, Aerodactyl, Lileep, or Anorith and put up to 2 of them onto your Bench. Shuffle your deck afterward. Treat the new Benched Pokémon as Basic Pokémon.'
            },
            {
                name: 'Stretch Claws',
                cost: [C, C],
                damage: 20,
                text: 'If Anorith has any React Energy cards attached to it, this attack does 20 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }];
        this.set = 'LM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '29';
        this.name = 'Anorith';
        this.fullName = 'Anorith LM';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            const blocked = [];
            effect.player.deck.cards.forEach((card, index) => {
                if (card instanceof pokemon_card_1.PokemonCard && (card.name === 'Omanyte' || card.name === 'Kabuto' || card.name === 'Aerodactyl' || card.name === 'Lileep' || card.name === 'Anorith')) {
                    return;
                }
                else {
                    blocked.push(index);
                }
            });
            (0, prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH)(store, state, effect.player, {}, { min: 0, max: 2, blocked });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            if (effect.source.cards.some(c => c.name === 'React Energy')) {
                (0, attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON)(20, effect, store, state);
            }
        }
        return state;
    }
}
exports.Anorith = Anorith;
