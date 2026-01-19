"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Typhlosionex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Typhlosionex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Quilava';
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = R;
        this.hp = 150;
        this.weakness = [{ type: W }, { type: F }];
        this.retreat = [C];
        this.powers = [{
                name: 'Bursting Up',
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn when you play Typhlosion ex from your hand to evolve 1 of your Pokémon, count the number of your opponent\'s Benched Pokémon. You may search your deck for up to that number of [R] Energy cards and attach them to 1 of your [R] Pokémon. Shuffle your deck afterward.'
            }];
        this.attacks = [{
                name: 'Kindle',
                cost: [R, R, C, C],
                damage: 80,
                text: 'Discard an Energy card attached to Typhlosion ex and then discard an Energy card attached to the Defending Pokémon.'
            }];
        this.set = 'UF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '110';
        this.name = 'Typhlosion ex';
        this.fullName = 'Typhlosion ex UF';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.JUST_EVOLVED)(effect, this) && !(0, prefabs_1.IS_POKEPOWER_BLOCKED)(store, state, effect.player, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentBenched = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
            (0, prefabs_1.CONFIRMATION_PROMPT)(store, state, player, result => {
                if (result) {
                    const blockedTo = [];
                    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
                        const checkPokemonTypeEffect = new check_effects_1.CheckPokemonTypeEffect(list);
                        store.reduceEffect(state, checkPokemonTypeEffect);
                        // Only allow Fire Pokémon as targets
                        if (!checkPokemonTypeEffect.cardTypes.includes(card_types_1.CardType.FIRE)) {
                            blockedTo.push(target);
                        }
                    });
                    store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGY_FROM_DECK, player.deck, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Fire Energy' }, { allowCancel: true, min: 0, max: opponentBenched, sameTarget: true, blockedTo: blockedTo }), transfers => {
                        transfers = transfers || [];
                        (0, prefabs_1.ABILITY_USED)(player, this);
                        for (const transfer of transfers) {
                            const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                            player.deck.moveCardTo(transfer.card, target);
                        }
                        (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
                    });
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Discard energy from Typhlosion ex
            const cardList = game_1.StateUtils.findCardList(state, this);
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
            state = store.reduceEffect(state, checkProvidedEnergy);
            state = store.prompt(state, new game_1.ChooseEnergyPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, checkProvidedEnergy.energyMap, [card_types_1.CardType.COLORLESS], { allowCancel: false }), energy => {
                const cards = (energy || []).map(e => e.card);
                const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                discardEnergy.target = player.active;
                store.reduceEffect(state, discardEnergy);
            });
            // Discard energy from opponent's active Pokémon
            const activeCardList = opponent.active;
            const activePokemonCard = activeCardList.getPokemonCard();
            let hasPokemonWithEnergy = false;
            if (activePokemonCard && activeCardList.cards.some(c => c.superType === card_types_1.SuperType.ENERGY)) {
                hasPokemonWithEnergy = true;
            }
            if (!hasPokemonWithEnergy) {
                return state;
            }
            let cards = [];
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.active, { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false }), selected => {
                cards = selected || [];
            });
            const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
            return store.reduceEffect(state, discardEnergy);
        }
        return state;
    }
}
exports.Typhlosionex = Typhlosionex;
