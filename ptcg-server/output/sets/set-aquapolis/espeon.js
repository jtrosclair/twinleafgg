"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Espeon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Espeon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Eevee';
        this.cardType = P;
        this.hp = 80;
        this.weakness = [{ type: P }];
        this.retreat = [];
        this.powers = [{
                name: 'Energy Return',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEPOWER,
                text: 'As often as you like during your turn (before your attack), choose an Energy card attached to 1 of your Pokémon and return it to your hand. This power can\'t be used if Espeon is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Damage Blast',
                cost: [P, C, C],
                damage: 30,
                damageCalculation: '+',
                text: 'Flip a number of coins equal to the number of damage counters on the Defending Pokémon. This attack does 30 damage plus 10 more damage for each heads.'
            }];
        this.set = 'AQ';
        this.name = 'Espeon';
        this.fullName = 'Espeon AQ';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '11';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            let isEnergyOnBench = false;
            let isEnergyOnActive = false;
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, player.active);
            state = store.reduceEffect(state, checkProvidedEnergy);
            const activeEnergyCount = checkProvidedEnergy.energyMap.length;
            if (activeEnergyCount > 0) {
                isEnergyOnActive = true;
            }
            const blockedTo = [];
            if (!isEnergyOnActive) {
                const target = {
                    player: game_1.PlayerType.BOTTOM_PLAYER,
                    slot: game_1.SlotType.ACTIVE,
                    index: 0
                };
                blockedTo.push(target);
            }
            player.bench.forEach((bench, index) => {
                if (bench.cards.length === 0) {
                    return;
                }
                const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, bench);
                state = store.reduceEffect(state, checkProvidedEnergy);
                const energyCount = checkProvidedEnergy.energyMap.length;
                if (energyCount > 0) {
                    isEnergyOnBench = true;
                }
                else {
                    const target = {
                        player: game_1.PlayerType.BOTTOM_PLAYER,
                        slot: game_1.SlotType.BENCH,
                        index
                    };
                    blockedTo.push(target);
                }
            });
            if (!isEnergyOnActive && !isEnergyOnBench) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false, blocked: blockedTo }), targets => {
                if (!targets || targets.length === 0) {
                    return;
                }
                const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, targets[0]);
                state = store.reduceEffect(state, checkProvidedEnergy);
                return store.prompt(state, new game_1.ChooseEnergyPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGIES_TO_HAND, checkProvidedEnergy.energyMap, [card_types_1.CardType.COLORLESS], { allowCancel: false }), energy => {
                    const cards = (energy || []).map(e => e.card);
                    store.log(state, game_1.GameLog.LOG_PLAYER_CHOOSES, { name: player.name, string: '' + cards[0].name });
                    targets[0].moveCardsTo(cards, player.hand);
                    prefabs_1.MOVE_CARDS(store, state, targets[0], player.hand, { cards, sourceCard: this, sourceEffect: this.powers[0] });
                });
            });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            // Count only energies that provide [W]
            const counterCount = effect.opponent.active.damage / 10;
            for (let i = 0; i < counterCount; i++) {
                prefabs_1.COIN_FLIP_PROMPT(store, state, player, result => {
                    if (result) {
                        effect.damage += 10;
                    }
                });
            }
        }
        return state;
    }
}
exports.Espeon = Espeon;
