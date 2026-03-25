"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kecleon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Kecleon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.powers = [{
                name: 'Color Change',
                powerType: game_1.PowerType.ABILITY,
                text: 'As long as this Pokémon is your Active Pokémon, this Pokémon is the same type as the your opponent\'s Active Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Imittack',
                cost: [C],
                damage: 0,
                text: 'Choose 1 of the Defending Pokémon\'s attacks. If this Pokémon has the necessary Energy to use that attack, use it as this attack.'
            }
        ];
        this.set = 'PLF';
        this.setNumber = '94';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Kecleon';
        this.fullName = 'Kecleon PLF';
    }
    reduceEffect(store, state, effect) {
        // Ability: Color Change (passive - type change when active)
        if (effect instanceof check_effects_1.CheckPokemonTypeEffect && effect.target.getPokemonCard() === this) {
            let owner = null;
            state.players.forEach(p => {
                p.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                    if (cardList === effect.target) {
                        owner = p;
                    }
                });
            });
            if (!owner) {
                return state;
            }
            // Only applies when this Pokemon is the Active
            if (owner.active !== effect.target) {
                return state;
            }
            // Check ability lock
            try {
                const stub = new game_effects_1.PowerEffect(owner, {
                    name: 'test',
                    powerType: game_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            const opponent = game_1.StateUtils.getOpponent(state, owner);
            const opponentCard = opponent.active.getPokemonCard();
            if (opponentCard) {
                // Check opponent's type via CheckPokemonTypeEffect
                const opponentTypeCheck = new check_effects_1.CheckPokemonTypeEffect(opponent.active);
                store.reduceEffect(state, opponentTypeCheck);
                effect.cardTypes = [...opponentTypeCheck.cardTypes];
            }
        }
        // Attack: Imittack
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentCard = opponent.active.getPokemonCard();
            if (!opponentCard || opponentCard.attacks.length === 0) {
                return state;
            }
            // Build blocked list based on energy cost
            const { pokemonCards, blocked } = this.buildAttackList(state, store, player, opponentCard);
            if (pokemonCards.length === 0) {
                return state;
            }
            // Check if all attacks are blocked
            const allBlocked = opponentCard.attacks.every(attack => blocked.some(b => b.index === 0 && b.attack === attack.name));
            if (allBlocked) {
                return state;
            }
            return store.prompt(state, new game_1.ChooseAttackPrompt(player.id, game_1.GameMessage.CHOOSE_ATTACK_TO_COPY, pokemonCards, { allowCancel: false, blocked }), attack => {
                if (attack !== null) {
                    const useAttackEffect = new game_effects_1.UseAttackEffect(player, attack);
                    store.reduceEffect(state, useAttackEffect);
                }
            });
        }
        return state;
    }
    buildAttackList(state, store, player, opponentCard) {
        const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player);
        store.reduceEffect(state, checkProvidedEnergyEffect);
        const energyMap = checkProvidedEnergyEffect.energyMap;
        const pokemonCards = [opponentCard];
        const blocked = [];
        opponentCard.attacks.forEach(attack => {
            const checkAttackCost = new check_effects_1.CheckAttackCostEffect(player, attack);
            state = store.reduceEffect(state, checkAttackCost);
            if (!game_1.StateUtils.checkEnoughEnergy(energyMap, checkAttackCost.cost)) {
                blocked.push({ index: 0, attack: attack.name });
            }
        });
        return { pokemonCards, blocked };
    }
}
exports.Kecleon = Kecleon;
