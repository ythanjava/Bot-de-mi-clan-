#!/bin/bash

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}=============================="
echo -e "     Iniciando EXODI-BOT-MD"
echo -e "==============================${NC}"

while true; do
    echo -e "${YELLOW}[$(date '+%H:%M:%S')] Verificando sintaxis...${NC}"
    node check-syntax.mjs
    if [ $? -ne 0 ]; then
        echo -e "${RED}Errores de sintaxis detectados. Corrígelos antes de continuar.${NC}"
        exit 1
    fi

    echo -e "${GREEN}[$(date '+%H:%M:%S')] Ejecutando: npm start...${NC}"
    npm start

    EXIT_CODE=$?
    if [ $EXIT_CODE -ne 0 ]; then
        echo -e "${RED}[$(date '+%H:%M:%S')] EXODI-BOT-MD se cerró con código $EXIT_CODE. Reiniciando en 3 segundos...${NC}"
    else
        echo -e "${GREEN}[$(date '+%H:%M:%S')] EXODI-BOT-MD finalizó correctamente. Reiniciando en 3 segundos...${NC}"
    fi
    sleep 3
done