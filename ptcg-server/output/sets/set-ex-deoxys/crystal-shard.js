"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrystalShard = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class CrystalShard extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'DX';
        this.name = 'Crystal Shard';
        this.fullName = 'Crystal Shard DX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '85';
        this.text = 'As long as this card is attached to a Pokémon, that Pokémon\'s type is [C]. If that Pokémon attacks, discard this card at the end of the turn.';
        this.ATTACKED_MARKER = 'ATTACKED_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckPokemonTypeEffect && effect.target.tools.includes(this)) {
            const player = game_1.StateUtils.findOwner(state, effect.target);
            if (!prefabs_1.IS_TOOL_BLOCKED(store, state, player, this)) {
                effect.cardTypes = [C];
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.source.tools.includes(this)) {
            prefabs_1.ADD_MARKER(this.ATTACKED_MARKER, effect.player, this);
            console.log('Crystal Shard was used this turn, adding marker');
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && prefabs_1.HAS_MARKER(this.ATTACKED_MARKER, effect.player, this)) {
            const player = effect.player;
            console.log('Crystal Shard was used this turn, moving to discard');
            prefabs_1.MOVE_CARDS(store, state, player.active, player.discard, { cards: [this] });
            prefabs_1.REMOVE_MARKER(this.ATTACKED_MARKER, player, this);
        }
        return state;
    }
}
exports.CrystalShard = CrystalShard;
