"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jumpluff = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Jumpluff extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Skiploom';
        this.cardType = G;
        this.hp = 90;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: W, value: -20 }];
        this.retreat = [];
        this.powers = [{
                name: 'Cowardice',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), you may discard all cards attached to this Pokémon and return it to your hand. You can\'t use this Ability during your first turn or on the turn this Pokémon was put into play.'
            }];
        this.attacks = [{
                name: 'Acrobatics',
                cost: [G],
                damage: 20,
                damageCalculation: '+',
                text: 'Flip 2 coins. This attack does 30 more damage for each heads.'
            }];
        this.set = 'DRX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '3';
        this.name = 'Jumpluff';
        this.fullName = 'Jumpluff DRX';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            const pokemonCardList = cardList;
            const jumpluffCard = pokemonCardList.getPokemonCard();
            if (!jumpluffCard) {
                return state;
            }
            const pokemons = pokemonCardList.getPokemons();
            const otherCards = cardList.cards.filter(card => !(card instanceof pokemon_card_1.PokemonCard) &&
                !pokemons.includes(card) &&
                (!pokemonCardList.tools || !pokemonCardList.tools.includes(card)));
            const tools = [...pokemonCardList.tools];
            // Move tools to discard first
            if (tools.length > 0) {
                for (const tool of tools) {
                    pokemonCardList.moveCardTo(tool, player.hand);
                }
            }
            // Move other cards to hand
            if (otherCards.length > 0) {
                prefabs_1.MOVE_CARDS(store, state, cardList, player.hand, { cards: otherCards });
            }
            // Move Pokémon to hand
            if (pokemons.length > 0) {
                prefabs_1.MOVE_CARDS(store, state, cardList, player.hand, { cards: pokemons });
            }
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            return prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 2, results => {
                let heads = 0;
                results.forEach(r => {
                    if (r)
                        heads++;
                });
                effect.damage += 30 * heads;
            });
        }
        return state;
    }
}
exports.Jumpluff = Jumpluff;
