"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Steelix = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Steelix extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Onix';
        this.cardType = F;
        this.hp = 170;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C, C];
        this.GIGATON_SHAKE_MARKER = 'STEELIX_UNM_GIGATON_SHAKE_MARKER';
        this.CLEAR_GIGATON_SHAKE_MARKER = 'STEELIX_UNM_CLEAR_GIGATON_SHAKE_MARKER';
        this.attacks = [
            {
                name: 'Ground Stream',
                cost: [F],
                damage: 20,
                text: 'Attach 2 [F] Energy cards from your discard pile to this Pokémon.'
            },
            {
                name: 'Gigaton Shake',
                cost: [F, C, C, C, C],
                damage: 220,
                text: 'During your next turn, your Pokémon can\'t attack. (This includes Pokémon that come into play on that turn.)'
            }
        ];
        this.set = 'UNM';
        this.setNumber = '104';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Steelix';
        this.fullName = 'Steelix UNM';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Ground Stream
        // Ref: set-unbroken-bonds/kyurem.ts (Call Forth Cold - attach energy from discard)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            state = (0, prefabs_1.ATTACH_ENERGY_PROMPT)(store, state, player, game_1.PlayerType.BOTTOM_PLAYER, game_1.SlotType.DISCARD, [game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Fighting Energy' }, { min: 0, max: 2, allowCancel: true });
        }
        // Attack 2: Gigaton Shake
        // Ref: set-unbroken-bonds/rhyperior.ts (Hefty Cannon - can't attack marker pattern)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            player.marker.addMarker(this.GIGATON_SHAKE_MARKER, this);
        }
        // Block all attacks from this player while marker is active (check both phases)
        if (effect instanceof game_effects_1.AttackEffect
            && (effect.player.marker.hasMarker(this.GIGATON_SHAKE_MARKER, this)
                || effect.player.marker.hasMarker(this.CLEAR_GIGATON_SHAKE_MARKER, this))) {
            throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        // 2-phase marker: persists through opponent's turn, blocks during player's next turn
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.CLEAR_GIGATON_SHAKE_MARKER, this);
        (0, prefabs_1.REPLACE_MARKER_AT_END_OF_TURN)(effect, this.GIGATON_SHAKE_MARKER, this.CLEAR_GIGATON_SHAKE_MARKER, this);
        return state;
    }
}
exports.Steelix = Steelix;
