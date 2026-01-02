"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DarkDragonite = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class DarkDragonite extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.DARK];
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Dark Dragonair';
        this.cardType = C;
        this.hp = 70;
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Summon Minions',
                powerType: game_1.PowerType.POKEMON_POWER,
                text: 'When you play Dark Dragonite from your hand, search your deck for up to 2 Basic Pokémon and put them onto your Bench. Shuffle your deck afterward.'
            }];
        this.attacks = [{
                name: 'Giant Tail',
                cost: [C, C, C, C],
                damage: 70,
                text: 'Flip a coin. If tails, this attack does nothing.'
            }];
        this.set = 'TR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '5';
        this.name = 'Dark Dragonite';
        this.fullName = 'Dark Dragonite TR';
        this.EVOLUTIONARY_LIGHT_MARKER = 'EVOLUTIONARY_LIGHT_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            prefabs_1.REMOVE_MARKER(this.EVOLUTIONARY_LIGHT_MARKER, player, this);
        }
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.EVOLUTIONARY_LIGHT_MARKER, this);
        if (prefabs_1.JUST_EVOLVED(effect, this) && !prefabs_1.IS_POKEMON_POWER_BLOCKED(store, state, effect.player, this)) {
            const player = effect.player;
            prefabs_1.CONFIRMATION_PROMPT(store, state, player, result => {
                if (result) {
                    prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(store, state, player, { stage: card_types_1.Stage.BASIC }, { min: 0, max: 2, allowCancel: false });
                }
            });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            prefabs_1.COIN_FLIP_PROMPT(store, state, effect.player, result => {
                if (!result) {
                    effect.damage = 0;
                }
            });
        }
        return state;
    }
}
exports.DarkDragonite = DarkDragonite;
