"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RocketsWobbuffet = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class RocketsWobbuffet extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.ROCKETS];
        this.cardType = D;
        this.hp = 70;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Dark Aid',
                cost: [C],
                damage: 0,
                text: 'Search your discard pile for Pokémon Tool cards and Rocket\'s Secret Machine cards. You may show either 1 Pokémon Tool card or Rocket\'s Secret Machine card to your opponent and put it into your hand, or show a combination of 3 Pokémon Tool cards or Rocket\'s Secret Machine cards to your opponent and shuffle them into your deck.'
            },
            {
                name: 'Amnesia',
                cost: [P, C],
                damage: 10,
                text: 'Choose 1 of the Defending Pokémon\'s attacks. That Pokémon can\'t use that attack during your opponent\'s next turn.'
            }];
        this.set = 'TRR';
        this.name = 'Rocket\'s Wobbuffet';
        this.fullName = 'Rocket\'s Wobbuffet TRR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '47';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const blocked = [];
            player.discard.cards.forEach((c, index) => {
                const isTool = c instanceof game_1.TrainerCard && c.trainerType === card_types_1.TrainerType.TOOL;
                const isSecretMachine = c instanceof game_1.TrainerCard && c.tags.includes(card_types_1.CardTag.ROCKETS_SECRET_MACHINE);
                if (!isTool && !isSecretMachine) {
                    blocked.push(index);
                }
            });
            if (blocked.length === player.discard.cards.length) {
                return state;
            }
            const options = [
                {
                    message: game_1.GameMessage.CHOOSE_CARD_TO_DECK,
                    action: () => {
                        let cards = [];
                        store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DECK, player.discard, {}, { min: 0, max: 3, allowCancel: false, blocked }), selected => {
                            cards = selected || [];
                            cards.forEach((card, index) => {
                                store.log(state, game_1.GameLog.LOG_PLAYER_RETURNS_TO_DECK_FROM_DISCARD, { name: player.name, card: card.name });
                            });
                            (0, prefabs_1.MOVE_CARDS)(store, state, player.discard, player.deck, { cards });
                            (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
                        });
                    }
                },
                {
                    message: game_1.GameMessage.CHOOSE_CARD_TO_HAND,
                    action: () => {
                        let cards = [];
                        store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, {}, { min: 1, max: 1, allowCancel: false, blocked }), selected => {
                            cards = selected || [];
                            cards.forEach((card, index) => {
                                store.log(state, game_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
                            });
                            (0, prefabs_1.MOVE_CARDS)(store, state, player.discard, player.hand, { cards });
                        });
                    }
                }
            ];
            return store.prompt(state, new game_1.SelectPrompt(player.id, game_1.GameMessage.CHOOSE_OPTION, options.map(opt => opt.message), { allowCancel: false }), choice => {
                const option = options[choice];
                option.action();
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const pokemonCard = opponent.active.getPokemonCard();
            if (pokemonCard === undefined || pokemonCard.attacks.length === 0 || pokemonCard.stage !== card_types_1.Stage.BASIC) {
                return state;
            }
            store.prompt(state, new game_1.ChooseAttackPrompt(player.id, game_1.GameMessage.CHOOSE_ATTACK_TO_DISABLE, [pokemonCard], { allowCancel: false }), result => {
                result;
                if (!result) {
                    return state;
                }
                this.DISABLED_ATTACK = result;
                store.log(state, game_1.GameLog.LOG_PLAYER_DISABLES_ATTACK, {
                    name: player.name,
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    attack: this.DISABLED_ATTACK.name
                });
                opponent.active.marker.addMarker(game_1.PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER, this);
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.player.active.marker.hasMarker(game_1.PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER, this)) {
            if (effect.attack === this.DISABLED_ATTACK) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.active.marker.hasMarker(game_1.PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER, this)) {
            effect.player.marker.removeMarker(game_1.PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER, this);
            this.DISABLED_ATTACK = undefined;
        }
        return state;
    }
}
exports.RocketsWobbuffet = RocketsWobbuffet;
