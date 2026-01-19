"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Archeops = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Archeops extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Archen';
        this.cardType = F;
        this.hp = 140;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.powers = [{
                name: 'Primal Wings',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your turn, if this Pokémon is in the Active Spot, you may choose 1 of your opponent\'s Evolved Pokemon and devolve it by putting the highest Stage Evolution card on it into your opponent\'s hand.'
            }];
        this.attacks = [
            {
                name: 'Rock Throw',
                cost: [F, C],
                damage: 100,
                text: ''
            }
        ];
        this.regulationMark = 'I';
        this.set = 'WHT';
        this.setNumber = '51';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Archeops';
        this.fullName = 'Archeops SV11W';
        this.PRIMAL_WINGS_MARKER = 'PRIMAL_WINGS_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.PRIMAL_WINGS_MARKER, this)) {
            effect.player.marker.removeMarker(this.PRIMAL_WINGS_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const blocked = [];
            if (effect.player.marker.hasMarker(this.PRIMAL_WINGS_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            // Block all Pokémon that are not evolved (only Basic)
            let hasAnyEvolved = false;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (list, card, target) => {
                const hasEvolution = list.cards.some(c => c instanceof game_1.PokemonCard && c.stage !== game_1.Stage.BASIC);
                if (hasEvolution) {
                    hasAnyEvolved = true;
                }
                else {
                    blocked.push(target);
                }
            });
            if (!hasAnyEvolved) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_EVOLVE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false, blocked }), targets => {
                player.marker.addMarker(this.PRIMAL_WINGS_MARKER, this);
                (0, prefabs_1.ABILITY_USED)(player, this);
                if (!targets || targets.length === 0) {
                    return state;
                }
                (0, prefabs_1.DEVOLVE_POKEMON)(store, state, targets[0], opponent.hand);
                return state;
            });
        }
        return state;
    }
}
exports.Archeops = Archeops;
