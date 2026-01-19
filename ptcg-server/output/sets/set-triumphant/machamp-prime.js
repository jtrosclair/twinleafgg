"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Machamp = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Machamp extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Machoke';
        this.tags = [card_types_1.CardTag.PRIME];
        this.cardType = F;
        this.hp = 150;
        this.weakness = [{ type: P }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Fighting Tag',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), if Machamp is on your Bench, you may move all [F] Energy attached to your Active Pokémon to Machamp. If you do, switch Machamp with your Active Pokémon.'
            }];
        this.attacks = [{
                name: 'Crushing Punch',
                cost: [F, C, C],
                damage: 60,
                text: 'Discard a Special Energy card attached to the Defending Pokémon.'
            },
            {
                name: 'Champ Buster',
                cost: [F, F, C, C],
                damage: 100,
                damageCalculation: '+',
                text: 'Does 100 damage plus 10 more damage for each of your Benched Pokémon that has any damage counters on it.'
            }];
        this.set = 'TM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '95';
        this.name = 'Machamp';
        this.fullName = 'Machamp TM';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            const source = player.active;
            if (player.active.getPokemonCard() === this) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, player.active);
            state = store.reduceEffect(state, checkProvidedEnergy);
            if (checkProvidedEnergy.energyMap.filter(energyMap => energyMap.provides.includes(card_types_1.CardType.FIGHTING) || energyMap.provides.includes(card_types_1.CardType.ANY)).length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            // Move all [F] and [ANY] energy from Active to this Benched Machamp, then switch
            // Find the Machamp on the bench (the one using the power)
            const machampBenchIndex = player.bench.findIndex(benchSlot => benchSlot.getPokemonCard() === this);
            if (machampBenchIndex === -1) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const machampBenchSlot = player.bench[machampBenchIndex];
            // Only move cards that provide FIGHTING or ANY
            const cardsToMove = checkProvidedEnergy.energyMap
                .filter(energyMap => energyMap.provides.includes(card_types_1.CardType.FIGHTING) || energyMap.provides.includes(card_types_1.CardType.ANY))
                .map(energyMap => energyMap.card);
            // Remove the cards from the active and add to Machamp on the bench
            cardsToMove.forEach(transfer => {
                source.moveCardTo(transfer, machampBenchSlot);
            });
            player.switchPokemon(player.bench[machampBenchIndex]);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const activeCardList = opponent.active;
            const activePokemonCard = activeCardList.getPokemonCard();
            let hasPokemonWithEnergy = false;
            if (activePokemonCard && activeCardList.energies.cards.some(c => c.superType === card_types_1.SuperType.ENERGY && c.energyType === card_types_1.EnergyType.SPECIAL)) {
                hasPokemonWithEnergy = true;
            }
            if (!hasPokemonWithEnergy) {
                return state;
            }
            let cards = [];
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.active, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.SPECIAL }, { min: 1, max: 1, allowCancel: false }), selected => {
                cards = selected || [];
            });
            const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
            return store.reduceEffect(state, discardEnergy);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            //I check how many Pokémon are on the bench to know how much damage the attack will cause.
            const player = effect.player;
            const hasBenched = player.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                return state;
            }
            let benchPokemonWithDamage = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                if (cardList === player.active) {
                    return;
                }
                if (cardList.damage !== 0) {
                    benchPokemonWithDamage++;
                }
            });
            (0, prefabs_1.THIS_ATTACK_DOES_X_MORE_DAMAGE)(effect, store, state, 10 * benchPokemonWithDamage);
        }
        return state;
    }
}
exports.Machamp = Machamp;
