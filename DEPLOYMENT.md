# Guía de Deployment - AI Woo Uploader

Esta guía te ayudará a desplegar la aplicación en un VPS y configurar un dominio personalizado.

## 📋 Requisitos Previos

- VPS con Ubuntu 20.04+ o Debian 11+
- Acceso SSH al servidor
- Dominio registrado
- Acceso al panel de DNS del dominio

## 🚀 Deployment Rápido

### 1. Conectar al VPS

```bash
ssh usuario@IP_DEL_VPS
```

### 2. Ejecutar Script de Deployment

```bash
# Descargar script
wget https://raw.githubusercontent.com/JoseMas68/ai-woo-uploader/main/deploy.sh

# Dar permisos de ejecución
chmod +x deploy.sh

# Ejecutar
./deploy.sh
```

El script instalará automáticamente:
- Node.js 18
- PM2 (gestor de procesos)
- Nginx (servidor web)
- Git
- La aplicación

## ⚙️ Configuración Manual (Paso a Paso)

### 1. Instalar Dependencias

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar PM2
sudo npm install -g pm2

# Instalar Nginx
sudo apt install -y nginx

# Instalar Git
sudo apt install -y git
```

### 2. Clonar Repositorio

```bash
cd /var/www
sudo git clone https://github.com/JoseMas68/ai-woo-uploader.git
cd ai-woo-uploader
sudo npm install
```

### 3. Build de Producción

```bash
sudo npm run build
```

### 4. Iniciar con PM2

```bash
# Iniciar aplicación
sudo pm2 start ecosystem.config.js

# Configurar inicio automático
sudo pm2 startup
sudo pm2 save

# Ver estado
sudo pm2 status
sudo pm2 logs ai-woo-uploader
```

### 5. Configurar Nginx

```bash
# Copiar configuración
sudo cp nginx.conf /etc/nginx/sites-available/ai-woo-uploader

# Editar y reemplazar "tudominio.com" con tu dominio real
sudo nano /etc/nginx/sites-available/ai-woo-uploader

# Crear enlace simbólico
sudo ln -s /etc/nginx/sites-available/ai-woo-uploader /etc/nginx/sites-enabled/

# Eliminar configuración por defecto (opcional)
sudo rm /etc/nginx/sites-enabled/default

# Verificar configuración
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

### 6. Configurar DNS

En el panel de tu proveedor de dominio (GoDaddy, Namecheap, Cloudflare, etc.):

1. Agregar registro A:
   ```
   Tipo: A
   Nombre: @
   Valor: IP_DE_TU_VPS
   TTL: 3600
   ```

2. Agregar registro A para www:
   ```
   Tipo: A
   Nombre: www
   Valor: IP_DE_TU_VPS
   TTL: 3600
   ```

**Nota**: Los cambios de DNS pueden tardar hasta 24 horas en propagarse.

### 7. Configurar SSL (HTTPS)

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtener certificado SSL (reemplazar con tu dominio)
sudo certbot --nginx -d tudominio.com -d www.tudominio.com

# Seguir las instrucciones en pantalla
# Certbot configurará automáticamente Nginx para HTTPS

# Verificar renovación automática
sudo certbot renew --dry-run
```

## 🔄 Actualizar la Aplicación

```bash
cd /var/www/ai-woo-uploader
sudo git pull origin main
sudo npm install
sudo npm run build
sudo pm2 restart ai-woo-uploader
```

## 🛠️ Comandos Útiles

### PM2
```bash
# Ver logs en tiempo real
sudo pm2 logs ai-woo-uploader

# Reiniciar aplicación
sudo pm2 restart ai-woo-uploader

# Detener aplicación
sudo pm2 stop ai-woo-uploader

# Ver estado
sudo pm2 status

# Ver uso de recursos
sudo pm2 monit
```

### Nginx
```bash
# Verificar configuración
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx

# Ver logs
sudo tail -f /var/log/nginx/ai-woo-uploader-access.log
sudo tail -f /var/log/nginx/ai-woo-uploader-error.log
```

### Sistema
```bash
# Ver uso de recursos
htop

# Ver espacio en disco
df -h

# Ver memoria
free -h
```

## 🔒 Seguridad

### Firewall (UFW)

```bash
# Habilitar UFW
sudo ufw enable

# Permitir SSH
sudo ufw allow 22/tcp

# Permitir HTTP y HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Ver estado
sudo ufw status
```

### Fail2Ban (Protección contra ataques)

```bash
# Instalar
sudo apt install fail2ban -y

# Iniciar servicio
sudo systemctl start fail2ban
sudo systemctl enable fail2ban
```

## 🐛 Troubleshooting

### La aplicación no inicia
```bash
# Ver logs de PM2
sudo pm2 logs ai-woo-uploader --lines 100

# Verificar que el puerto 3000 esté libre
sudo lsof -i :3000
```

### Nginx muestra error 502
```bash
# Verificar que la aplicación esté corriendo
sudo pm2 status

# Verificar logs de Nginx
sudo tail -f /var/log/nginx/error.log
```

### El dominio no resuelve
```bash
# Verificar DNS
nslookup tudominio.com

# Verificar propagación DNS
# Usar: https://dnschecker.org
```

## 📞 Soporte

Si tienes problemas, verifica:
1. Logs de PM2: `sudo pm2 logs`
2. Logs de Nginx: `sudo tail -f /var/log/nginx/error.log`
3. Estado del sistema: `sudo systemctl status nginx`

## 🎉 ¡Listo!

Tu aplicación debería estar accesible en:
- http://tudominio.com (redirige a HTTPS)
- https://tudominio.com (con SSL)
