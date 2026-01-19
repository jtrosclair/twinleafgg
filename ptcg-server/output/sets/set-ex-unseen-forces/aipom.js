"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Aipom = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Aipom extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 50;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.powers = [{
                name: 'Snappy Move',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), if Aipom is on your Bench, you may draw a card. Then, discard all cards attached to Aipom and put Aipom on the bottom of your deck. You can\'t use more than 1 Snappy Move Poké-Power each turn.'
            }];
        this.attacks = [{
                name: 'Snap tail',
                cost: [C],
                damage: 0,
                text: 'Choose 1 of your opponent\'s Pokémon. This attack does 10 damage to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }];
        this.set = 'UF';
        this.name = 'Aipom';
        this.fullName = 'Aipom UF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '34';
        this.SNAPPY_MOVE_MARKER = 'SNAPPY_MOVE_MARKER';
    }
    reduceEffect(store, state, effect) {
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.SNAPPY_MOVE_MARKER, this);
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            // check if on player's Bench
            const benchIndex = player.bench.indexOf(cardList);
            if (benchIndex === -1) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if ((0, prefabs_1.HAS_MARKER)(this.SNAPPY_MOVE_MARKER, player)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const aipomSlot = player.bench[benchIndex];
            const aipomCard = aipomSlot.getPokemonCard();
            if (!aipomCard) {
                return state;
            }
            const pokemons = aipomSlot.getPokemons();
            const otherCards = aipomSlot.cards.filter(card => !(card instanceof pokemon_card_1.PokemonCard) &&
                !pokemons.includes(card) &&
                (!aipomSlot.tools || !aipomSlot.tools.includes(card)));
            const tools = [...aipomSlot.tools];
            // Move tools to discard first
            if (tools.length > 0) {
                for (const tool of tools) {
                    aipomSlot.moveCardTo(tool, player.discard);
                }
            }
            // Move other cards to discard
            if (otherCards.length > 0) {
                (0, prefabs_1.MOVE_CARDS)(store, state, aipomSlot, player.discard, { cards: otherCards });
            }
            // Move Pokémon to bottom of deck
            if (pokemons.length > 0) {
                (0, prefabs_1.MOVE_CARDS)(store, state, aipomSlot, player.deck, { cards: pokemons, toBottom: true });
            }
            aipomSlot.clearEffects();
            (0, prefabs_1.DRAW_CARDS)(player, 1);
            (0, prefabs_1.ADD_MARKER)(this.SNAPPY_MOVE_MARKER, player, this);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON)(10, effect, store, state);
        }
        return state;
    }
}
exports.Aipom = Aipom;
