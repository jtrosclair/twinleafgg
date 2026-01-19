"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamRocketsMewtwoex = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class TeamRocketsMewtwoex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.TEAM_ROCKET, game_1.CardTag.POKEMON_ex];
        this.cardType = P;
        this.hp = 280;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Power Saver',
                powerType: game_1.PowerType.ABILITY,
                text: 'This Pokémon can\'t attack unless you have 4 or more Team Rocket\'s Pokemon in play.'
            }];
        this.attacks = [
            {
                name: 'Erasure Ball',
                cost: [P, P, C],
                damage: 160,
                damageCalculation: '+',
                text: 'You may discard up to 2 Energy from your Benched Pokémon. This attack does 60 more damage for each card you discarded this way.'
            }
        ];
        this.regulationMark = 'I';
        this.set = 'DRI';
        this.setNumber = '81';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Team Rocket\'s Mewtwo ex';
        this.fullName = 'Team Rocket\'s Mewtwo ex DRI';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseAttackEffect && effect.source.cards.includes(this)) {
            const player = effect.player;
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            // Count Team Rocket's Pokémon in play
            let teamRocketPokemonCount = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === null || card === void 0 ? void 0 : card.tags.includes(game_1.CardTag.TEAM_ROCKET)) {
                    teamRocketPokemonCount++;
                }
            });
            // If less than 4 Team Rocket's Pokémon, prevent attack
            if (teamRocketPokemonCount < 4) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
            }
        }
        // Handle Deletion Sphere attack
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const hasBenched = player.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                return state;
            }
            state = store.prompt(state, new game_1.DiscardEnergyPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: game_1.SuperType.ENERGY, energyType: game_1.EnergyType.BASIC }, { min: 0, max: 2, allowCancel: false }), transfers => {
                if (transfers === null) {
                    return state;
                }
                const baseDamage = 160;
                const additionalDamage = transfers.length * 60;
                effect.damage = baseDamage + additionalDamage;
                for (const transfer of transfers) {
                    const source = game_1.StateUtils.getTarget(state, player, transfer.from);
                    const target = player.discard;
                    source.moveCardTo(transfer.card, target);
                }
                return state;
            });
        }
        return state;
    }
}
exports.TeamRocketsMewtwoex = TeamRocketsMewtwoex;
