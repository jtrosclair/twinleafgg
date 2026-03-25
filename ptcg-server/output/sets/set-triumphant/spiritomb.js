"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spiritomb = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Spiritomb extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 60;
        this.resistance = [{ type: C, value: -20 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Spooky Whirlpool',
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn, when you put Spiritomb from your hand onto your Bench, you may use this power. Your opponent shuffles his or her hand into his or her deck and draws 6 cards.'
            }];
        this.attacks = [{
                name: 'Color Tag',
                cost: [P],
                damage: 0,
                text: 'Choose [G], [R], [W], [L], [P], [F], [D], [M], or [C] type. Put 1 damage counter on each Pokémon your opponent has in play of the type you chose.'
            }];
        this.set = 'TM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '10';
        this.name = 'Spiritomb';
        this.fullName = 'Spiritomb TM';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Try to reduce PowerEffect, to check if something is blocking our ability
            if ((0, prefabs_1.IS_POKEPOWER_BLOCKED)(store, state, player, this)) {
                return state;
            }
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                    store.reduceEffect(state, powerEffect);
                    opponent.hand.moveTo(opponent.deck);
                    (0, prefabs_1.SHUFFLE_DECK)(store, state, opponent);
                    (0, prefabs_1.DRAW_CARDS)(opponent, 6);
                }
                return state;
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            const options = [
                { value: card_types_1.CardType.COLORLESS, message: 'Colorless' },
                { value: card_types_1.CardType.DARK, message: 'Dark' },
                { value: card_types_1.CardType.FIGHTING, message: 'Fighting' },
                { value: card_types_1.CardType.FIRE, message: 'Fire' },
                { value: card_types_1.CardType.GRASS, message: 'Grass' },
                { value: card_types_1.CardType.LIGHTNING, message: 'Lightning' },
                { value: card_types_1.CardType.METAL, message: 'Metal' },
                { value: card_types_1.CardType.PSYCHIC, message: 'Psychic' },
                { value: card_types_1.CardType.WATER, message: 'Water' }
            ];
            return store.prompt(state, new game_1.SelectPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGY_TYPE, options.map(c => c.message), { allowCancel: false }), choice => {
                // Inside PowerEffect block after selecting energy type
                const option = options[choice];
                if (!option) {
                    return state;
                }
                opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, target => {
                    const checkPokemonTypeEffect = new check_effects_1.CheckPokemonTypeEffect(target);
                    store.reduceEffect(state, checkPokemonTypeEffect);
                    if (checkPokemonTypeEffect.cardTypes.includes(option.value)) {
                        const putCountersEffect = new attack_effects_1.PutCountersEffect(effect, 10);
                        putCountersEffect.target = target;
                        store.reduceEffect(state, putCountersEffect);
                    }
                });
            });
        }
        return state;
    }
}
exports.Spiritomb = Spiritomb;
