"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToxicroakG = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class ToxicroakG extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_SP];
        this.cardType = F;
        this.hp = 90;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Leap Away',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), if Toxicroak G is your Active Pokémon, you may flip a coin. If heads, return Toxicroak G and all cards attached to it to your hand. This power can\'t be used if Toxicroak G is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Poison Revenge',
                cost: [P, C],
                damage: 20,
                damageCalculation: '+',
                text: 'If any of your Pokémon were Knocked Out by damage from an opponent\'s attack during his or her last turn, this attack does 20 damage plus 40 more damage and the Defending Pokémon is now Poisoned.'
            }];
        this.set = 'DPP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '41';
        this.name = 'Toxicroak G';
        this.fullName = 'Toxicroak G DPP';
        this.LEAP_AWAY_MARKER = 'LEAP_AWAY_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.LEAP_AWAY_MARKER, this);
        }
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            (0, prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION)(player, this);
            if (player.active.getPokemonCard() !== this) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if ((0, prefabs_1.HAS_MARKER)(this.LEAP_AWAY_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            (0, prefabs_1.ADD_MARKER)(this.LEAP_AWAY_MARKER, player, this);
            (0, prefabs_1.ABILITY_USED)(player, this);
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    const pokemonCardList = cardList;
                    const tentacoolCard = pokemonCardList.getPokemonCard();
                    if (!tentacoolCard) {
                        return state;
                    }
                    const pokemons = pokemonCardList.getPokemons();
                    const otherCards = cardList.cards.filter(card => !(card instanceof pokemon_card_1.PokemonCard) &&
                        !pokemons.includes(card) &&
                        (!pokemonCardList.tools || !pokemonCardList.tools.includes(card)));
                    const tools = [...pokemonCardList.tools];
                    // Move tools to discard first
                    if (tools.length > 0) {
                        for (const tool of tools) {
                            pokemonCardList.moveCardTo(tool, player.discard);
                        }
                    }
                    // Move other cards to discard
                    if (otherCards.length > 0) {
                        (0, prefabs_1.MOVE_CARDS)(store, state, cardList, player.discard, { cards: otherCards });
                    }
                    // Move Pokémon to hand
                    if (pokemons.length > 0) {
                        (0, prefabs_1.MOVE_CARDS)(store, state, cardList, player.hand, { cards: pokemons });
                    }
                }
            });
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.LEAP_AWAY_MARKER, this);
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            if (player.marker.hasMarker(marker_constants_1.MarkerConstants.REVENGE_MARKER)) {
                effect.damage += 40;
            }
            return state;
        }
        return state;
    }
}
exports.ToxicroakG = ToxicroakG;
