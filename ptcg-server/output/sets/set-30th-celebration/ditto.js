"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ditto = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Ditto extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 70;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Surprisingly Transform',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Flip a coin. If heads, search your deck for a Pokémon and switch it with this Pokémon. Any attached cards, damage counters, Special Conditions, turns in play, and any other effects remain on the new Pokémon. If you switched a Pokémon in this way, put this card into your deck. Then, shuffle your deck.'
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '115';
        this.name = 'Ditto';
        this.fullName = 'Ditto 30C';
    }
    reduceEffect(store, state, effect) {
        // Surprisingly Transform
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const targetCardList = game_1.StateUtils.findCardList(state, this);
            if (!(targetCardList instanceof game_1.PokemonCardList)) {
                return state;
            }
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (!result) {
                    return;
                }
                store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, player.deck, { superType: card_types_1.SuperType.POKEMON }, { min: 1, max: 1, allowCancel: true }), selection => {
                    if (!selection || selection.length <= 0) {
                        return;
                    }
                    const pokemonCard = selection[0];
                    if (!(pokemonCard instanceof pokemon_card_1.PokemonCard)) {
                        return;
                    }
                    store.log(state, game_1.GameLog.LOG_PLAYER_TRANSFORMS_INTO_POKEMON, {
                        name: player.name,
                        pokemon: this.name,
                        card: pokemonCard.name,
                        effect: this.attacks[0].name,
                    });
                    (0, prefabs_1.MOVE_CARDS)(store, state, player.deck, targetCardList, { cards: [pokemonCard], sourceCard: this });
                    (0, prefabs_1.MOVE_CARDS)(store, state, targetCardList, player.deck, { cards: [this], sourceCard: this });
                    (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
                });
            });
        }
        return state;
    }
}
exports.Ditto = Ditto;
