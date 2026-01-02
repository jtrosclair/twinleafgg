"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Charizard = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Charizard extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Charmeleon';
        this.cardType = R;
        this.hp = 150;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Roaring Resolve',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), you may put 2 damage counters on this Pokémon. If you do, search your deck for up to 2 [R] Energy cards and attach them to this Pokémon. Then, shuffle your deck.'
            }];
        this.attacks = [
            {
                name: 'Continuous Blaze Ball',
                cost: [R, R],
                damage: 30,
                damageCalculation: '+',
                text: 'Discard all [R] Energy from this Pokémon. This attack does 50 more damage for each card you discarded in this way.'
            }
        ];
        this.set = 'TEU';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '14';
        this.name = 'Charizard';
        this.fullName = 'Charizard TEU';
        this.ROARING_RESEOLVE_MARKER = 'ROARING_RESEOLVE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            //Once per turn
            if (prefabs_1.HAS_MARKER(this.ROARING_RESEOLVE_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            if (prefabs_1.IS_ABILITY_BLOCKED(store, state, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.ABILITY_BLOCKED);
            }
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    cardList.damage += 20;
                }
            });
            const blockedTo = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() !== this) {
                    blockedTo.push({
                        player: game_1.PlayerType.BOTTOM_PLAYER,
                        slot: cardList === player.active ? game_1.SlotType.ACTIVE : game_1.SlotType.BENCH,
                        index: cardList === player.active ? 0 : player.bench.indexOf(cardList)
                    });
                }
            });
            store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, player.deck, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { superType: game_1.SuperType.ENERGY, energyType: game_1.EnergyType.BASIC, name: 'Fire Energy' }, {
                min: 0,
                max: 2,
                allowCancel: false,
                blockedTo
            }), transfers => {
                transfers = transfers || [];
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.deck.moveCardTo(transfer.card, target);
                }
                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            });
            return state;
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            let totalDiscarded = 0;
            const cards = checkProvidedEnergy.energyMap.map(e => e.card);
            const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
            discardEnergy.target = player.active;
            totalDiscarded += discardEnergy.cards.length;
            store.reduceEffect(state, discardEnergy);
            effect.damage += (totalDiscarded) * 50;
        }
        return state;
    }
}
exports.Charizard = Charizard;
