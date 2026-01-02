"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blissey = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Blissey extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Chansey';
        this.cardType = C;
        this.hp = 120;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Happy Healing',
                powerType: game_1.PowerType.POKEPOWER,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), choose 1 of your Benched Pokémon and flip a coin. If heads, count the number of Energy attached to Blissey and then remove that many damage counters from the chosen Benched Pokémon. This power can\'t be used if Blissey is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Smash Bomber',
                cost: [C, C, C],
                damage: 50,
                text: 'Flip a coin. If tails, this attack does nothing.',
            }];
        this.set = 'AQ';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '6';
        this.name = 'Blissey';
        this.fullName = 'Blissey AQ';
        this.HAPPY_HEALING_MARKER = 'HAPPY_HEALING_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);
            if (prefabs_1.HAS_MARKER(this.HAPPY_HEALING_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            prefabs_1.ABILITY_USED(player, this);
            prefabs_1.ADD_MARKER(this.HAPPY_HEALING_MARKER, player, this);
            prefabs_1.COIN_FLIP_PROMPT(store, state, effect.player, (result) => {
                if (result) {
                    const player = effect.player;
                    const cardList = game_1.StateUtils.findCardList(state, effect.card);
                    const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
                    store.reduceEffect(state, checkProvidedEnergyEffect);
                    // Getting count of energies
                    let energies = 0;
                    checkProvidedEnergyEffect.energyMap.forEach(energy => { energy.provides.forEach(e => { energies++; }); });
                    const blocked = [];
                    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                        if (cardList.damage === 0) {
                            blocked.push(target);
                        }
                    });
                    let targets = [];
                    return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_HEAL, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { min: 0, max: 1, allowCancel: true, blocked }), results => {
                        targets = results || [];
                        if (targets.length === 0) {
                            return state;
                        }
                        targets.forEach(target => {
                            // Heal Pokemon
                            const healEffect = new game_effects_1.HealEffect(player, target, 10 * energies);
                            store.reduceEffect(state, healEffect);
                        });
                    });
                }
            });
        }
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.HAPPY_HEALING_MARKER, this);
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            prefabs_1.COIN_FLIP_PROMPT(store, state, effect.player, (result) => {
                if (!result) {
                    effect.damage = 0;
                }
            });
        }
        return state;
    }
}
exports.Blissey = Blissey;
