#!/bin/bash

# Script para executar testes com Docker

set -e

echo "Executando testes com Docker..."

if [ "$1" == "--coverage" ] || [ "$1" == "-c" ]; then
    echo "Executando testes com cobertura..."
    docker-compose run --rm test pytest --cov=app --cov-report=html --cov-report=term-missing
    echo ""
    echo "Relatório HTML gerado em htmlcov/index.html"
elif [ "$1" == "--verbose" ] || [ "$1" == "-v" ]; then
    docker-compose run --rm test pytest -v
else
    docker-compose run --rm test pytest "$@"
fi

