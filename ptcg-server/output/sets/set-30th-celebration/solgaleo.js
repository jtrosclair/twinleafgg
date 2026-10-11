"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Solgaleo = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Solgaleo extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Cosmoem';
        this.hp = 170;
        this.cardType = game_1.CardType.METAL;
        this.weakness = [{ type: game_1.CardType.FIRE }];
        this.resistance = [{ type: game_1.CardType.GRASS, value: -30 }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Sunrise',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your turn, if this Pokémon is on your Bench, you may use this Ability. Search your deck for up to 2 Basic [M] Energy cards and attach them to this Pokémon. Then, shuffle your deck.'
            }];
        this.attacks = [{
                name: 'Sunsteel Strike',
                cost: [game_1.CardType.METAL, game_1.CardType.METAL, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 220,
                text: 'Discard all Energy from this Pokémon.'
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '105';
        this.name = 'Solgaleo';
        this.fullName = 'Solgaleo 30C';
        this.SUNRISE_MARKER = 'SUNRISE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            const isBenched = player.bench.some(b => b === cardList);
            if (!isBenched) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            (0, prefabs_1.USE_ABILITY_ONCE_PER_TURN)(player, this.SUNRISE_MARKER, this);
            (0, prefabs_1.ABILITY_USED)(player, this);
            const blockedTo = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, _card, target) => {
                if (list !== cardList) {
                    blockedTo.push(target);
                }
            });
            return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, player.deck, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: game_1.SuperType.ENERGY, energyType: game_1.EnergyType.BASIC, name: 'Metal Energy' }, { allowCancel: true, min: 0, max: 2, blockedTo }), transfers => {
                transfers = transfers || [];
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    (0, prefabs_1.MOVE_CARDS)(store, state, player.deck, target, {
                        cards: [transfer.card],
                        sourceCard: this,
                        sourceEffect: this.powers[0],
                    });
                }
                (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
            });
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.SUNRISE_MARKER, this);
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.DISCARD_ALL_ENERGY_FROM_POKEMON)(store, state, effect, this);
        }
        return state;
    }
}
exports.Solgaleo = Solgaleo;
