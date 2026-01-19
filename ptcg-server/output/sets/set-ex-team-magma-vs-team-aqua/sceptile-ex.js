"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sceptileex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
class Sceptileex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Grovyle';
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = G;
        this.hp = 150;
        this.weakness = [{ type: G }, { type: R }];
        this.resistance = [{ type: W, value: -30 }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Green Heal',
                cost: [G],
                damage: 0,
                text: 'Remove 4 damage counters from each of your Pokémon that has [G] Energy attached. If that Pokémon has less than 4 damage counters, remove all of them.'
            },
            {
                name: 'Poison Ring',
                cost: [G, C, C],
                damage: 40,
                text: 'The Defending Pokémon is now Poisoned. The Defending Pokémon can\'t retreat until the end of your opponent\'s next turn.'
            },
            {
                name: 'Slashing Strike',
                cost: [G, G, C, C, C],
                damage: 100,
                text: 'Sceptile ex can\'t use Slashing Strike during your next turn.'
            }];
        this.set = 'MA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '93';
        this.name = 'Sceptile ex';
        this.fullName = 'Sceptile ex MA';
        this.POISON_RING_MARKER = 'POISON_RING_MARKER';
        this.ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
        this.ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
                store.reduceEffect(state, checkProvidedEnergyEffect);
                const energyMap = checkProvidedEnergyEffect.energyMap;
                const hasGrassEnergy = game_1.StateUtils.checkEnoughEnergy(energyMap, [card_types_1.CardType.GRASS]);
                if (hasGrassEnergy) {
                    const healEffect = new game_effects_1.HealEffect(player, cardList, 40);
                    store.reduceEffect(state, healEffect);
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED)(store, state, effect);
            return (0, prefabs_1.BLOCK_RETREAT)(store, state, effect, this);
        }
        (0, prefabs_1.BLOCK_RETREAT_IF_MARKER)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        (0, prefabs_1.REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 2, this)) {
            (0, prefabs_1.BLOCK_EFFECT_IF_MARKER)(this.ATTACK_USED_2_MARKER, effect.player, this);
            (0, prefabs_1.ADD_MARKER)(this.ATTACK_USED_MARKER, effect.player, this);
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.ATTACK_USED_2_MARKER, this);
        (0, prefabs_1.REPLACE_MARKER_AT_END_OF_TURN)(effect, this.ATTACK_USED_MARKER, this.ATTACK_USED_2_MARKER, this);
        return state;
    }
}
exports.Sceptileex = Sceptileex;
