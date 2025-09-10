# Hotel Booking Manager

Una aplicación web desarrollada con **React + TypeScript + Vite**, que permite gestionar habitaciones de diferentes hoteles simulando integraciones con proveedores como *Expedia*, *Hotelbeds*, *HotelUnico* e internos.

## 🚀 Características principales

- Gestión de habitaciones por proveedor (Interno, Expedia, Hotelbeds, HotelUnico)
- Visualización y filtrado de hoteles
- Simulación de API REST usando `json-server`
- Arquitectura escalable basada en servicios

## 📁 Estructura del proyecto


## ⚙️ Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/tu-repo.git
cd tu-repo
```

2. Instalar dependencias
```bash
npm install
```

3. Inicia el servidor mock
```bash
npm run mock
```

4. Inicia la aplicación
```bash
npm run dev
```

5. Scripts disponibles
```bash
npm run dev       # Ejecuta la app en modo desarrollo
npm run build     # Compila la app para producción
npm run preview   # Visualiza el build
npm run mock      # Inicia json-server con datos en src/mock/db.json
```

## Tecnologías usadas
- React + TypeScript
- Vite
- Zustand
- Tailwind CSS
- json-server

## Datos simulados
- Se utilizan datos simulados desde src/mock/db.json y rutas personalizadas desde src/mock/routes.json. Esto permite simular peticiones reales de backend sin conexión externa.

# Despliege en producción 
## Ejecutamos
npm run build:prod
## Existen tres variables de entorno donde definimos 
- VITE_API_BASE_URL=
  ### Definimos el api al que nos debemos conectar para obtener la lista de cuartos
- VITE_API_HOTEL_SEARCH=
  ### Definimos la url del recurso donde debemos buscar los hoteles
- VITE_API_HOTEL_SEARCH_TOKEN=
  ### Definimos el token se usamos para conectarnos recurso que nos proporciona los hoteles


# Docker 

## Acceder al contenedor de frontend
docker exec -it frontend sh

## chequeo de variables de entorno
echo $VITE_API_BASE_URL