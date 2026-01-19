"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blastoiseex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attach_energy_prompt_1 = require("../../game/store/prompts/attach-energy-prompt");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Blastoiseex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Wartortle';
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = W;
        this.hp = 150;
        this.weakness = [{ type: L }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Energy Rain',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEPOWER,
                text: 'As often as you like during your turn (before your attack), you may attach a [W] Energy card from your hand to 1 of your Pokémon. Put 1 damage counter on that Pokémon. This power can\'t be used if Blastoise ex is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Hyper Whirlpool',
                cost: [W, W, W, C],
                damage: 80,
                text: 'Flip a coin until you get tails. For each heads, your opponent discards an Energy card attached to the Defending Pokémon.'
            }];
        this.set = 'RG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '104';
        this.name = 'Blastoise ex';
        this.fullName = 'Blastoise ex RG';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            const hasEnergyInHand = player.hand.cards.some(c => {
                return c instanceof game_1.EnergyCard
                    && c.energyType === card_types_1.EnergyType.BASIC
                    && c.provides.includes(card_types_1.CardType.WATER);
            });
            if (!hasEnergyInHand) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            (0, prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION)(player, this);
            return store.prompt(state, new attach_energy_prompt_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, player.hand, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Water Energy' }, { allowCancel: false }), transfers => {
                transfers = transfers || [];
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    const energyCard = transfer.card;
                    const attachEnergyEffect = new play_card_effects_1.AttachEnergyEffect(player, energyCard, target);
                    store.reduceEffect(state, attachEnergyEffect);
                    target.damage += 10;
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const active = opponent.active;
            // Check for energy cards early
            if (!active.cards.some(c => c.superType === card_types_1.SuperType.ENERGY)) {
                return state;
            }
            // Flip coins until tails, counting heads
            let heads = 0;
            const flipCoins = (s) => {
                return store.prompt(s, new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP), result => {
                    if (result === true) {
                        heads++;
                        return flipCoins(s);
                    }
                    // Tails - now discard energy cards based on heads count
                    // Get fresh opponent and active in case state changed
                    const currentOpponent = game_1.StateUtils.getOpponent(s, player);
                    const currentActive = currentOpponent.active;
                    const currentEnergyCards = currentActive.cards.filter(c => c.superType === card_types_1.SuperType.ENERGY);
                    const maxToDiscard = Math.min(heads, currentEnergyCards.length);
                    if (maxToDiscard === 0) {
                        return s;
                    }
                    return store.prompt(s, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, currentActive, { superType: card_types_1.SuperType.ENERGY }, { min: maxToDiscard, max: maxToDiscard, allowCancel: false }), selected => {
                        const cards = selected || [];
                        if (cards.length > 0) {
                            const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                            discardEnergy.target = currentActive;
                            return store.reduceEffect(s, discardEnergy);
                        }
                        return s;
                    });
                });
            };
            return flipCoins(state);
        }
        return state;
    }
}
exports.Blastoiseex = Blastoiseex;
