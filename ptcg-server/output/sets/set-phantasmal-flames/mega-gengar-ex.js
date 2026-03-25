"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MegaGengarex = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class MegaGengarex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Haunter';
        this.tags = [game_1.CardTag.POKEMON_SV_MEGA, game_1.CardTag.POKEMON_ex];
        this.cardType = D;
        this.hp = 350;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Shadowy Concealment',
                powerType: game_1.PowerType.ABILITY,
                text: 'If 1 of your [D] Pokémon is Knocked Out by damage from an attack from your opponent\'s Pokémon ex, that player takes 1 fewer Prize card. The effect of Shadowy Concealment doesn\'t stack.'
            }];
        this.attacks = [{
                name: 'Void Gale',
                cost: [D, D],
                damage: 230,
                text: 'Move an Energy from this Pokemon to 1 of your Benched Pokemon.',
            }];
        this.regulationMark = 'I';
        this.set = 'PFL';
        this.setNumber = '56';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Mega Gengar ex';
        this.fullName = 'Mega Gengar ex MBG';
        this.VOID_GALE_MARKER = 'VOID_GALE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.KnockOutEffect) {
            const player = effect.player; // owner of the Pokémon that was Knocked Out
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Only during opponent's attack step
            if (state.phase !== game_1.GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
                return state;
            }
            // Ability must be in play on player's side and not blocked
            let hasThisInPlay = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    hasThisInPlay = true;
                }
            });
            if (!hasThisInPlay || (0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, opponent, this)) {
                return state;
            }
            // Target must be a Darkness Pokémon
            const checkType = new check_effects_1.CheckPokemonTypeEffect(effect.target);
            store.reduceEffect(state, checkType);
            const isDarkPokemon = checkType.cardTypes.includes(D);
            if (!isDarkPokemon) {
                return state;
            }
            // Attacking Pokémon must be a Pokémon ex
            const attackingPokemon = opponent.active.getPokemonCard();
            const attackerIsEx = (attackingPokemon === null || attackingPokemon === void 0 ? void 0 : attackingPokemon.tags.includes(game_1.CardTag.POKEMON_ex)) === true;
            if (!attackerIsEx) {
                return state;
            }
            // Prevent stacking if multiple copies are in play (mark the KO target for this resolution)
            const NON_STACK_MARKER = 'MEGA_GENGAR_SHADOW_HIDING_APPLIED';
            if (effect.target.marker.hasMarker(NON_STACK_MARKER, this)) {
                return state;
            }
            effect.target.marker.addMarker(NON_STACK_MARKER, this);
            if (effect.prizeCount > 0) {
                effect.prizeCount -= 1;
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.ADD_MARKER)(this.VOID_GALE_MARKER, effect.player, this);
            return state;
        }
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && (0, prefabs_1.HAS_MARKER)(this.VOID_GALE_MARKER, effect.player, this)) {
            const player = effect.player;
            const hasBench = player.bench.some(b => b.cards.length > 0);
            if (hasBench === false) {
                return state;
            }
            // Then prompt for energy movement
            return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.active, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: game_1.SuperType.ENERGY }, { allowCancel: false, min: 1, max: 1 }), transfers => {
                transfers = transfers || [];
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.active.moveCardTo(transfer.card, target);
                }
            });
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.VOID_GALE_MARKER, this);
        return state;
    }
}
exports.MegaGengarex = MegaGengarex;
