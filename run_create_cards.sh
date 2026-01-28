#!/bin/bash
cd /srv/twinleafgg
source venv/bin/activate
python create_cards.py
deactivate