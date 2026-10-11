"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mewtwoex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Mewtwoex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.hp = 230;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Photon Bullets',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.PSYCHIC],
                damage: 0,
                text: "This attack does 50 damage to each of your opponent's Pokémon ex. (Don't apply Weakness and Resistance for Benched Pokémon.)",
            },
            {
                name: 'Psychic Powers',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.PSYCHIC, card_types_1.CardType.PSYCHIC],
                damage: 230,
                text: "During your next turn, this Pokémon can't use attacks.",
            }];
        this.regulationMark = 'J';
        this.set = 'M6a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '55';
        this.name = 'Mewtwo ex';
        this.fullName = 'Mewtwo ex 30C';
        this.usSetNumber = '30C 64';
    }
    reduceEffect(store, state, effect) {
        // Photon Bullets
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const activeCard = opponent.active.getPokemonCard();
            if (activeCard === null || activeCard === void 0 ? void 0 : activeCard.tags.includes(card_types_1.CardTag.POKEMON_ex)) {
                const dealDamage = new attack_effects_1.DealDamageEffect(effect, 50);
                dealDamage.target = opponent.active;
                store.reduceEffect(state, dealDamage);
            }
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                if (cardList === opponent.active) {
                    return;
                }
                const pokemonCard = cardList.getPokemonCard();
                if (pokemonCard === null || pokemonCard === void 0 ? void 0 : pokemonCard.tags.includes(card_types_1.CardTag.POKEMON_ex)) {
                    const putDamage = new attack_effects_1.PutDamageEffect(effect, 50);
                    putDamage.target = cardList;
                    store.reduceEffect(state, putDamage);
                }
            });
        }
        // Psychic Powers
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            effect.player.active.cannotAttackNextTurnPending = true;
        }
        return state;
    }
}
exports.Mewtwoex = Mewtwoex;
