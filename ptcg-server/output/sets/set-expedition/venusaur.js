"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Venusaur = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Venusaur extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Ivysaur';
        this.cardType = G;
        this.hp = 100;
        this.weakness = [{ type: R }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Harvest Bounty',
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), if you attach an Energy card to your Active Pokémon as part of your turn, you may attach an additional Energy card to that Pokémon at the same time. This power can\'t be used if Venusaur is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Body Slam',
                cost: [G, G, C, C],
                damage: 40,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
            }];
        this.set = 'EX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '68';
        this.name = 'Venusaur';
        this.fullName = 'Venusaur EX';
        this.HARVEST_BOUNTY_MARKER = 'HARVEST_BOUNTY_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.AttachEnergyEffect) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            const owner = game_1.StateUtils.findOwner(state, cardList);
            const active = effect.player.active;
            let isVenusaurInPlay = false;
            owner.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isVenusaurInPlay = true;
                }
            });
            if (!isVenusaurInPlay) {
                return state;
            }
            if (prefabs_1.HAS_MARKER(this.HARVEST_BOUNTY_MARKER, player, this)) {
                return state;
            }
            const energyInHand = player.hand.cards.filter(c => c.superType === card_types_1.SuperType.ENERGY && c !== effect.energyCard);
            if (!prefabs_1.IS_POKEPOWER_BLOCKED(store, state, player, this) && energyInHand.length > 0) {
                if (owner === player && effect.target === active) {
                    prefabs_1.CONFIRMATION_PROMPT(store, state, player, result => {
                        if (result) {
                            // Once per turn
                            prefabs_1.ADD_MARKER(this.HARVEST_BOUNTY_MARKER, player, this);
                            prefabs_1.ABILITY_USED(player, this);
                            store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, player.hand, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: 1, max: 1 }), transfers => {
                                transfers = transfers || [];
                                if (transfers.length === 0) {
                                    return state;
                                }
                                // Attach second energy
                                for (const transfer of transfers) {
                                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                                    const energyCard = transfer.card;
                                    const attachEnergyEffect = new play_card_effects_1.AttachEnergyEffect(player, energyCard, target);
                                    store.reduceEffect(state, attachEnergyEffect);
                                }
                            });
                        }
                    });
                }
            }
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            prefabs_1.COIN_FLIP_PROMPT(store, state, effect.player, result => {
                if (result) {
                    attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
                }
            });
        }
        return state;
    }
}
exports.Venusaur = Venusaur;
