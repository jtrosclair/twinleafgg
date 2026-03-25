"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lunatone = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Lunatone extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 60;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.powers = [{
                name: 'Lunar Eclipse',
                powerType: game_1.PowerType.POKEPOWER,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), if Solrock is in play, you may use this power. Until the end of your turn, Lunatone\'s type is [D]. This power can\'t be used if Lunatone is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Cosmic Draw',
                cost: [C],
                damage: 0,
                text: 'If your opponent has any Evolved Pokémon in play, draw 3 cards.'
            },
            {
                name: 'Lunar Blast',
                cost: [P, C],
                damage: 30,
                text: ''
            }];
        this.set = 'SS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '8';
        this.name = 'Lunatone';
        this.fullName = 'Lunatone SS';
        this.LUNAR_ECLIPSE_MARKER = 'LUNAR_ECLIPSE_MARKER';
    }
    reduceEffect(store, state, effect) {
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.LUNAR_ECLIPSE_MARKER, this);
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION)(player, this);
            if ((0, prefabs_1.HAS_MARKER)(this.LUNAR_ECLIPSE_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            let isSolrockInPlay = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card.name === 'Solrock') {
                    isSolrockInPlay = true;
                }
            });
            if (!isSolrockInPlay) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            (0, prefabs_1.ABILITY_USED)(player, this);
            (0, prefabs_1.ADD_MARKER)(this.LUNAR_ECLIPSE_MARKER, player, this);
        }
        if (effect instanceof check_effects_1.CheckPokemonTypeEffect && effect.target.getPokemonCard() === this) {
            const player = game_1.StateUtils.findOwner(state, effect.target);
            if ((0, prefabs_1.HAS_MARKER)(this.LUNAR_ECLIPSE_MARKER, player, this)) {
                effect.cardTypes = [card_types_1.CardType.DARK];
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            let hasEvolvedPokemonInPlay = false;
            effect.opponent.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (cardList.isEvolved()) {
                    hasEvolvedPokemonInPlay = true;
                }
            });
            if (hasEvolvedPokemonInPlay) {
                (0, prefabs_1.DRAW_CARDS)(effect.player, 3);
            }
        }
        return state;
    }
}
exports.Lunatone = Lunatone;
