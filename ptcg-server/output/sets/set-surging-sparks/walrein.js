"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Walrein = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const __1 = require("../..");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Walrein extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Sealeo';
        this.cardType = W;
        this.hp = 170;
        this.weakness = [{ type: M }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Frigid Fangs',
                cost: [W],
                damage: 60,
                text: 'During your opponent\'s next turn, Pokémon that have 2 or less Energy attached can\'t attack. (This includes new Pokémon that come into play.)'
            },
            {
                name: 'Megaton Fall',
                cost: [W, W],
                damage: 170,
                text: 'This Pokémon also does 50 damage to itself.'
            }
        ];
        this.set = 'SSP';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '45';
        this.name = 'Walrein';
        this.fullName = 'Walrein SSP';
        this.FRIGID_FANGS_MARKER = 'FRIGID_FANGS_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = __1.StateUtils.getOpponent(state, player);
            (0, prefabs_1.ADD_MARKER)(this.FRIGID_FANGS_MARKER, opponent, this);
        }
        if (effect instanceof game_effects_1.AttackEffect) {
            if ((0, prefabs_1.HAS_MARKER)(this.FRIGID_FANGS_MARKER, effect.player, this)) {
                const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(effect.player);
                store.reduceEffect(state, checkProvidedEnergyEffect);
                const energyCount = checkProvidedEnergyEffect.energyMap
                    .reduce((left, p) => left + p.provides.length, 0);
                if (energyCount <= 2) {
                    throw new __1.GameError(__1.GameMessage.BLOCKED_BY_EFFECT);
                }
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            if ((0, prefabs_1.HAS_MARKER)(this.FRIGID_FANGS_MARKER, effect.player, this)) {
                (0, prefabs_1.REMOVE_MARKER)(this.FRIGID_FANGS_MARKER, effect.player, this);
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF)(store, state, effect, 50);
        }
        return state;
    }
}
exports.Walrein = Walrein;
