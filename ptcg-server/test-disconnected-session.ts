import 'reflect-metadata';
import { createConnection } from 'typeorm';
import {
  Avatar, Conversation, Deck, DisconnectedSession, Match, Message, Replay, User,
  BattlePassSeason, UserBattlePass, UserUnlockedItem,
  Friend, FriendRequest, CardArtwork, UserFavoriteCard
} from './src/storage';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testDisconnectedSession() {
  console.log('Connecting to database...');

  const connection = await createConnection({
    type: process.env.STORAGE_TYPE as any,
    host: process.env.STORAGE_HOST,
    port: parseInt(process.env.STORAGE_PORT || '3306'),
    username: process.env.STORAGE_USERNAME,
    password: process.env.STORAGE_DATABASE_PASSWORD,
    database: process.env.STORAGE_DATABASE,
    entities: [
      Avatar,
      Conversation,
      Deck,
      DisconnectedSession,
      Friend,
      FriendRequest,
      Match,
      Message,
      Replay,
      User,
      BattlePassSeason,
      UserBattlePass,
      UserUnlockedItem,
      CardArtwork,
      UserFavoriteCard
    ],
    synchronize: false,
    logging: true
  });

  try {
    console.log('\n=== Creating DisconnectedSession ===');
    const session = new DisconnectedSession();
    session.userId = 25429;
    session.gameId = 2;
    session.gameState = '{"test": "data"}';
    session.disconnectedAt = Date.now();
    session.expiresAt = Date.now() + 60000;
    session.gamePhase = 'MAIN';
    session.isPlayerTurn = true;

    await session.save();
    console.log('Session created successfully:', session.id);

    console.log('\n=== Removing DisconnectedSession ===');
    await session.remove();
    console.log('Session removed successfully');

  } catch (error) {
    console.error('\n=== ERROR ===');
    console.error(error);
    throw error;
  } finally {
    await connection.close();
    console.log('\nDatabase connection closed');
  }
}

testDisconnectedSession()
  .then(() => {
    console.log('\n✓ Test completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n✗ Test failed');
    console.error(error);
    process.exit(1);
  });
