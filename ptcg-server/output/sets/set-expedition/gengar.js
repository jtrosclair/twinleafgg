"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gengar = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Gengar extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Haunter';
        this.cardType = P;
        this.hp = 90;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Chaos Move',
                powerType: game_1.PowerType.POKEPOWER,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), if your opponent has 3 or fewer Prizes, you may move 1 damage counter from 1 Pokémon (yours or your opponent\'s) to another (even if it would Knock Out the other Pokémon). This power can\'t be used if Gengar is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Hide in Shadows',
                cost: [P, P, C],
                damage: 40,
                text: 'Switch Gengar with 1 of your Benched Pokémon, if any.'
            }];
        this.set = 'EX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '48';
        this.name = 'Gengar';
        this.fullName = 'Gengar EX';
        this.SHADY_MARKER = 'SHADY_MARKER';
        this.hidInShadows = false;
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.marker.hasMarker(this.SHADY_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            if (opponent.getPrizeLeft() > 3) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            (0, prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION)(player, this);
            // damage map gaming
            const maxAllowedDamage = [];
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                const checkHpEffect = new check_effects_1.CheckHpEffect(opponent, cardList);
                store.reduceEffect(state, checkHpEffect);
                maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
            });
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                const checkHpEffect = new check_effects_1.CheckHpEffect(player, cardList);
                store.reduceEffect(state, checkHpEffect);
                maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
            });
            // doing the actual moving of cards
            return store.prompt(state, new game_1.MoveDamagePrompt(effect.player.id, game_1.GameMessage.MOVE_DAMAGE, game_1.PlayerType.ANY, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], maxAllowedDamage, { min: 1, max: 1, allowCancel: false }), transfers => {
                if (transfers === null) {
                    return;
                }
                player.marker.addMarker(this.SHADY_MARKER, this);
                (0, prefabs_1.ABILITY_USED)(player, this);
                for (const transfer of transfers) {
                    const source = game_1.StateUtils.getTarget(state, player, transfer.from);
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    if (source.damage >= 10) {
                        source.damage -= 10;
                        target.damage += 10;
                    }
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            this.hidInShadows = true;
        }
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.hidInShadows === true) {
            (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, effect.player);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && this.hidInShadows) {
            this.hidInShadows = false;
        }
        return state;
    }
}
exports.Gengar = Gengar;
