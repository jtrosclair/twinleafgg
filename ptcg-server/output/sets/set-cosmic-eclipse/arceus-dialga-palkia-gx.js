"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArceusDialgaPalkiaGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
function* useUltimateRay(next, store, state, effect) {
    const player = effect.player;
    if (player.deck.cards.length === 0) {
        return state;
    }
    yield store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.deck, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: false, min: 0, max: 3 }), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
            const target = game_1.StateUtils.getTarget(state, player, transfer.to);
            player.deck.moveCardTo(transfer.card, target);
            next();
        }
    });
    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class ArceusDialgaPalkiaGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_GX, card_types_1.CardTag.TAG_TEAM];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = N;
        this.hp = 280;
        this.weakness = [{ type: Y }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Ultimate Ray',
                cost: [W, M, C],
                damage: 150,
                text: 'Search your deck for up to 3 basic Energy cards and attach them to your Pokémon in any way you like. Then, shuffle your deck.'
            },
            {
                name: 'Altered Creation-GX',
                cost: [M],
                damage: 0,
                text: 'For the rest of this game, your Pokémon\'s attacks do 30 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance). If this Pokémon has at least 1 extra [W] Energy attached to it (in addition to this attack\'s cost), when your opponent\'s Active Pokémon is Knocked Out by damage from those attacks, take 1 more Prize card. (You can\'t use more than 1 GX attack in a game.)'
            }];
        this.set = 'CEC';
        this.name = 'Arceus & Dialga & Palkia-GX';
        this.fullName = 'Arceus & Dialga & Palkia GX CEC';
        this.setNumber = '156';
        this.cardImage = 'assets/cardback.png';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const generator = useUltimateRay(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            // Check if player has used altered creation
            (0, prefabs_1.BLOCK_IF_GX_ATTACK_USED)(player);
            player.usedGX = true;
            player.alteredCreationDamage = true;
            // Check attached energy
            const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, player.active);
            state = store.reduceEffect(state, checkEnergy);
            // Check attack cost
            const checkAttackCost = new check_effects_1.CheckAttackCostEffect(player, this.attacks[1]);
            state = store.reduceEffect(state, checkAttackCost);
            // Count Water energies attached
            const waterEnergies = checkEnergy.energyMap.filter(e => e.provides.includes(card_types_1.CardType.WATER) || e.provides.includes(card_types_1.CardType.ANY));
            // Check if there's at least 1 extra Water energy beyond the Metal cost
            // Since cost is [METAL], any Water energy is "extra"
            if (waterEnergies.length >= 1) {
                player.usedAlteredCreation = true;
                console.log('Used Altered Creation with Extra Water');
            }
        }
        // Apply +30 damage boost to AttackEffect (before damage effects are created)
        // This ensures it's only applied once per attack
        if (effect instanceof attack_effects_1.DealDamageEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Only apply to attacks targeting opponent's active Pokémon
            if (player.alteredCreationDamage === true && effect.target === opponent.active && !effect.damageIncreased) {
                effect.damage += 30;
                effect.damageIncreased = true;
            }
        }
        if (effect instanceof game_effects_1.KnockOutEffect) {
            // effect.player is the owner of the knocked-out Pokémon
            const knockedOutOwner = effect.player;
            // Get the attacker (opponent of the knocked-out owner)
            const attacker = game_1.StateUtils.getOpponent(state, knockedOutOwner);
            // Only trigger if:
            // 1. The knocked out Pokémon is the attacker's opponent's active (i.e., attacker's target)
            // 2. It occurred during an attack phase
            // 3. It's the attacker's turn
            // 4. The attacker used Altered Creation with extra Water energy
            if (effect.target === knockedOutOwner.active &&
                state.phase === game_1.GamePhase.ATTACK &&
                state.players[state.activePlayer] === attacker &&
                attacker.usedAlteredCreation === true &&
                !effect.prizeIncreased) {
                effect.prizeCount += 1;
                effect.prizeIncreased = true;
            }
        }
        return state;
    }
}
exports.ArceusDialgaPalkiaGX = ArceusDialgaPalkiaGX;
