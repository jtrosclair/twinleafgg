"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mesprit = void 0;
const game_effects_1 = require("../../game/store/effects/game-effects");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Mesprit extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC, value: +20 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Psychic Bind',
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn, when you put Mesprit from your hand onto your Bench, you may use this power. Your opponent can\'t use any Poké-Powers on his or her Pokémon during your opponent\'s next turn.'
            }];
        this.attacks = [{
                name: 'Extrasensory',
                cost: [P, P],
                damage: 20,
                damageCalculation: '+',
                text: 'If you have the same number of cards in your hand as your opponent, this attack does 20 damage plus 50 more damage.'
            }];
        this.set = 'LA';
        this.name = 'Mesprit';
        this.fullName = 'Mesprit LA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '34';
        this.PSYCHIC_BIND_MARKER = 'PSYCHIC_BIND_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            if ((0, prefabs_1.IS_POKEPOWER_BLOCKED)(store, state, player, this)) {
                return state;
            }
            (0, prefabs_1.CONFIRMATION_PROMPT)(store, state, player, result => {
                if (result) {
                    const opponent = game_1.StateUtils.getOpponent(state, player);
                    (0, prefabs_1.ADD_MARKER)(this.PSYCHIC_BIND_MARKER, opponent, this);
                    // Log the ability usage
                    store.log(state, game_1.GameLog.LOG_PLAYER_USES_ABILITY, { name: this.name, ability: this.powers[0].name });
                }
            });
        }
        if (effect instanceof game_effects_1.PowerEffect && (0, prefabs_1.HAS_MARKER)(this.PSYCHIC_BIND_MARKER, effect.player, this)
            && (effect.power.powerType === game_1.PowerType.POKEPOWER)) {
            throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.PSYCHIC_BIND_MARKER, this);
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            if (effect.player.hand.cards.length === effect.opponent.hand.cards.length) {
                effect.damage += 50;
            }
        }
        return state;
    }
}
exports.Mesprit = Mesprit;
