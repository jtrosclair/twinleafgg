"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LarrysStaraptor = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class LarrysStaraptor extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Larry\'s Staravia';
        this.tags = [game_1.CardTag.LARRYS];
        this.cardType = C;
        this.hp = 150;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Facade',
                cost: [C],
                damage: 60,
                damageCalculation: '+',
                text: 'If this Pokémon is Burned or Poisoned, this attack does 100 more damage.'
            },
            {
                name: 'Feathery Strike',
                cost: [C, C, C],
                damage: 150,
                text: 'Discard 2 Energy from this Pokémon, and this attack also does 50 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }];
        this.regulationMark = 'I';
        this.set = 'ASC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '170';
        this.name = 'Larry\'s Staraptor';
        this.fullName = 'Larry\'s Staraptor MC';
    }
    reduceEffect(store, state, effect) {
        // First attack - bonus damage if Poisoned or Burned
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const isPoisoned = player.active.specialConditions.includes(game_1.SpecialCondition.POISONED);
            const isBurned = player.active.specialConditions.includes(game_1.SpecialCondition.BURNED);
            if (isPoisoned || isBurned) {
                effect.damage += 100;
            }
        }
        // Feather Strike attack
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Discard 2 Energy
            const energyCount = player.active.cards.filter(card => card.superType === game_1.SuperType.ENERGY).length;
            if (energyCount >= 2) {
                state = store.prompt(state, new game_1.DiscardEnergyPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE], { superType: game_1.SuperType.ENERGY }, { allowCancel: false, min: 2, max: 2 }), transfers => {
                    transfers = transfers || [];
                    if (transfers.length > 0) {
                        for (const transfer of transfers) {
                            const source = game_1.StateUtils.getTarget(state, player, transfer.from);
                            source.moveCardTo(transfer.card, player.discard);
                        }
                    }
                    // Deal 50 damage to benched Pokemon
                    if (opponent.bench.some(b => b.cards.length > 0)) {
                        return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false, min: 1, max: 1 }), targets => {
                            targets = targets || [];
                            if (targets.length > 0) {
                                const dealDamage = new attack_effects_1.DealDamageEffect(effect, 50);
                                dealDamage.target = targets[0];
                                dealDamage.attackEffect.ignoreWeakness = true;
                                dealDamage.attackEffect.ignoreResistance = true;
                                return store.reduceEffect(state, dealDamage);
                            }
                        });
                    }
                });
            }
        }
        return state;
    }
}
exports.LarrysStaraptor = LarrysStaraptor;
