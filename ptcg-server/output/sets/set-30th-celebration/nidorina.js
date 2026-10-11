"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nidorina = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Nidorina extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Nidoran ♀';
        this.hp = 90;
        this.cardType = game_1.CardType.DARK;
        this.weakness = [{ type: game_1.CardType.FIGHTING }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Happy Share',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your turn, you may use this Ability. Heal 30 damage from 1 of your Pokémon.'
            }];
        this.attacks = [{
                name: 'Bite',
                cost: [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 30,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '88';
        this.name = 'Nidorina';
        this.fullName = 'Nidorina 30C';
        this.HAPPY_SHARE_MARKER = 'HAPPY_SHARE_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Happy Share
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            const blocked = [];
            let hasTarget = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (targetList, _card, target) => {
                if (targetList.damage === 0) {
                    blocked.push(target);
                }
                else {
                    hasTarget = true;
                }
            });
            if (!hasTarget) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            (0, prefabs_1.USE_ABILITY_ONCE_PER_TURN)(player, this.HAPPY_SHARE_MARKER, this);
            (0, prefabs_1.ABILITY_USED)(player, this);
            store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_HEAL, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false, blocked }), targets => {
                if (targets && targets.length > 0) {
                    const healEffect = new game_effects_1.HealEffect(player, targets[0], 30);
                    store.reduceEffect(state, healEffect);
                }
            });
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.HAPPY_SHARE_MARKER, this);
        return state;
    }
}
exports.Nidorina = Nidorina;
