"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UmbreonDarkraiGX = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class UmbreonDarkraiGX extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [game_1.CardTag.POKEMON_GX, game_1.CardTag.TAG_TEAM];
        this.stage = game_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 270;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Black Lance',
                cost: [D, D, C],
                damage: 150,
                text: 'This attack does 60 damage to 1 of your opponent\'s Benched Pokémon-GX or Benched Pokémon-EX. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Dark Moon-GX',
                cost: [C],
                damage: 0,
                gxAttack: true,
                text: 'Your opponent can\'t play any Trainer cards from their hand during their next turn. If this Pokémon has at least 5 extra [D] Energy attached to it (in addition to this attack\'s cost), your opponent\'s Active Pokémon is Knocked Out. (You can\'t use more than 1 GX attack in a game.)'
            },
        ];
        this.set = 'UNM';
        this.setNumber = '125';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Umbreon & Darkrai-GX';
        this.fullName = 'Umbreon & Darkrai-GX UNM';
        this.DARK_MOON_MARKER = 'DARK_MOON_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Black Lance
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            const hasBenched = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                return state;
            }
            let gxsEXsOnBench = 0;
            const blockedTo = [];
            opponent.bench.forEach((bench, index) => {
                var _a, _b, _c;
                if (bench.cards.length === 0) {
                    return;
                }
                if (((_a = bench.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(game_1.CardTag.POKEMON_EX)) || ((_b = bench.getPokemonCard()) === null || _b === void 0 ? void 0 : _b.tags.includes(game_1.CardTag.POKEMON_GX)) || ((_c = bench.getPokemonCard()) === null || _c === void 0 ? void 0 : _c.tags.includes(game_1.CardTag.TAG_TEAM))) {
                    gxsEXsOnBench++;
                }
                else {
                    const target = {
                        player: game_1.PlayerType.BOTTOM_PLAYER,
                        slot: game_1.SlotType.BENCH,
                        index
                    };
                    blockedTo.push(target);
                }
            });
            if (!gxsEXsOnBench) {
                return state;
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false, blocked: blockedTo }), targets => {
                if (!targets || targets.length === 0) {
                    return;
                }
                for (const target of targets) {
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, 60);
                    damageEffect.target = target;
                    store.reduceEffect(state, damageEffect);
                }
            });
        }
        // Dark Moon-GX
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            (0, prefabs_1.BLOCK_IF_GX_ATTACK_USED)(player);
            player.usedGX = true;
            opponent.marker.addMarker(this.DARK_MOON_MARKER, this);
            const extraEffectCost = [D, D, D, D, D, C];
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergy);
            const meetsExtraEffectCost = game_1.StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, extraEffectCost);
            if (meetsExtraEffectCost) {
                const activePokemon = opponent.active.getPokemonCard();
                if (activePokemon) {
                    const dealDamage = new attack_effects_1.KnockOutOpponentEffect(effect, 999);
                    dealDamage.target = opponent.active;
                    store.reduceEffect(state, dealDamage);
                }
            }
        }
        if ((effect instanceof play_card_effects_1.PlayItemEffect
            || effect instanceof play_card_effects_1.PlaySupporterEffect
            || effect instanceof play_card_effects_1.PlayStadiumEffect
            || effect instanceof play_card_effects_1.AttachPokemonToolEffect) && effect.player.marker.hasMarker(this.DARK_MOON_MARKER, this)) {
            throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.DARK_MOON_MARKER, this)) {
            effect.player.marker.removeMarker(this.DARK_MOON_MARKER, this);
        }
        return state;
    }
}
exports.UmbreonDarkraiGX = UmbreonDarkraiGX;
