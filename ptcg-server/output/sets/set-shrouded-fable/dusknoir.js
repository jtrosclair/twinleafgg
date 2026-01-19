"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dusknoir = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Dusknoir extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Dusclops';
        this.cardType = P;
        this.hp = 160;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Cursed Blast',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                knocksOutSelf: true,
                text: 'Once during your turn, you may put 13 damage counters on 1 of your opponent\'s Pokémon. If you placed any damage counters in this way, this Pokémon is Knocked Out.'
            }];
        this.attacks = [{
                name: 'Shadow Bind',
                cost: [P, P, C],
                damage: 150,
                text: 'During your opponent\'s next turn, the Defending Pokémon can\'t retreat.'
            }];
        this.regulationMark = 'H';
        this.set = 'SFA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '20';
        this.name = 'Dusknoir';
        this.fullName = 'Dusknoir SFA';
    }
    reduceEffect(store, state, effect) {
        // Cursed Blast
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { min: 1, max: 1, allowCancel: false }), selected => {
                const targets = selected || [];
                if (targets.length > 0) {
                    const damageEffect = new game_effects_1.EffectOfAbilityEffect(player, this.powers[0], this, targets[0]);
                    store.reduceEffect(state, damageEffect);
                    if (damageEffect.target) {
                        damageEffect.target.damage += 130;
                    }
                }
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (cardList.getPokemonCard() === this) {
                        cardList.damage += 999;
                    }
                });
            });
        }
        // Shadow Bind
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            return (0, prefabs_1.BLOCK_RETREAT)(store, state, effect, this);
        }
        (0, prefabs_1.BLOCK_RETREAT_IF_MARKER)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        (0, prefabs_1.REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        return state;
    }
}
exports.Dusknoir = Dusknoir;
