#!/bin/bash

# AI Woo Uploader - Deployment Script
# Este script automatiza el deployment en un VPS Ubuntu/Debian

set -e

echo "🚀 Iniciando deployment de AI Woo Uploader..."

# Variables
APP_NAME="ai-woo-uploader"
APP_DIR="/var/www/$APP_NAME"
REPO_URL="https://github.com/JoseMas68/ai-woo-uploader.git"
NODE_VERSION="18"

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📦 Instalando dependencias del sistema...${NC}"

# Actualizar sistema
sudo apt update
sudo apt upgrade -y

# Instalar Node.js si no está instalado
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}📥 Instalando Node.js ${NODE_VERSION}...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
    sudo apt install -y nodejs
fi

# Instalar PM2 si no está instalado
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}📥 Instalando PM2...${NC}"
    sudo npm install -g pm2
fi

# Instalar Nginx si no está instalado
if ! command -v nginx &> /dev/null; then
    echo -e "${YELLOW}📥 Instalando Nginx...${NC}"
    sudo apt install -y nginx
fi

# Instalar Git si no está instalado
if ! command -v git &> /dev/null; then
    echo -e "${YELLOW}📥 Instalando Git...${NC}"
    sudo apt install -y git
fi

echo -e "${GREEN}✅ Dependencias instaladas${NC}"

# Crear directorio de la aplicación
echo -e "${YELLOW}📂 Configurando directorio de la aplicación...${NC}"
sudo mkdir -p /var/www
cd /var/www

# Clonar o actualizar repositorio
if [ -d "$APP_DIR" ]; then
    echo -e "${YELLOW}🔄 Actualizando repositorio existente...${NC}"
    cd $APP_DIR
    sudo git pull origin main
else
    echo -e "${YELLOW}📥 Clonando repositorio...${NC}"
    sudo git clone $REPO_URL
    cd $APP_DIR
fi

# Instalar dependencias de Node
echo -e "${YELLOW}📦 Instalando dependencias de Node.js...${NC}"
sudo npm install

# Build de la aplicación
echo -e "${YELLOW}🔨 Compilando aplicación...${NC}"
sudo npm run build

# Configurar PM2
echo -e "${YELLOW}⚙️  Configurando PM2...${NC}"
sudo pm2 delete $APP_NAME 2>/dev/null || true
sudo pm2 start npm --name "$APP_NAME" -- start
sudo pm2 startup
sudo pm2 save

echo -e "${GREEN}✅ Aplicación desplegada y corriendo en PM2${NC}"

# Mostrar estado
sudo pm2 status

echo -e "${GREEN}🎉 Deployment completado!${NC}"
echo -e "${YELLOW}📝 Próximos pasos:${NC}"
echo "1. Configurar Nginx (ver nginx.conf)"
echo "2. Configurar SSL con certbot"
echo "3. Configurar DNS del dominio"
echo ""
echo -e "${GREEN}La aplicación está corriendo en http://localhost:3000${NC}"
