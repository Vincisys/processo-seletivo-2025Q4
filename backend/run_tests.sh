#!/bin/bash
# Script para executar testes com diferentes opções

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}         EyesOnAsset - Test Runner${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

# Ativar ambiente virtual se não estiver ativado
if [[ -z "${VIRTUAL_ENV}" ]]; then
    echo -e "${YELLOW}⚠ Ativando ambiente virtual...${NC}"
    source ../.venv/bin/activate
fi

# Menu de opções
echo "Escolha uma opção:"
echo ""
echo "1) Todos os testes (rápido)"
echo "2) Todos os testes com cobertura detalhada"
echo "3) Apenas testes de modelos"
echo "4) Apenas testes de schemas"
echo "5) Apenas testes de serviços"
echo "6) Apenas testes de API"
echo "7) Teste específico (você escolhe)"
echo "8) Relatório de cobertura HTML"
echo ""
read -p "Opção: " option

case $option in
    1)
        echo -e "${GREEN}▶ Executando todos os testes...${NC}"
        pytest -v
        ;;
    2)
        echo -e "${GREEN}▶ Executando todos os testes com cobertura...${NC}"
        pytest --cov=app --cov-report=term-missing --cov-report=html -v
        echo ""
        echo -e "${YELLOW}📊 Relatório HTML gerado em: htmlcov/index.html${NC}"
        ;;
    3)
        echo -e "${GREEN}▶ Executando testes de modelos...${NC}"
        pytest tests/test_models.py -v
        ;;
    4)
        echo -e "${GREEN}▶ Executando testes de schemas...${NC}"
        pytest tests/test_schemas.py -v
        ;;
    5)
        echo -e "${GREEN}▶ Executando testes de serviços...${NC}"
        pytest tests/test_services.py -v
        ;;
    6)
        echo -e "${GREEN}▶ Executando testes de API...${NC}"
        pytest tests/test_api_owners.py tests/test_api_assets.py -v
        ;;
    7)
        echo ""
        echo "Exemplos:"
        echo "  tests/test_models.py::TestOwnerModel::test_create_owner"
        echo "  tests/test_api_owners.py::TestOwnerRoutes"
        echo ""
        read -p "Digite o caminho do teste: " test_path
        echo -e "${GREEN}▶ Executando teste específico...${NC}"
        pytest "$test_path" -v
        ;;
    8)
        echo -e "${GREEN}▶ Gerando relatório de cobertura...${NC}"
        pytest --cov=app --cov-report=html -v
        echo ""
        echo -e "${GREEN}✅ Relatório gerado!${NC}"
        echo -e "${YELLOW}📊 Abrir em: htmlcov/index.html${NC}"
        echo ""
        read -p "Abrir no navegador? (s/n): " open_browser
        if [[ "$open_browser" == "s" ]]; then
            xdg-open htmlcov/index.html 2>/dev/null || open htmlcov/index.html 2>/dev/null
        fi
        ;;
    *)
        echo -e "${YELLOW}⚠ Opção inválida${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
