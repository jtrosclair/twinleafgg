"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nidoqueen = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Nidoqueen extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Nidorina';
        this.tags = [card_types_1.CardTag.DELTA_SPECIES];
        this.hp = 100;
        this.cardType = M;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Invitation',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), you may search your deck for a Basic Pokémon or Evolution card, show it to your opponent, and put it into your hand. Shuffle your deck afterward. This power can\'t be used if Nidoqueen is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Vengence',
                cost: [C, C, C],
                damage: 30,
                damageCalculation: '+',
                text: 'Does 30 damage plus 10 more damage for each Basic Pokémon and each Evolution card in your discard pile. You can\'t add more than 60 damage in this way.'
            }];
        this.set = 'DF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '7';
        this.name = 'Nidoqueen';
        this.fullName = 'Nidoqueen DF';
        this.INVITATION_MARKER = 'INVITATION_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            (0, prefabs_1.REMOVE_MARKER)(this.INVITATION_MARKER, effect.player, this);
        }
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if ((0, prefabs_1.HAS_MARKER)(this.INVITATION_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            (0, prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION)(player, this);
            (0, prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND)(store, state, player, {}, { min: 0, max: 1, allowCancel: false });
            (0, prefabs_1.ADD_MARKER)(this.INVITATION_MARKER, player, this);
            (0, prefabs_1.ABILITY_USED)(player, this);
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.INVITATION_MARKER, this);
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            let pokemonCount = 0;
            player.discard.cards.forEach(c => {
                if (c instanceof game_1.PokemonCard)
                    pokemonCount += 1;
            });
            pokemonCount = Math.min(pokemonCount, 6);
            effect.damage += pokemonCount * 10;
        }
        return state;
    }
}
exports.Nidoqueen = Nidoqueen;
