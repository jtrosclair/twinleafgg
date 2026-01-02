"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeowsticEX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class MeowsticEX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_EX];
        this.cardType = P;
        this.hp = 160;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.powers = [{
                name: 'Shadow Ear',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), if this Pokémon is your Active Pokémon, you may move 1 damage counter from 1 of your Pokémon to 1 of your opponent\'s Pokémon.'
            }];
        this.attacks = [{
                name: 'Mind Shock',
                cost: [P, C],
                damage: 60,
                text: 'This attack\'s damage isn\'t affected by Weakness or Resistance.'
            }];
        this.set = 'GEN';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '37';
        this.name = 'Meowstic-EX';
        this.fullName = 'Meowstic-EX GEN';
        this.SHADOW_EAR_MARKER = 'SHADOW_EAR_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.marker.hasMarker(this.SHADOW_EAR_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            if (player.active.getPokemonCard() !== this) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const blockedTo = [];
            const blockedFrom = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                blockedTo.push(target);
            });
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                blockedFrom.push(target);
            });
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
            return store.prompt(state, new game_1.MoveDamagePrompt(effect.player.id, game_1.GameMessage.MOVE_DAMAGE, game_1.PlayerType.ANY, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], maxAllowedDamage, { min: 1, max: 1, allowCancel: false, blockedTo, blockedFrom }), transfers => {
                if (transfers === null) {
                    return;
                }
                player.marker.addMarker(this.SHADOW_EAR_MARKER, this);
                prefabs_1.ABILITY_USED(player, this);
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
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            effect.ignoreWeakness = true;
            effect.ignoreResistance = true;
        }
        return state;
    }
}
exports.MeowsticEX = MeowsticEX;
