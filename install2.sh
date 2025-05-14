#!/bin/bash

# Detener ejecución si ocurre un error
set -e

# Colores para estilo
GREEN='\033[0;32m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # Sin color

echo -e "${CYAN}══════════════════════════════════════"
echo -e "     EXODIN BOT - INICIO AUTOMÁTICO"
echo -e "══════════════════════════════════════${NC}"

# Comprobación de dependencias
command -v npm >/dev/null 2>&1 || { echo -e "${RED}❌ npm no está instalado. Instálalo primero.${NC}"; exit 1; }
command -v curl >/dev/null 2>&1 || { echo -e "${RED}❌ curl no está instalado. Instálalo primero.${NC}"; exit 1; }

# Verificar node_modules
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✔ La carpeta 'node_modules' ya existe. Omitiendo descarga e instalación.${NC}"
else
    echo -e "${CYAN}↓ Descargando node_modules.tar.gz...${NC}"
    curl -L -o node_modules.tar.gz https://github.com/elrebelde21/NovaBot_MD/releases/download/1.1.8/node_modules.tar.gz

    echo -e "${CYAN}↪ Extrayendo node_modules...${NC}"
    tar -xzf node_modules.tar.gz

    echo -e "${CYAN}⛔ Eliminando archivo comprimido...${NC}"
    rm node_modules.tar.gz

    echo -e "${GREEN}✔ Dependencias instaladas correctamente.${NC}"
fi

# Iniciar el bot
echo -e "${CYAN}⚡ Iniciando EXODIN BOT...${NC}"
npm start