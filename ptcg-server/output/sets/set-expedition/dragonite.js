"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dragonite = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Dragonite extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Dragonair';
        this.cardType = C;
        this.hp = 100;
        this.retreat = [C, C];
        this.powers = [{
                name: 'Tailwind',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), if Dragonite is on your Bench, you may reduce your Active Pokémon\'s Retreat Cost to 0.'
            }];
        this.attacks = [{
                name: 'Dragon Tail',
                cost: [L, W, F],
                damage: 40,
                damageCalculationn: 'x',
                text: 'Flip 2 coins. This attack does 40 damage times the number of heads.'
            }];
        this.set = 'EX';
        this.setNumber = '9';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Dragonite';
        this.fullName = 'Dragonite EX';
        this.TAILWIND_MARKER = 'TAILWIND_MARKER';
        this.TAILWIND_USED_MARKER = 'TAILWIND_USED_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            if (prefabs_1.HAS_MARKER(this.TAILWIND_USED_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            if (effect.card === player.active.getPokemonCard()) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            prefabs_1.ADD_MARKER(this.TAILWIND_MARKER, player.active, this);
            prefabs_1.ADD_MARKER(this.TAILWIND_USED_MARKER, player, this);
            prefabs_1.ABILITY_USED(player, this);
        }
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.TAILWIND_MARKER, this);
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.TAILWIND_USED_MARKER, this);
        if (effect instanceof check_effects_1.CheckRetreatCostEffect && prefabs_1.HAS_MARKER(this.TAILWIND_MARKER, effect.player.active, this)) {
            effect.cost = [];
        }
        // Dragon Tail
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            return prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 2, results => {
                let heads = 0;
                results.forEach(r => {
                    if (r)
                        heads++;
                });
                effect.damage = 40 * heads;
            });
        }
        return state;
    }
}
exports.Dragonite = Dragonite;
