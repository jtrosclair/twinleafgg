"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gholdengo = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Gholdengo extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.GRASS, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.evolvesFrom = 'Gimmighoul';
        this.attacks = [{
                name: 'Strike It Rich',
                cost: [card_types_1.CardType.METAL],
                damage: 30,
                damageCalculation: '+',
                text: 'If this Pokémon evolved from Gimmighoul during this turn, this attack does 90 more damage.'
            },
            {
                name: 'Surf Back',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 100,
                text: 'You may shuffle this Pokémon and all attached cards into your deck.'
            }];
        this.set = 'SSP';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.fullName = 'Gholdengo SSP';
        this.name = 'Gholdengo';
        this.setNumber = '131';
    }
    reduceEffect(store, state, effect) {
        // From Lokix PAL 21
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const cardList = game_1.StateUtils.findCardList(state, this);
            if (cardList instanceof game_1.PokemonCardList) {
                if (cardList.pokemonPlayedTurn === state.turn) {
                    effect.damage += 90;
                }
            }
            //From Mew V FST
        }
        else if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            return store.prompt(state, new game_1.ConfirmPrompt(player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    player.active.moveTo(player.deck);
                    player.active.clearEffects();
                    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                        player.deck.applyOrder(order);
                        return state;
                    });
                }
                else {
                    return state;
                }
            });
        }
        return state;
    }
}
exports.Gholdengo = Gholdengo;
