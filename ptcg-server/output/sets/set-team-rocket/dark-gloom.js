"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DarkGloom = void 0;
const game_1 = require("../../game");
const game_2 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class DarkGloom extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Oddish';
        this.tags = [game_1.CardTag.DARK];
        this.cardType = G;
        this.hp = 50;
        this.weakness = [{ type: R }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Pollen Stench',
                powerType: game_2.PowerType.POKEMON_POWER,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), you may flip a coin. If heads, the Defending Pokémon is now Confused; if tails, your Active Pokémon is now Confused. This power can\'t be used if Dark Gloom is Asleep, Confused, or Paralyzed.'
            }];
        this.attacks = [
            {
                name: 'Poisonpowder',
                cost: [G, G],
                damage: 10,
                text: 'The Defending Pokémon is now Poisoned.'
            },
        ];
        this.set = 'TR';
        this.setNumber = '36';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Dark Gloom';
        this.fullName = 'Dark Gloom TR';
        this.POLLEN_STENCH_MARKER = 'POLLEN_STENCH_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (prefabs_1.HAS_MARKER(this.POLLEN_STENCH_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            prefabs_1.BLOCK_IF_ASLEEP_CONFUSED_PARALYZED(player, this);
            prefabs_1.ADD_MARKER(this.POLLEN_STENCH_MARKER, player, this);
            prefabs_1.ABILITY_USED(player, this);
            prefabs_1.COIN_FLIP_PROMPT(store, state, player, result => {
                if (result) {
                    prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, opponent, this);
                }
                else {
                    prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, player, this);
                }
            });
        }
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.POLLEN_STENCH_MARKER, this);
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED(store, state, effect);
        }
        return state;
    }
}
exports.DarkGloom = DarkGloom;
