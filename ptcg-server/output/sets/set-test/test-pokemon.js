"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestPokemon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class TestPokemon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 1000;
        this.weakness = [{ type: D }];
        this.retreat = [];
        this.powers = [
            {
                name: 'Have Your Cake',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Add as many cards as you want from your deck to your hand.'
            },
            {
                name: 'Extremely Cursed Blast',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, both players Active Pokemon are Knocked Out.'
            },
            {
                name: 'Draw 1 From Top',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Draw 1 card from the top of your deck.'
            },
            {
                name: 'Draw 1 From Bottom',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Draw 1 card from the bottom of your deck.'
            },
            {
                name: 'Status Chaos',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Your opponent\'s Active Pokémon is now Poisoned, Asleep, Paralyzed, and Confused.'
            }
        ];
        this.attacks = [
            {
                name: 'A Bit Much',
                cost: [],
                damage: 100,
                text: ''
            },
        ];
        this.set = 'TEST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '1';
        this.name = 'Test Pokemon';
        this.fullName = 'Test Pokemon TEST';
    }
    reduceEffect(store, state, effect) {
        var _a, _b;
        if (effect instanceof game_effects_1.MoveCardsEffect && ((_a = effect.cards) === null || _a === void 0 ? void 0 : _a.includes(this)) && ((_b = effect.sourceCard) === null || _b === void 0 ? void 0 : _b.name) === 'Roxie') {
            const playerPokemon = game_1.StateUtils.findOwner(state, effect.source);
            const opponentPokemon = game_1.StateUtils.getOpponent(state, playerPokemon);
            opponentPokemon.forEachPokemon(game_1.PlayerType.TOP_PLAYER, cardList => {
                if (cardList.getPokemonCard() === opponentPokemon.active.getPokemonCard()) {
                    cardList.damage += 100;
                }
            });
        }
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {}, { min: 0, max: 60, allowCancel: false }), cards => {
                player.deck.moveCardsTo(cards, player.hand);
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (cardList.getPokemonCard() === this) {
                        cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                    }
                });
                state = store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
                return state;
            });
        }
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentActive = opponent.active.getPokemonCard();
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    cardList.damage += 999;
                }
            });
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, cardList => {
                if (cardList.getPokemonCard() === opponentActive) {
                    const damageEffect = new game_effects_1.EffectOfAbilityEffect(player, this.powers[0], this, cardList);
                    store.reduceEffect(state, damageEffect);
                    if (damageEffect.target) {
                        damageEffect.target.damage += 999;
                    }
                }
            });
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[2]) {
            const player = effect.player;
            player.deck.moveCardTo(player.deck.cards[0], player.hand);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[3]) {
            const player = effect.player;
            player.deck.moveCardTo(player.deck.cards[player.deck.cards.length - 1], player.hand);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[4]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentActive = opponent.active.getPokemonCard();
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, cardList => {
                if (cardList.getPokemonCard() === opponentActive) {
                    // Apply all four status conditions
                    cardList.specialConditions = [
                        ...cardList.specialConditions,
                        card_types_1.SpecialCondition.POISONED,
                        card_types_1.SpecialCondition.ASLEEP,
                        card_types_1.SpecialCondition.PARALYZED,
                        card_types_1.SpecialCondition.CONFUSED,
                        card_types_1.SpecialCondition.BURNED
                    ];
                    // Remove duplicates
                    cardList.specialConditions = [...new Set(cardList.specialConditions)];
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const max = Math.min(2);
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: max, allowCancel: false }), selected => {
                const targets = selected || [];
                targets.forEach(target => {
                    if (target.isOpponentActive(state)) {
                        const damageEffect = new attack_effects_1.PutDamageEffect(effect, 100);
                        damageEffect.target = target;
                        store.reduceEffect(state, damageEffect);
                    }
                    if (target.isOpponentBench(state)) {
                        const damageEffect = new attack_effects_1.PutDamageEffect(effect, 50);
                        damageEffect.target = target;
                        store.reduceEffect(state, damageEffect);
                    }
                });
                return state;
            });
        }
        return state;
    }
}
exports.TestPokemon = TestPokemon;
