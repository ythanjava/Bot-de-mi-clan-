#!/data/data/com.termux/files/usr/bin/bash
# Script creado por @JAVIER - Instalador para Exodi-Bot-MD

# Mensaje decorativo
echo -e "\e[35m
─█▀▀█ ───░█ ░█─░█ ░█▀▀▀█ ▀▀█▀▀ ░█▀▀▀ 　 ░█─── ─█▀▀█ 　 ░█▀▀█ ─█▀▀█ ░█▄─░█ ▀▀█▀▀ ─█▀▀█ ░█─── ░█─── ─█▀▀█ 
░█▄▄█ ─▄─░█ ░█─░█ ─▀▀▀▄▄ ─░█── ░█▀▀▀ 　 ░█─── ░█▄▄█ 　 ░█▄▄█ ░█▄▄█ ░█░█░█ ─░█── ░█▄▄█ ░█─── ░█─── ░█▄▄█ 
░█─░█ ░█▄▄█ ─▀▄▄▀ ░█▄▄▄█ ─░█── ░█▄▄▄ 　 ░█▄▄█ ░█─░█ 　 ░█─── ░█─░█ ░█──▀█ ─░█── ░█─░█ ░█▄▄█ ░█▄▄█ ░█─░█
\e[0m"
# Instalación de dependencias
echo -e "\n\033[01;32mInstalando dependencias necesarias...\033[0m"
pkg update -y && pkg upgrade -y
pkg install -y git nodejs ffmpeg imagemagick yarn

# Verificación
for dep in git node ffmpeg convert yarn; do
  if ! command -v $dep >/dev/null; then
    echo -e "\033[0;31mFalta el paquete: $dep. Instálalo manualmente.\033[0m"
    exit 1
  fi
done

# Clonación del repositorio
echo -e "\033[01;34mClonando GataBot-MD...\033[0m"
git clone https://github.com/GataNina-Li/GataBot-MD
cd GataBot-MD || { echo "Error al acceder a GataBot-MD"; exit 1; }

# Instalación de módulos
echo -e "\033[01;32mInstalando módulos de Node...\033[0m"
yarn install || npm install

# Inicio del bot
echo -e "\033[01;32mIniciando GataBot-MD...\033[0m"
npm start