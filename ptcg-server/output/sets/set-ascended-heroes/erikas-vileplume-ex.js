"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErikasVileplumeex = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class ErikasVileplumeex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Erika\'s Gloom';
        this.tags = [game_1.CardTag.POKEMON_ex, game_1.CardTag.ERIKAS];
        this.cardType = G;
        this.hp = 310;
        this.weakness = [{ type: R }];
        this.resistance = [];
        this.retreat = [C];
        this.powers = [{
                name: 'Lovely Fragrance',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, you may use this Ability. Heal 30 damage from each of your Pokémon.'
            }];
        this.attacks = [{
                name: 'Bloom Powder',
                cost: [G, G, C],
                damage: 160,
                text: 'Your opponent\'s Active Pokemon is now Poisoned and Asleep.'
            }];
        this.regulationMark = 'I';
        this.set = 'ASC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '3';
        this.name = 'Erika\'s Vileplume ex';
        this.fullName = 'Erika\'s Vileplume ex MC';
        this.ENVIOUS_SCENT_MARKER = 'ENVIOUS_SCENT_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Envious Scent ability
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.marker.hasMarker(this.ENVIOUS_SCENT_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            // Heal 30 damage from each of your Pokemon
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                if (cardList.damage > 0) {
                    const healEffect = new game_effects_1.HealEffect(player, cardList, 30);
                    store.reduceEffect(state, healEffect);
                }
            });
            player.marker.addMarker(this.ENVIOUS_SCENT_MARKER, this);
            (0, prefabs_1.ABILITY_USED)(player, this);
        }
        // Powder Bloom attack - apply Poisoned and Asleep
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [
                game_1.SpecialCondition.POISONED,
                game_1.SpecialCondition.ASLEEP
            ]);
            specialConditionEffect.target = opponent.active;
            return store.reduceEffect(state, specialConditionEffect);
        }
        // Reset marker at end of turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ENVIOUS_SCENT_MARKER, this)) {
            effect.player.marker.removeMarker(this.ENVIOUS_SCENT_MARKER, this);
        }
        return state;
    }
}
exports.ErikasVileplumeex = ErikasVileplumeex;
