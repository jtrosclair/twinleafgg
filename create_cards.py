#!/usr/bin/env python3
"""
Automated Pokemon TCG Card Implementation Script

This script:
1. Queries PostgreSQL for cards with completedAt = null
2. Creates Claude Code CLI sessions to implement each card
3. Commits and pushes changes
4. Calls completion webhook when done
"""

import os
import sys
import json
import subprocess
import requests
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Environment variables
API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:3000")
ADMIN_TOKEN = os.getenv("ADMIN_TOKEN")

if not ADMIN_TOKEN:
    print("Error: ADMIN_TOKEN environment variable not set")
    sys.exit(1)


def get_pending_cards():
    """Get all incomplete missing cards from API"""
    try:
        url = f"{API_BASE_URL}/api/admin/missing-cards"
        headers = {"x-admin-token": f"{ADMIN_TOKEN}"}

        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()

        data = response.json()
        cards = data.get("missingCards", [])

        # Transform to match expected format
        return [{
            "cardId": card["cardId"],
            "json": card["JSON"],
            "requestedByUsers": card["requestedByUsers"],
            "createdAt": card["createdAt"]
        } for card in cards]

    except requests.exceptions.RequestException as e:
        print(f"Error fetching cards from API: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"Error processing API response: {e}")
        sys.exit(1)


def mark_card_completed(card_id):
    """Mark a card as completed via API (also notifies users)"""
    try:
        url = f"{API_BASE_URL}/api/admin/missing-cards/complete"
        headers = {
            "x-admin-token": f"{ADMIN_TOKEN}",
            "Content-Type": "application/json"
        }
        payload = {"cardId": card_id}

        response = requests.post(url, headers=headers, json=payload, timeout=30)
        response.raise_for_status()

        data = response.json()

        print(f"✓ Marked card {card_id} as completed")
        print(f"  Card name: {data.get('cardName', 'Unknown')}")
        print(f"  Users notified: {data.get('usersNotified', 0)}")
        print(f"  Devices notified: {data.get('devicesNotified', 0)}")

        return True
    except requests.exceptions.RequestException as e:
        print(f"✗ Error marking card as completed via API: {e}")
        return False
    except Exception as e:
        print(f"✗ Error processing completion response: {e}")
        return False


def create_card_implementation_prompt(card_data):
    """Create the prompt for Claude to implement the card"""
    card_json = json.loads(card_data["json"]) if isinstance(card_data["json"], str) else card_data["json"]

    # Format the card data nicely
    card_info = json.dumps(card_json, indent=2)

    prompt = f"""Implement a Pokemon TCG card based on the following data from TCGDex.dev:

{card_info}

Please follow the instructions in ptcg-server/CREATE_CARD.txt exactly:

1. Locate the appropriate set directory in ptcg-server/src/sets/
2. Create the card file using kebab-case naming
3. Implement all card functionality (reference similar cards for effects)
4. Register the card in the set's index.ts in alphabetical order
5. Commit the changes with the message format: "Implement [CARDNAME SETCODE SETNUMBER]"
6. Push the changes to the repository

Important notes:
- Use the set code from ptcg-server/output/sets/index.d.ts
- Reference other cards in the same set for mechanics (uppercase "EX" and "ex" are not the same)
- Remove leading zeros from set numbers (001 → 1)
- Reference the effect type table in CREATE_CARD.txt for similar implementations
- Ensure all properties are implemented correctly (HP, types, stage, attacks, effects, etc.)

After completing the implementation and pushing, respond with "IMPLEMENTATION_COMPLETE" so I know you're done.
"""

    return prompt


def implement_card_with_agent(card_data):
    """Use Claude Code CLI agent to implement a card"""
    card_id = card_data["cardId"]
    print(f"\n{'='*60}")
    print(f"Starting implementation for card: {card_id}")
    print(f"{'='*60}\n")

    try:
        # Parse the card JSON to get the name
        card_json = json.loads(card_data["json"]) if isinstance(card_data["json"], str) else card_data["json"]
        card_name = card_json.get("name", card_id)
        print(f"Card name: {card_name}")
        print(f"Set: {card_json.get('set', {}).get('name', 'Unknown')}")
        print(f"Category: {card_json.get('category', 'Unknown')}\n")

        # Create the prompt
        prompt = create_card_implementation_prompt(card_data)

        # Call Claude Code CLI with the prompt
        print("Starting Claude Code CLI agent (sonnet model)...")
        print("This may take several minutes as the agent implements the card...\n")

        # Run claude CLI with bypassed permissions for automated card implementation
        # WARNING: Only use in trusted directories for automated card implementation
        process = subprocess.Popen(
            [
                "~/.local/bin/claude",
                "--model", "sonnet",
                "--allow-dangerously-skip-permissions",
                "--dangerously-skip-permissions"
            ],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            cwd="/srv/twinleafgg"
        )

        # Send the prompt via stdin and get the response
        stdout, stderr = process.communicate(input=prompt, timeout=600)  # 10 minute timeout

        if process.returncode != 0:
            print(f"✗ Claude Code CLI exited with error code {process.returncode}")
            if stderr:
                print(f"Error output: {stderr}")
            return False

        print("\n--- Agent Response ---")
        print(stdout)
        print("--- End Response ---\n")

        # Check if implementation was completed successfully
        # Look for success indicators in the output
        success_indicators = [
            "IMPLEMENTATION_COMPLETE",
            "implementation completed",
            "successfully committed",
            "successfully pushed"
        ]

        output_lower = stdout.lower()
        if any(indicator.lower() in output_lower for indicator in success_indicators):
            print(f"✓ Card {card_id} implementation completed")

            # Mark as completed and notify users via API
            if mark_card_completed(card_id):
                return True
            else:
                print(f"⚠ Failed to mark card as completed in API")
                return False
        else:
            print(f"⚠ Card {card_id} may not have completed successfully")
            print("Response does not contain expected completion confirmation")
            return False

    except subprocess.TimeoutExpired:
        print(f"✗ Card {card_id} implementation timed out after 10 minutes")
        return False
    except Exception as e:
        print(f"✗ Error implementing card {card_id}: {e}")
        return False


def main():
    """Main execution function"""
    print("Pokemon TCG Card Auto-Implementation Script")
    print("=" * 60)
    print()

    # Get pending cards
    print("Fetching pending cards from database...")
    cards = get_pending_cards()

    if not cards:
        print("No pending cards found. All cards are complete!")
        return

    print(f"Found {len(cards)} pending card(s)\n")

    # Process each card
    successful = 0
    failed = 0

    for i, card in enumerate(cards, 1):
        print(f"\nProcessing card {i}/{len(cards)}")

        if implement_card_with_agent(card):
            successful += 1
        else:
            failed += 1

    # Summary
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"Total cards processed: {len(cards)}")
    print(f"Successful: {successful}")
    print(f"Failed: {failed}")
    print()


if __name__ == "__main__":
    main()
