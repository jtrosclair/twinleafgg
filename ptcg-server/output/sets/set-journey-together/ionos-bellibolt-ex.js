"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IonosBelliboltex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class IonosBelliboltex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.IONOS, card_types_1.CardTag.POKEMON_ex];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Iono\'s Tadbulb';
        this.cardType = L;
        this.hp = 280;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Electric Streamer',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'As often as you like during your turn, you may attach a Basic [L] Energy card from your hand to 1 of your Iono\'s Pokémon.'
            }];
        this.attacks = [{
                name: 'Thunderous Bolt',
                cost: [L, L, L, C],
                damage: 230,
                text: 'During your next turn, this Pokemon can\'t attack.'
            }];
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.set = 'JTG';
        this.setNumber = '53';
        this.name = 'Iono\'s Bellibolt ex';
        this.fullName = 'Iono\'s Bellibolt ex JTG';
    }
    reduceEffect(store, state, effect) {
        // Electro Streamer
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            const hasEnergyInHand = player.hand.cards.some(c => {
                return c.superType === card_types_1.SuperType.ENERGY
                    && c.energyType === card_types_1.EnergyType.BASIC
                    && c.provides.includes(L);
            });
            if (!hasEnergyInHand) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const blockedTo = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (!card.tags.includes(card_types_1.CardTag.IONOS)) {
                    blockedTo.push(target);
                }
            });
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, player.hand, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Lightning Energy' }, { allowCancel: false, blockedTo }), transfers => {
                transfers = transfers || [];
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    const energyCard = transfer.card;
                    const attachEnergyEffect = new play_card_effects_1.AttachEnergyEffect(player, energyCard, target);
                    store.reduceEffect(state, attachEnergyEffect);
                }
            });
            return state;
        }
        // Thunderous Bolt
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            player.active.cannotAttackNextTurnPending = true;
        }
        return state;
    }
}
exports.IonosBelliboltex = IonosBelliboltex;
