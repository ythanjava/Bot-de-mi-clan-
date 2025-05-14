FROM fedora:37

# Evitar el uso de sudo dentro del contenedor y actualizar el sistema
RUN dnf -y update && \
    dnf install -y \
        https://mirrors.rpmfusion.org/free/fedora/rpmfusion-free-release-$(rpm -E %fedora).noarch.rpm \
        https://mirrors.rpmfusion.org/nonfree/fedora/rpmfusion-nonfree-release-$(rpm -E %fedora).noarch.rpm && \
    dnf install -y \
        git \
        ffmpeg \
        ImageMagick \
        nodejs \
        yarnpkg \
        libwebp && \
    dnf clean all

# Clonar el repositorio
WORKDIR /root
RUN git clone https://github.com/GataNina-Li/GataBot-MD.git

# Definir el directorio de trabajo del bot
WORKDIR /root/GataBot-MD

# Instalar dependencias
RUN yarn install

# Exponer el puerto si es necesario (ajústalo si tu bot usa alguno)
EXPOSE 3000

# Comando para ejecutar el bot
CMD ["node", "index.js"]