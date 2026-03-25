"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RocketsScytherex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class RocketsScytherex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.ROCKETS];
        this.cardType = D;
        this.hp = 80;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Dual Armor',
                powerType: game_1.PowerType.POKEBODY,
                text: 'As long as Rocket\'s Scyther ex has any [G] Energy attached to it, Rocket\'s Scyther ex is both [G] and [D] type.'
            }];
        this.attacks = [{
                name: 'Bounce',
                cost: [C],
                damage: 10,
                text: 'After your attack, you may switch Rocket\'s Scyther ex with 1 of your Benched Pokémon.'
            },
            {
                name: 'Slashing Strike',
                cost: [C, C, C],
                damage: 40,
                text: 'Rocket\'s Scyther ex can\'t use Slashing Strike during your next turn.'
            }];
        this.set = 'TRR';
        this.name = 'Rocket\'s Scyther ex';
        this.fullName = 'Rocket\'s Scyther ex TRR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '102';
    }
    reduceEffect(store, state, effect) {
        // Dual Armor
        if (effect instanceof check_effects_1.CheckPokemonTypeEffect && effect.target.getPokemonCard() === this && !(0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, game_1.StateUtils.findOwner(state, effect.target), this)) {
            const player = game_1.StateUtils.findOwner(state, effect.target);
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
                    store.reduceEffect(state, checkProvidedEnergyEffect);
                    const energyMap = checkProvidedEnergyEffect.energyMap;
                    const hasGrassEnergy = game_1.StateUtils.checkEnoughEnergy(energyMap, [card_types_1.CardType.GRASS]);
                    if (hasGrassEnergy) {
                        effect.cardTypes = [G, D];
                    }
                }
            });
        }
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.CONFIRMATION_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, effect.player);
                }
            }, game_1.GameMessage.WANT_TO_SWITCH_POKEMON);
        }
        // Slashing Strike
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            if (!player.active.cannotUseAttacksNextTurnPending.includes('Slashing Strike')) {
                player.active.cannotUseAttacksNextTurnPending.push('Slashing Strike');
            }
        }
        return state;
    }
}
exports.RocketsScytherex = RocketsScytherex;
