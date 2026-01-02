"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamAquasManectric = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class TeamAquasManectric extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Team Aqua\'s Electrike';
        this.tags = [card_types_1.CardTag.TEAM_AQUA];
        this.cardType = L;
        this.additionalCardTypes = [D];
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: M, value: -30 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Power Shift',
                powerType: game_1.PowerType.POKEPOWER,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), you may move any number of basic Energy cards attached to 1 of your Pokémon with Team Aqua in its name to another of your Pokémon. This power can\'t be used if Team Aqua\'s Manectric is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Thunderspark',
                cost: [L, C, C],
                damage: 50,
                text: 'Does 10 damage to each Benched Pokémon (both yours and your opponent\'s) that has Energy cards attached to it. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }];
        this.set = 'MA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '4';
        this.name = 'Team Aqua\'s Manectric';
        this.fullName = 'Team Aqua\'s Manectric MA';
        this.POWER_SHIFT_MARKER = 'POWER_SHIFT_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);
            if (prefabs_1.HAS_MARKER(this.POWER_SHIFT_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            prefabs_1.ABILITY_USED(player, this);
            prefabs_1.ADD_MARKER(this.POWER_SHIFT_MARKER, player, this);
            const blockedFrom = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                var _a;
                if (!((_a = cardList.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.TEAM_AQUA))) {
                    blockedFrom.push(target);
                }
            });
            const blockedMap = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
                store.reduceEffect(state, checkProvidedEnergy);
                const blockedCards = [];
                checkProvidedEnergy.energyMap.forEach(em => {
                    if (em.card.energyType !== card_types_1.EnergyType.BASIC) {
                        blockedCards.push(em.card);
                    }
                });
                const blocked = [];
                blockedCards.forEach(bc => {
                    const index = cardList.cards.indexOf(bc);
                    if (index !== -1 && !blocked.includes(index)) {
                        blocked.push(index);
                    }
                });
                if (blocked.length !== 0) {
                    blockedMap.push({ source: target, blocked });
                }
            });
            store.prompt(state, new game_1.MoveEnergyPrompt(effect.player.id, game_1.GameMessage.MOVE_ENERGY_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], {}, { allowCancel: true, blockedMap, blockedFrom }), transfers => {
                if (transfers === null) {
                    return;
                }
                for (const transfer of transfers) {
                    const source = game_1.StateUtils.getTarget(state, player, transfer.from);
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    source.moveCardTo(transfer.card, target);
                }
            });
        }
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.POWER_SHIFT_MARKER, this);
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            // Check both players' Pokémon for Poké-Powers/Bodies
            [player, opponent].forEach(currentPlayer => {
                // Check bench Pokémon
                currentPlayer.bench.forEach(bench => {
                    if (bench) {
                        // Check if energy attached
                        const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(currentPlayer, bench);
                        store.reduceEffect(state, checkProvidedEnergyEffect);
                        if (checkProvidedEnergyEffect.energyMap.length > 0) {
                            // Apply damage to Pokémon
                            const damageEffect = new attack_effects_1.PutDamageEffect(effect, 10);
                            damageEffect.target = bench;
                            store.reduceEffect(state, damageEffect);
                        }
                    }
                });
            });
        }
        return state;
    }
}
exports.TeamAquasManectric = TeamAquasManectric;
