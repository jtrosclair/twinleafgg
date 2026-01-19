"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Regice = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const attack_effects_2 = require("../../game/store/effects/attack-effects");
class Regice extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 90;
        this.weakness = [{ type: M }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Regi Move',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), you may use this power. Discard 2 cards from your hand and choose 1 of your opponent\'s Active Pokémon that isn\'t an Evolved Pokémon. Then, your opponent switches that Pokémon with 1 of his or her Benched Pokémon. This power can\'t be used if Regice is affected by a Special Condition.'
            }];
        this.attacks = [
            {
                name: 'Ice Reflect',
                cost: [W, W, C],
                damage: 50,
                text: 'If Regice was damaged by an attack during your opponent\'s last turn, the Defending Pokémon is now Paralyzed.'
            }
        ];
        this.set = 'LA';
        this.setNumber = '36';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Regice';
        this.fullName = 'Regice LA';
        this.REGI_MOVE_MARKER = 'REGI_MOVE_MARKER';
        this.ICE_REFLECT_MARKER = 'ICE_REFLECT_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            (0, prefabs_1.REMOVE_MARKER)(this.REGI_MOVE_MARKER, effect.player, this);
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.REGI_MOVE_MARKER, this);
        (0, prefabs_1.REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN)(effect, this.ICE_REFLECT_MARKER, this);
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if (player.marker.hasMarker(this.REGI_MOVE_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            if (player.active.cards[0] === this && player.active.specialConditions.length > 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.hand.cards.length < 2) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, {}, { allowCancel: true, min: 2, max: 2 }), cards => {
                cards = cards || [];
                if (cards.length === 0) {
                    return;
                }
                const opponent = game_1.StateUtils.getOpponent(state, player);
                player.hand.moveCardsTo(cards, player.discard);
                (0, prefabs_1.ADD_MARKER)(this.REGI_MOVE_MARKER, player, this);
                (0, prefabs_1.ABILITY_USED)(player, this);
                if (opponent.active.getPokemons().length < 2) {
                    (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, opponent);
                }
                else {
                    // Rulings state that you can discard cards even if the opponent's active is evolved
                    return state;
                }
            });
        }
        // Not sure how to manage the markers on this
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            if ((0, prefabs_1.HAS_MARKER)(this.ICE_REFLECT_MARKER, player, this)) {
                (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED)(store, state, effect);
            }
        }
        if (effect instanceof attack_effects_2.AfterDamageEffect && effect.target.cards.includes(this)) {
            const targetPlayer = game_1.StateUtils.findOwner(state, effect.target);
            const player = effect.player;
            if (effect.damage <= 0 || player === targetPlayer || targetPlayer.active !== effect.target) {
                return state;
            }
            (0, prefabs_1.ADD_MARKER)(this.ICE_REFLECT_MARKER, targetPlayer, this);
            console.log('added ice marker');
        }
        return state;
    }
}
exports.Regice = Regice;
