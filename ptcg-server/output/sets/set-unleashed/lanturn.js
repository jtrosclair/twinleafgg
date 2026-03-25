"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lanturn = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Lanturn extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Chinchou';
        this.cardType = L;
        this.hp = 110;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Underwater Dive',
                powerType: game_1.PowerType.POKEPOWER,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), you may use this power. Lanturn\'s type is [W] until the end of your turn. This power can\'t be used if Lanturn is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Underwater Dive',
                cost: [L, C, C],
                damage: 40,
                damageCalculation: '+',
                text: 'Does 40 damage plus 10 more damage for each Energy attached to all of your Pokémon.'
            }];
        this.set = 'UL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '86';
        this.name = 'Lanturn';
        this.fullName = 'Lanturn UL';
        this.UNDERWATER_DIVE_MARKER = 'UNDERWATER_DIVE_MARKER';
    }
    reduceEffect(store, state, effect) {
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.UNDERWATER_DIVE_MARKER, this);
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION)(player, this);
            if ((0, prefabs_1.HAS_MARKER)(this.UNDERWATER_DIVE_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            (0, prefabs_1.ABILITY_USED)(player, this);
            (0, prefabs_1.ADD_MARKER)(this.UNDERWATER_DIVE_MARKER, player, this);
        }
        if (effect instanceof check_effects_1.CheckPokemonTypeEffect && effect.target.getPokemonCard() === this) {
            const player = game_1.StateUtils.findOwner(state, effect.target);
            if ((0, prefabs_1.HAS_MARKER)(this.UNDERWATER_DIVE_MARKER, player, this)) {
                effect.cardTypes = [card_types_1.CardType.WATER];
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            let energies = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
                store.reduceEffect(state, checkProvidedEnergyEffect);
                checkProvidedEnergyEffect.energyMap.forEach(energy => {
                    energies += energy.provides.length;
                });
            });
            effect.damage += energies * 10;
        }
        return state;
    }
}
exports.Lanturn = Lanturn;
