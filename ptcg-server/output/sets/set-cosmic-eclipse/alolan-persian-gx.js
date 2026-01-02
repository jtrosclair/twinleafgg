"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlolanPersianGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class AlolanPersianGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Alolan Meowth';
        this.tags = [card_types_1.CardTag.POKEMON_GX];
        this.cardType = D;
        this.hp = 200;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Smug Face',
                powerType: game_1.PowerType.ABILITY,
                text: 'Prevent all effects of attacks, including damage, done to this Pokémon by your opponent\'s TAG TEAM Pokémon and Ultra Beasts, and by your opponent\'s Pokémon that have any Special Energy attached to them.'
            }];
        this.attacks = [{
                name: 'Claw Slash',
                cost: [D, C, C],
                damage: 120,
                text: ''
            },
            {
                name: 'Stalking Claws-GX',
                cost: [D, C, C],
                damage: 0,
                text: 'This attack does 120 damage to 1 of your opponent\'s Pokémon. This damage isn\'t affected by Weakness, Resistance, or any other effects on that Pokémon. (You can\'t use more than 1 GX attack in a game.)'
            }];
        this.set = 'CEC';
        this.setNumber = '129';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Alolan Persian-GX';
        this.fullName = 'Alolan Persian-GX CEC';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.AbstractAttackEffect && effect.target.getPokemonCard() === this) {
            const pokemonCard = effect.target.getPokemonCard();
            const sourceCard = effect.source.getPokemonCard();
            const isTagTeam = sourceCard === null || sourceCard === void 0 ? void 0 : sourceCard.tags.includes(card_types_1.CardTag.TAG_TEAM);
            const isUltraBeast = sourceCard === null || sourceCard === void 0 ? void 0 : sourceCard.tags.includes(card_types_1.CardTag.ULTRA_BEAST);
            const hasSpecialEnergy = effect.source.energies.cards.some(energy => energy.energyType === card_types_1.EnergyType.SPECIAL);
            if (pokemonCard !== this) {
                return state;
            }
            if (isTagTeam || isUltraBeast || hasSpecialEnergy) {
                // Try to reduce PowerEffect, to check if something is blocking our ability
                try {
                    const player = game_1.StateUtils.findOwner(state, effect.target);
                    const stub = new game_effects_1.PowerEffect(player, {
                        name: 'test',
                        powerType: game_1.PowerType.ABILITY,
                        text: ''
                    }, this);
                    store.reduceEffect(state, stub);
                }
                catch (_a) {
                    return state;
                }
                effect.preventDefault = true;
            }
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            prefabs_1.BLOCK_IF_GX_ATTACK_USED(player);
            player.usedGX = true;
            const targets = opponent.getPokemonInPlay();
            if (targets.length === 0)
                return state;
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE]), selected => {
                const target = selected[0];
                target.damage += 120;
                const afterDamage = new attack_effects_1.AfterDamageEffect(effect, 120);
                state = store.reduceEffect(state, afterDamage);
            });
        }
        return state;
    }
}
exports.AlolanPersianGX = AlolanPersianGX;
