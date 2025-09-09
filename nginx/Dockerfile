# Usa la imagen base oficial de nginx
FROM nginx:latest

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /etc/nginx/conf.d

# Expone el puerto 80 para las conexiones extrañas http = 80, https = 443
EXPOSE 80

# especifica el comando que se ejecutara cuando se inicie el nginx
CMD [ "nginx", "-g", "daemon off;" ]
