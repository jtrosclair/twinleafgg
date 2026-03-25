"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Aerodactyl = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Aerodactyl extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Mysterious Fossil';
        this.tags = [card_types_1.CardTag.DELTA_SPECIES];
        this.cardType = R;
        this.hp = 70;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [];
        this.powers = [{
                name: 'Primal Light',
                powerType: game_1.PowerType.POKEPOWER,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), you may search your deck for a basic Energy card, show it to your opponent, and put it into your hand. Shuffle your deck afterward. This power can\'t be used if Aerodactyl is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Granite Head',
                cost: [R, C],
                damage: 30,
                text: 'During your opponent\'s next turn, any damage done to Aerodactyl by attacks is reduced by 10 (after applying Weakness and Resistance).'
            }];
        this.set = 'HP';
        this.setNumber = '35';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Aerodactyl';
        this.fullName = 'Aerodactyl HP';
        this.GRANITE_HEAD_MARKER = 'GRANITE_HEAD_MARKER';
        this.PRIMAL_LIGHT_MARKER = 'PRIMAL_LIGHT_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if ((0, prefabs_1.HAS_MARKER)(this.PRIMAL_LIGHT_MARKER, effect.player, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            (0, prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION)(player, this);
            (0, prefabs_1.ADD_MARKER)(this.PRIMAL_LIGHT_MARKER, effect.player, this);
            (0, prefabs_1.ABILITY_USED)(player, this);
            (0, prefabs_1.SEARCH_DECK_FOR_CARDS_TO_HAND)(store, state, player, this, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { min: 0, max: 1, allowCancel: false }, this.powers[0]);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.ADD_MARKER)(this.GRANITE_HEAD_MARKER, effect.player, this);
        }
        if (effect instanceof attack_effects_1.PutDamageEffect
            && (0, prefabs_1.HAS_MARKER)(this.GRANITE_HEAD_MARKER, game_1.StateUtils.getOpponent(state, effect.player), this)
            && effect.target.getPokemonCard() === this) {
            if (state.phase !== game_1.GamePhase.ATTACK) {
                return state;
            }
            effect.damage -= 10;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player !== game_1.StateUtils.findOwner(state, game_1.StateUtils.findCardList(state, this))) {
            (0, prefabs_1.REMOVE_MARKER)(this.GRANITE_HEAD_MARKER, game_1.StateUtils.getOpponent(state, effect.player), this);
        }
        return state;
    }
}
exports.Aerodactyl = Aerodactyl;
