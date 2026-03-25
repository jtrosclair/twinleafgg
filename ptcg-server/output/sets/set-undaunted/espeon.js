"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Espeon = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Espeon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Eevee';
        this.cardType = P;
        this.hp = 100;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.powers = [{
                name: 'Evolution Memories',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.POKEBODY,
                text: 'Espeon can use the attacks of all Pokémon you have in play that evolve from Eevee as its own. (You still need the necessary Energy to use each attack.)'
            }];
        this.attacks = [{
                name: 'Solar Ray',
                cost: [P, C],
                damage: 30,
                text: 'Remove 1 damage counter from each of your Pokémon.'
            }];
        this.set = 'UD';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '81';
        this.name = 'Espeon';
        this.fullName = 'Espeon UD';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            const pokemonCard = player.active.getPokemonCard();
            if (pokemonCard !== this) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            // Build cards and blocked for Choose Attack prompt
            const { pokemonCards, blocked } = this.buildAttackList(state, store, player);
            // No attacks to copy
            if (pokemonCards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            return store.prompt(state, new game_1.ChooseAttackPrompt(player.id, game_1.GameMessage.CHOOSE_ATTACK_TO_COPY, pokemonCards, { allowCancel: true, blocked }), attack => {
                if (attack !== null) {
                    const useAttackEffect = new game_effects_1.UseAttackEffect(player, attack);
                    store.reduceEffect(state, useAttackEffect);
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                const healTargetEffect = new attack_effects_1.HealTargetEffect(effect, 10);
                healTargetEffect.target = cardList;
                state = store.reduceEffect(state, healTargetEffect);
            });
        }
        return state;
    }
    buildAttackList(state, store, player) {
        const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player);
        store.reduceEffect(state, checkProvidedEnergyEffect);
        const energyMap = checkProvidedEnergyEffect.energyMap;
        const pokemonCards = [];
        const blocked = [];
        player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
            const card = cardList.getPokemonCard();
            if (card && card.evolvesFrom === 'Eevee') {
                this.checkAttack(state, store, player, card, energyMap, pokemonCards, blocked);
            }
        });
        return { pokemonCards, blocked };
    }
    checkAttack(state, store, player, card, energyMap, pokemonCards, blocked) {
        {
            const attacks = card.attacks.filter(attack => {
                const checkAttackCost = new check_effects_1.CheckAttackCostEffect(player, attack);
                state = store.reduceEffect(state, checkAttackCost);
                return game_1.StateUtils.checkEnoughEnergy(energyMap, checkAttackCost.cost);
            });
            const index = pokemonCards.length;
            pokemonCards.push(card);
            card.attacks.forEach(attack => {
                if (!attacks.includes(attack)) {
                    blocked.push({ index, attack: attack.name });
                }
            });
        }
    }
}
exports.Espeon = Espeon;
