"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stantler = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Stantler extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Screechy Voice',
                cost: [C],
                damage: 10,
                text: 'If the Defending Pokémon is an Evolved Pokémon, the Defending Pokémon is now Confused.'
            },
            {
                name: 'Push Away',
                cost: [C, C],
                damage: 20,
                text: 'Look at your opponent\'s hand, choose a Trainer card you find there, and discard it.'
            }];
        this.set = 'UF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '32';
        this.name = 'Stantler';
        this.fullName = 'Stantler UF';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            if (effect.opponent.active.getPokemons().length > 1) {
                (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED)(store, state, effect);
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const minDiscard = Math.min(opponent.hand.cards.filter(c => c.superType === card_types_1.SuperType.TRAINER).length, 1);
            let cards = [];
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.hand, { superType: card_types_1.SuperType.TRAINER }, { min: minDiscard, max: 1, allowCancel: false }), selected => {
                cards = selected || [];
                opponent.hand.moveCardsTo(cards, opponent.discard);
            });
        }
        return state;
    }
}
exports.Stantler = Stantler;
