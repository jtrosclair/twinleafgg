"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Krookodile = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Krookodile extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Krokorok';
        this.cardType = F;
        this.hp = 140;
        this.weakness = [{ type: W }];
        this.resistance = [{ type: L, value: -20 }];
        this.retreat = [C, C, C];
        this.powers = [
            {
                name: 'Black Eyes',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), if this Pokémon is your Active Pokémon, you may flip a coin. If heads, discard an Energy attached to your opponent\'s Active Pokémon.'
            }
        ];
        this.attacks = [
            {
                name: 'Thrash',
                cost: [F, F, C],
                damage: 70,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 20 more damage. If tails, this Pokémon does 20 damage to itself.'
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '62';
        this.name = 'Krookodile';
        this.fullName = 'Krookodile EPO';
        this.BLACK_EYES_MARKER = 'BLACK_EYES_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.active.getPokemonCard() !== this) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.BLACK_EYES_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            player.marker.addMarker(this.BLACK_EYES_MARKER, this);
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    const energyCards = opponent.active.cards.filter(c => c.superType === game_1.SuperType.ENERGY);
                    if (energyCards.length > 0) {
                        opponent.active.moveCardTo(energyCards[0], opponent.discard);
                    }
                }
            });
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.BLACK_EYES_MARKER, this);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    effect.damage += 20;
                }
                else {
                    (0, prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF)(store, state, effect, 20);
                }
            });
        }
        return state;
    }
}
exports.Krookodile = Krookodile;
