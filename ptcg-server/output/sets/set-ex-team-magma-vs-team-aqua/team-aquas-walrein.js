"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamAquasWalrein = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class TeamAquasWalrein extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Team Aqua\'s Sealeo';
        this.tags = [card_types_1.CardTag.TEAM_AQUA];
        this.cardType = W;
        this.additionalCardTypes = [D];
        this.hp = 120;
        this.weakness = [{ type: F }, { type: M }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Power Blow',
                cost: [W],
                damage: 10,
                damageCalculation: '+',
                text: 'Does 10 damage plus 10 more damage for each Energy attached to Team Aqua\'s Walrein.'
            },
            {
                name: 'Hydro Reverse',
                cost: [W, W, C, C],
                damage: 50,
                damageCalculation: '+',
                text: 'You may return any number of basic [W] Energy cards attached to all of your Pokémon to your hand. If you do, this attack does 50 damage plus 10 more damage for each Energy you returned.'
            }];
        this.set = 'MA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '6';
        this.name = 'Team Aqua\'s Walrein';
        this.fullName = 'Team Aqua\'s Walrein MA';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const cardList = player.active;
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            let energies = 0;
            checkProvidedEnergyEffect.energyMap.forEach(energy => { energy.provides.forEach(e => { energies++; }); });
            effect.damage += 10 * energies;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            let availableTypedEnergy = 0;
            const blockedMap = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, pokemonCard, target) => {
                const blocked = [];
                let energyIndex = 0;
                cardList.cards.forEach(card => {
                    if (card.superType !== card_types_1.SuperType.ENERGY) {
                        return;
                    }
                    const isBasicWater = card instanceof energy_card_1.EnergyCard
                        && card.energyType === card_types_1.EnergyType.BASIC
                        && card.provides.includes(card_types_1.CardType.WATER);
                    if (!isBasicWater) {
                        blocked.push(energyIndex);
                    }
                    else {
                        availableTypedEnergy += 1;
                    }
                    energyIndex++;
                });
                blockedMap.push({ source: target, blocked });
            });
            if (availableTypedEnergy === 0) {
                return state;
            }
            return store.prompt(state, new game_1.DiscardEnergyPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGIES_TO_HAND, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Water Energy' }, { allowCancel: false, blockedMap }), transfers => {
                if (transfers === null || transfers.length === 0) {
                    return state;
                }
                for (const transfer of transfers) {
                    const card = transfer.card;
                    if (!(card instanceof energy_card_1.EnergyCard)
                        || (!card.provides.includes(card_types_1.CardType.WATER))) {
                        throw new game_1.GameError(game_1.GameMessage.INVALID_PROMPT_RESULT);
                    }
                }
                transfers.forEach(transfer => {
                    const source = game_1.StateUtils.getTarget(state, player, transfer.from);
                    source.moveCardTo(transfer.card, player.hand);
                });
                effect.damage += 10 * transfers.length;
                return state;
            });
        }
        return state;
    }
}
exports.TeamAquasWalrein = TeamAquasWalrein;
