# Imagen base más liviana con Node LTS
FROM node:lts-slim

# Evita preguntas durante la instalación
ENV DEBIAN_FRONTEND=noninteractive

# Instala solo lo necesario (sin ffmpeg)
RUN apt-get update && apt-get install -y \
    imagemagick \
    libwebp-dev \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*

# Copiar solo el package.json para instalar dependencias
COPY package.json package-lock.json* ./

# Instala las dependencias de Node.js
RUN npm install --production

# Copia el resto del código del bot
COPY . .

# Exponer puerto si usas un servidor (opcional)
EXPOSE 5000

# Comando que arranca el bot
CMD ["node", "index.js"]
