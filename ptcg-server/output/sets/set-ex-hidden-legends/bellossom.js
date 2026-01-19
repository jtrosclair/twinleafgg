"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bellossom = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Bellossom extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Gloom';
        this.cardType = G;
        this.hp = 100;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: W, value: -30 }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Heal Dance',
                powerType: game_1.PowerType.POKEPOWER,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), you may remove 2 damage counters from 1 of your Pokémon. You can\'t use more than 1 Heal Dance Poké-Power each turn.This power can\'t be used if Bellossom is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Miracle Powder',
                cost: [G],
                damage: 10,
                text: 'Flip a coin. If heads, choose 1 Special Condition. The Defending Pokémon is now affected by that Special Condition.'
            },
            {
                name: 'Solar Beam',
                cost: [G, C, C],
                damage: 50,
                text: ''
            }];
        this.set = 'HL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '16';
        this.name = 'Bellossom';
        this.fullName = 'Bellossom HL';
        this.HEAL_DANCE_MARKER = 'HEAL_DANCE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION)(player, this);
            if ((0, prefabs_1.HAS_MARKER)(this.HEAL_DANCE_MARKER, player)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            const blocked = [];
            let hasPokemonWithDamage = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (cardList.damage === 0) {
                    blocked.push(target);
                }
                else {
                    hasPokemonWithDamage = true;
                }
            });
            if (hasPokemonWithDamage === false) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            let targets = [];
            store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_HEAL, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false, blocked }), results => {
                targets = results || [];
                if (targets.length === 0) {
                    return state;
                }
                targets.forEach(target => {
                    // Heal Pokemon
                    const healEffect = new game_effects_1.HealEffect(player, target, 20);
                    store.reduceEffect(state, healEffect);
                });
            });
            (0, prefabs_1.ADD_MARKER)(this.HEAL_DANCE_MARKER, player, this);
            (0, prefabs_1.ABILITY_USED)(player, this);
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.HEAL_DANCE_MARKER, this);
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    const options = [
                        { message: game_1.GameMessage.SPECIAL_CONDITION_PARALYZED, value: card_types_1.SpecialCondition.PARALYZED },
                        { message: game_1.GameMessage.SPECIAL_CONDITION_CONFUSED, value: card_types_1.SpecialCondition.CONFUSED },
                        { message: game_1.GameMessage.SPECIAL_CONDITION_ASLEEP, value: card_types_1.SpecialCondition.ASLEEP },
                        { message: game_1.GameMessage.SPECIAL_CONDITION_POISONED, value: card_types_1.SpecialCondition.POISONED },
                        { message: game_1.GameMessage.SPECIAL_CONDITION_BURNED, value: card_types_1.SpecialCondition.BURNED }
                    ];
                    store.prompt(state, new game_1.SelectPrompt(player.id, game_1.GameMessage.CHOOSE_SPECIAL_CONDITION, options.map(c => c.message), { allowCancel: false }), choice => {
                        const option = options[choice];
                        if (option !== undefined) {
                            const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [option.value]);
                            store.reduceEffect(state, specialConditionEffect);
                        }
                    });
                }
            });
        }
        return state;
    }
}
exports.Bellossom = Bellossom;
