"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Victini = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Victini extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 70;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Victory Sign',
                cost: [R],
                damage: 0,
                text: 'Search your deck for up to 2 basic Energy cards of different types and attach them to your Pokémon in any way you like. Then, shuffle your deck.'
            },
            {
                name: 'Flare',
                cost: [R],
                damage: 20,
                text: ''
            }
        ];
        this.set = 'UNM';
        this.setNumber = '26';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Victini';
        this.fullName = 'Victini UNM';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Victory Sign
        // Refs: set-ultra-prism/shaymin.ts (Coax - differentTypes search), set-unbroken-bonds/kyurem.ts (Call Forth Cold - attach energy)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                return state;
            }
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { min: 0, max: 2, allowCancel: true, differentTypes: true }), selected => {
                const cards = selected || [];
                if (cards.length === 0) {
                    return (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
                }
                // Attach each energy to a Pokemon one by one
                const attachNext = (index) => {
                    if (index >= cards.length) {
                        (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
                        return;
                    }
                    store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_ATTACH_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), targets => {
                        if (targets && targets.length > 0) {
                            player.deck.moveCardTo(cards[index], targets[0]);
                        }
                        attachNext(index + 1);
                    });
                };
                attachNext(0);
            });
        }
        return state;
    }
}
exports.Victini = Victini;
