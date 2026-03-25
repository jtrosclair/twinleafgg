"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ludicolo2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Ludicolo2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Lombre';
        this.cardType = W;
        this.hp = 100;
        this.weakness = [{ type: L }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Happy Dance',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), you may remove 1 damage counter from each of your Pokémon. You can\'t use more than 1 Happy Dance Poké-Power each turn. This power can\'t be used if Ludicolo is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Water Punch',
                cost: [C, C, C],
                damage: 40,
                damageCalculation: '+',
                text: 'Flip a coin for each [W] Energy attached to Ludicolo. This attack does 40 damage plus 20 more damage for each heads.'
            }];
        this.set = 'DX';
        this.setNumber = '19';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Ludicolo';
        this.fullName = 'Ludicolo DX2';
        this.HAPPY_DANCE_MARKER = 'HAPPY_DANCE_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Handle Happy Dance Poké-Power
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if (player.marker.hasMarker(this.HAPPY_DANCE_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            player.marker.addMarker(this.HAPPY_DANCE_MARKER, this);
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                const healEffect = new game_effects_1.HealEffect(player, cardList, 10);
                state = store.reduceEffect(state, healEffect);
            });
        }
        // Handle Water Punch attack
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            // Count Water energy
            let waterEnergyCount = 0;
            checkProvidedEnergy.energyMap.forEach(energy => {
                if (energy.provides.includes(card_types_1.CardType.WATER) || energy.provides.includes(card_types_1.CardType.ANY)) {
                    waterEnergyCount++;
                }
            });
            // Flip coins equal to Water energy count
            let heads = 0;
            for (let i = 0; i < waterEnergyCount; i++) {
                state = store.prompt(state, new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.FLIP_COIN), result => {
                    if (result) {
                        heads++;
                    }
                    if (i === waterEnergyCount - 1) {
                        effect.damage = 40 + (20 * heads);
                    }
                    return state;
                });
            }
        }
        return state;
    }
}
exports.Ludicolo2 = Ludicolo2;
