"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Oricorioex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attach_energy_prompt_1 = require("../../game/store/prompts/attach-energy-prompt");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Oricorioex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 190;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.powers = [{
                name: 'Excited Turbo',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'As often as you like during your turn, if you have any [R] Mega Evolution Pokémon ex in play, you may use this Ability. You may attach a Basic [R] Energy card from your hand to 1 of your benched [R] Pokémon.'
            }];
        this.attacks = [{
                name: 'Buster Tail',
                cost: [R, R, C],
                damage: 110,
                text: ''
            }];
        this.regulationMark = 'I';
        this.set = 'PFL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '18';
        this.name = 'Oricorio ex';
        this.fullName = 'Oricorio ex M2';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const hasMegaEvolutionPokemonInPlay = player.active.cards.some(c => {
                return c instanceof pokemon_card_1.PokemonCard
                    && c.tags.includes(card_types_1.CardTag.POKEMON_ex)
                    && c.tags.includes(card_types_1.CardTag.POKEMON_SV_MEGA)
                    && c.cardType === card_types_1.CardType.FIRE;
            });
            if (!hasMegaEvolutionPokemonInPlay) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            // Check that we have Fire Pokemon on our bench
            const hasFirePokemonOnBench = player.bench.some(benchSlot => benchSlot.cards.some(c => c instanceof pokemon_card_1.PokemonCard && c.cardType === card_types_1.CardType.FIRE));
            if (!hasFirePokemonOnBench) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            // Block any Pokemon that are not Fire Pokemon on our bench
            const blocked = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
                if (card.cardType !== card_types_1.CardType.FIRE) {
                    blocked.push(target);
                }
            });
            const hasEnergyInHand = player.hand.cards.some(c => {
                return c instanceof game_1.EnergyCard
                    && c.energyType === card_types_1.EnergyType.BASIC
                    && c.provides.includes(card_types_1.CardType.FIRE);
            });
            if (!hasEnergyInHand) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            return store.prompt(state, new attach_energy_prompt_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, player.hand, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Fire Energy' }, { allowCancel: false, blockedTo: blocked }), transfers => {
                transfers = transfers || [];
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    const energyCard = transfer.card;
                    const attachEnergyEffect = new play_card_effects_1.AttachEnergyEffect(player, energyCard, target);
                    store.reduceEffect(state, attachEnergyEffect);
                }
            });
        }
        return state;
    }
}
exports.Oricorioex = Oricorioex;
