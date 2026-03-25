"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Krookodile = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Krookodile extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.TEAM_PLASMA];
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Krokorok';
        this.cardType = D;
        this.hp = 140;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Piston Headbutt',
                cost: [D],
                damage: 30,
                text: 'Move an Energy attached to the Defending Pokémon to 1 of your opponent\'s Benched Pokémon.'
            },
            {
                name: 'Hammer In',
                cost: [D, C, C],
                damage: 80,
                text: ''
            }
        ];
        this.set = 'PLF';
        this.setNumber = '70';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Krookodile';
        this.fullName = 'Krookodile PLF';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Piston Headbutt - move energy from defending to opponent's benched
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Check if defending has energy
            const hasEnergy = opponent.active.cards.some(c => c.superType === card_types_1.SuperType.ENERGY);
            // Check if opponent has benched Pokemon
            const hasBenched = opponent.bench.some(b => b.cards.length > 0);
            if (!hasEnergy || !hasBenched) {
                return state;
            }
            // Choose energy to move
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, opponent.active, { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false }), selectedEnergy => {
                if (!selectedEnergy || selectedEnergy.length === 0) {
                    return;
                }
                const energyCard = selectedEnergy[0];
                // Choose benched Pokemon to move energy to
                store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_ATTACH_CARDS, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                    if (!targets || targets.length === 0) {
                        return;
                    }
                    opponent.active.moveCardTo(energyCard, targets[0]);
                });
            });
        }
        return state;
    }
}
exports.Krookodile = Krookodile;
