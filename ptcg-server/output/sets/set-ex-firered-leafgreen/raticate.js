"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Raticate = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_2 = require("../../game/store/prefabs/attack-effects");
class Raticate extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Rattata';
        this.cardType = C;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.retreat = [];
        this.powers = [{
                name: 'Thick Skin',
                powerType: game_1.PowerType.POKEBODY,
                text: 'Raticate can\'t be affected by any Special Conditions.'
            }];
        this.attacks = [{
                name: 'Pickup',
                cost: [C],
                damage: 0,
                text: 'Search your discard pile for a Basic Pokémon (or Evolution card), a Trainer card, and an Energy card. Show them to your opponent and put them into your hand.'
            },
            {
                name: 'Quick Attack',
                cost: [C],
                damage: 10,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 10 damage plus 40 more damage.'
            }];
        this.set = 'RG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '48';
        this.name = 'Raticate';
        this.fullName = 'Raticate RG';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.AddSpecialConditionsEffect && effect.target.getPokemonCard() === this) {
            effect.preventDefault = true;
        }
        if (prefabs_1.AFTER_ATTACK(effect, 0, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            let pokemons = 0;
            let energies = 0;
            let trainers = 0;
            const blocked = [];
            player.discard.cards.forEach((c, index) => {
                if (c instanceof game_1.EnergyCard) {
                    energies += 1;
                }
                else if (c instanceof pokemon_card_1.PokemonCard) {
                    pokemons += 1;
                }
                else if (c instanceof game_1.TrainerCard) {
                    trainers += 1;
                }
                else {
                    blocked.push(index);
                }
            });
            const maxPokemons = Math.min(pokemons, 1);
            const maxEnergies = Math.min(energies, 1);
            const maxTrainers = Math.min(trainers, 1);
            const count = maxPokemons + maxEnergies + maxTrainers;
            let cards = [];
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, {}, { min: 0, max: count, allowCancel: false, blocked, maxPokemons, maxEnergies, maxTrainers }), selected => {
                cards = selected || [];
                prefabs_1.SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
                prefabs_1.MOVE_CARDS(store, state, player.discard, player.hand, { cards, sourceCard: this, sourceEffect: this.attacks[0] });
            });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            attack_effects_2.FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 40);
        }
        return state;
    }
}
exports.Raticate = Raticate;
