#!/bin/bash

# AI Woo Uploader - Deployment Script (Safe for existing n8n installation)
# Este script NO reinstala dependencias existentes

set -e

echo "🚀 Iniciando deployment de AI Woo Uploader..."
echo "⚠️  Este script es seguro para servidores con n8n u otras apps"

# Variables
APP_NAME="ai-woo-uploader"
APP_DIR="/var/www/$APP_NAME"
REPO_URL="https://github.com/JoseMas68/ai-woo-uploader.git"

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}📊 Verificando estado del servidor...${NC}"

# Verificar Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✅ Node.js ya instalado: $NODE_VERSION${NC}"
else
    echo -e "${YELLOW}📥 Instalando Node.js 18...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt install -y nodejs
fi

# Verificar PM2
if command -v pm2 &> /dev/null; then
    echo -e "${GREEN}✅ PM2 ya instalado${NC}"
    echo -e "${BLUE}Aplicaciones corriendo en PM2:${NC}"
    pm2 list
else
    echo -e "${YELLOW}📥 Instalando PM2...${NC}"
    sudo npm install -g pm2
fi

# Verificar Nginx
if command -v nginx &> /dev/null; then
    echo -e "${GREEN}✅ Nginx ya instalado${NC}"
else
    echo -e "${YELLOW}📥 Instalando Nginx...${NC}"
    sudo apt install -y nginx
fi

# Verificar Git
if ! command -v git &> /dev/null; then
    echo -e "${YELLOW}📥 Instalando Git...${NC}"
    sudo apt install -y git
fi

echo -e "${BLUE}📂 Configurando aplicación...${NC}"

# Crear directorio
sudo mkdir -p /var/www
cd /var/www

# Clonar o actualizar
if [ -d "$APP_DIR" ]; then
    echo -e "${YELLOW}🔄 Actualizando repositorio...${NC}"
    cd $APP_DIR
    sudo git pull origin main
else
    echo -e "${YELLOW}📥 Clonando repositorio...${NC}"
    sudo git clone $REPO_URL
    cd $APP_DIR
fi

# Instalar dependencias
echo -e "${YELLOW}📦 Instalando dependencias...${NC}"
sudo npm install

# Build
echo -e "${YELLOW}🔨 Compilando aplicación...${NC}"
sudo npm run build

# Configurar PM2
echo -e "${YELLOW}⚙️  Configurando PM2...${NC}"

# Verificar si ya existe
if pm2 list | grep -q "$APP_NAME"; then
    echo -e "${YELLOW}Reiniciando aplicación existente...${NC}"
    pm2 restart $APP_NAME
else
    echo -e "${YELLOW}Iniciando nueva aplicación...${NC}"
    pm2 start npm --name "$APP_NAME" -- start
    pm2 save
fi

echo -e "${GREEN}✅ Aplicación desplegada!${NC}"
echo ""
echo -e "${BLUE}📊 Estado actual de PM2:${NC}"
pm2 list

echo ""
echo -e "${GREEN}🎉 Deployment completado!${NC}"
echo ""
echo -e "${YELLOW}📝 Próximos pasos:${NC}"
echo "1. Configurar Nginx para múltiples aplicaciones"
echo "2. Configurar DNS (subdominios o rutas)"
echo "3. Configurar SSL con certbot"
echo ""
echo -e "${BLUE}Puertos en uso:${NC}"
sudo netstat -tulpn | grep LISTEN | grep -E ':(3000|5678|80|443)'
