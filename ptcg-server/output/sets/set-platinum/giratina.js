"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Giratina = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Giratina extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 100;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: C, value: -20 }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Let Loose',
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn, when you put Giratina from your hand onto your Bench, you may use this power. Each player shuffles his or her hand into his or her deck and draws up to 4 cards. (You draw your cards first.)'
            }];
        this.attacks = [{
                name: 'Earth Power',
                cost: [P, P, C],
                damage: 60,
                text: 'Flip 2 coins. This attack does 10 damage times the number of heads to each of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }];
        this.set = 'PL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '9';
        this.name = 'Giratina';
        this.fullName = 'Giratina PL';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: game_1.PowerType.POKEPOWER,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    const cards = player.hand.cards.filter(c => c !== this);
                    player.hand.moveCardsTo(cards, player.deck);
                    opponent.hand.moveTo(opponent.deck);
                    store.prompt(state, [
                        new game_1.ShuffleDeckPrompt(player.id),
                        new game_1.ShuffleDeckPrompt(opponent.id)
                    ], deckOrder => {
                        player.deck.applyOrder(deckOrder[0]);
                        opponent.deck.applyOrder(deckOrder[1]);
                        player.deck.moveTo(player.hand, 4);
                        opponent.deck.moveTo(opponent.hand, 4);
                    });
                }
                return state;
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            let heads = 0;
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => { if (result)
                heads++; });
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => { if (result)
                heads++; });
            if (heads > 0) {
                opponent.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, card => {
                    if (card !== opponent.active) {
                        const damage = new attack_effects_1.PutDamageEffect(effect, (10 * heads));
                        damage.target = card;
                        store.reduceEffect(state, damage);
                    }
                });
            }
        }
        return state;
    }
}
exports.Giratina = Giratina;
