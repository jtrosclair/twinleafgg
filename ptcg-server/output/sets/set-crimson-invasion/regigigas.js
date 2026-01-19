"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Regigigas = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Regigigas extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 180;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Giant Stomp',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 160,
                text: 'Discard any Stadium card in play.'
            }];
        this.set = 'CIN';
        this.name = 'Regigigas';
        this.fullName = 'Regigigas CIN';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '84';
        this.powers = [{
                name: 'Seal of Antiquity',
                text: 'This Pokémon can\'t attack unless Regirock, Regice, and Registeel are on your Bench.',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: false
            }];
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: game_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            let hasRegirock = false;
            let hasRegice = false;
            let hasRegisteel = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    if (this.name.includes('Regirock')) {
                        hasRegirock = true;
                    }
                    if (this.name.includes('Regice')) {
                        hasRegice = true;
                    }
                    if (this.name.includes('Registeel')) {
                        hasRegisteel = true;
                    }
                }
            });
            if (!hasRegirock || !hasRegice || !hasRegisteel) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_ABILITY);
            }
            return state;
        }
        return state;
    }
}
exports.Regigigas = Regigigas;
