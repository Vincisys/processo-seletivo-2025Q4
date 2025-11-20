#!/bin/bash
# Script para recriar o venv do backend após renomeação da pasta

cd "$(dirname "$0")"
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
echo "Venv recriado com sucesso!"

