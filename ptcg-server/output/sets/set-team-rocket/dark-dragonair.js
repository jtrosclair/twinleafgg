"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DarkDragonair = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class DarkDragonair extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.DARK];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Dratini';
        this.cardType = C;
        this.hp = 60;
        this.resistance = [{ type: P, value: -30 }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Evolutionary Light',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEMON_POWER,
                text: 'Once during your turn (before your attack), you may search your deck for an Evolution card. Show it to your opponent and put it into your hand. Shuffle your deck afterward. This power can\'t be used if Dark Dragonair is Asleep, Confused, or Paralyzed.'
            }];
        this.attacks = [{
                name: 'Tail Strike',
                cost: [C, C, C],
                damage: 20,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 20 damage plus 20 more damage; if tails, this attack does 20 damage.'
            }];
        this.set = 'TR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '33';
        this.name = 'Dark Dragonair';
        this.fullName = 'Dark Dragonair TR';
        this.EVOLUTIONARY_LIGHT_MARKER = 'EVOLUTIONARY_LIGHT_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            prefabs_1.REMOVE_MARKER(this.EVOLUTIONARY_LIGHT_MARKER, player, this);
        }
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.EVOLUTIONARY_LIGHT_MARKER, this);
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            if (prefabs_1.IS_POKEPOWER_BLOCKED(store, state, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);
            if (player.marker.hasMarker(this.EVOLUTIONARY_LIGHT_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            const blocked = [];
            player.deck.cards.forEach((card, index) => {
                // eslint-disable-next-line no-empty
                if (card instanceof pokemon_card_1.PokemonCard && card.evolvesFrom !== '' && card.stage !== card_types_1.Stage.LV_X) {
                }
                else {
                    blocked.push(index);
                }
            });
            prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND(store, state, player, {}, { min: 0, max: 1, blocked });
            prefabs_1.ADD_MARKER(this.EVOLUTIONARY_LIGHT_MARKER, player, this);
            prefabs_1.ABILITY_USED(player, this);
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            attack_effects_1.FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 20);
        }
        return state;
    }
}
exports.DarkDragonair = DarkDragonair;
