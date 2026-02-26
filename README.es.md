# Rollpix_DiscountBadge

> **[English version](README.md)**

**SPONSOR:** [www.rollpix.com](https://www.rollpix.com)

Badge dinámico de porcentaje de descuento para precios de productos en Magento 2. Muestra un badge visual (ej: `21% OFF`) junto al precio tachado en todos los contextos donde Magento renderiza precios con descuento.

## Compatibilidad

| Requisito | Versión |
|---|---|
| Magento | 2.4.7 ~ 2.4.8 |
| PHP | 8.1 ~ 8.3 |

## Instalación

### Vía Composer (recomendado)

```bash
composer require rollpix/module-discount-badge
bin/magento module:enable Rollpix_DiscountBadge
bin/magento setup:upgrade
bin/magento cache:flush
```

### Instalación manual

1. Crear el directorio `app/code/Rollpix/DiscountBadge/`
2. Copiar todos los archivos del repositorio allí
3. Ejecutar:

```bash
bin/magento module:enable Rollpix_DiscountBadge
bin/magento setup:upgrade
bin/magento cache:flush
```

## Configuración en Admin

Ir a **Stores > Configuration > Rollpix > Discount Badge**.

### Configuración General

| Campo | Descripción | Default |
|---|---|---|
| Habilitado | Habilita/deshabilita el badge globalmente | No |
| Descuento Mínimo (%) | Umbral para mostrar el badge (1-99) | 5 |
| Plantilla de Texto | Template con variable `{discount}` | `{discount}% OFF` |
| Posición del Badge | Dónde ubicar el badge (inline, sobre imagen, debajo del precio) | Después del precio anterior |
| Estilo del Badge | Variante visual: relleno, contorno, cápsula, cápsula contorno, solo texto | Relleno |

### Estilos PDP y Listado

Configuración de estilos independiente para la Ficha de Producto y el Listado de Productos:

- Color de Fondo
- Color del Texto
- Tamaño de Fuente (px)
- Radio de Borde (px)
- Padding
- Peso de Fuente

### CSS Personalizado

Campo de texto libre para CSS que se inyecta en el `<head>`, permitiendo overrides por tienda.

## Qué Hace

- Calcula el porcentaje de descuento: `round(((precio_regular - precio_final) / precio_regular) * 100)`
- Muestra un badge junto al precio tachado (old price)
- Funciona en **todos los contextos**: páginas de categoría, ficha de producto, widgets, resultados de búsqueda, bloques de relacionados/upsell/crosssell
- Se actualiza dinámicamente al cambiar opciones en productos configurables
- Respeta special prices, catalog price rules, tier prices — lee lo que Magento ya calculó
- Cinco estilos visuales: Relleno, Contorno, Cápsula, Cápsula con Contorno, Solo Texto
- Siete opciones de posición incluyendo inline con precio y sobre la imagen del producto
- Estilos independientes para PDP vs. listados
- Campo de CSS personalizado para overrides por tienda
- Template de texto completamente traducible por Store View

### Casos Especiales

- `precio_regular == precio_final` → sin badge
- `precio_regular == 0` → sin badge
- Descuento ≤ 0% o ≥ 100% → sin badge
- Descuento < umbral mínimo → sin badge

## Comportamiento Cuando Está Deshabilitado

Cuando el módulo está deshabilitado en admin:

- No se carga JavaScript
- No se inyecta CSS (más allá del CSS base estático que no tiene impacto visual)
- No se renderizan elementos de badge
- Cero overhead de performance — el mixin del priceBox hace return inmediato

## Arquitectura Técnica

### Estructura de Archivos

```
M2-DiscountBadge/                          ← raíz del repo
├── registration.php
├── composer.json
├── etc/
│   ├── module.xml
│   ├── config.xml                         # Valores default
│   ├── acl.xml                            # Recurso ACL
│   └── adminhtml/
│       └── system.xml                     # Configuración admin
├── Model/
│   ├── Config.php                         # Lector de config del sistema
│   └── Config/Source/
│       ├── BadgePosition.php              # Opciones de posición
│       ├── BadgeStyle.php                 # Opciones de estilo
│       └── FontWeight.php                 # Opciones de peso de fuente
├── ViewModel/
│   └── DiscountBadge.php                  # Pasa config a templates
├── view/frontend/
│   ├── layout/
│   │   └── default.xml                    # Inyecta config + CSS
│   ├── templates/
│   │   ├── badge-config.phtml             # Config JSON via x-magento-init
│   │   └── custom-css.phtml               # Inyección de CSS personalizado
│   ├── web/
│   │   ├── js/
│   │   │   ├── badge-renderer.js          # Lógica compartida del badge
│   │   │   ├── discount-badge.js          # Módulo init (escanea priceBoxes)
│   │   │   └── price-box-mixin.js         # Mixin del widget PriceBox
│   │   └── css/
│   │       └── discount-badge.css         # Estilos base estructurales
│   └── requirejs-config.js                # Registro de mixin
├── i18n/
│   ├── en_US.csv
│   └── es_AR.csv
├── README.md
├── README.es.md
└── LICENSE
```

### Cómo Funciona

1. **Lado PHP**: `ViewModel/DiscountBadge.php` lee la config de admin y la expone como bloque JSON `x-magento-init`
2. **Init JS**: `discount-badge.js` almacena la config y escanea widgets priceBox existentes
3. **Mixin**: `price-box-mixin.js` se engancha en `reloadPrice()` para actualizar badges ante cambios de precio
4. **Renderer**: `badge-renderer.js` maneja el cálculo, creación DOM y posicionamiento

### Performance

- 100% del lado del cliente — sin requests adicionales al servidor
- Compatible con Full Page Cache (FPC) y Varnish
- Sin impacto en TTFB
- Todos los bloques son cacheables
- La config no varía por sesión de usuario

### Clases CSS

| Clase | Descripción |
|---|---|
| `.rollpix-discount-badge` | Clase base |
| `.rollpix-discount-badge--pdp` | Contexto ficha de producto |
| `.rollpix-discount-badge--listing` | Contexto listado |
| `.rollpix-discount-badge--inline` | Inline con precio |
| `.rollpix-discount-badge--over-image` | Sobre imagen del producto |
| `.rollpix-discount-badge--below` | Debajo del bloque de precio |
| `.rollpix-discount-badge--filled` | Estilo relleno |
| `.rollpix-discount-badge--outline` | Estilo contorno |
| `.rollpix-discount-badge--pill` | Estilo cápsula |
| `.rollpix-discount-badge--pill-outline` | Estilo cápsula con contorno |
| `.rollpix-discount-badge--text-only` | Estilo solo texto |

## Guía de Testing Manual

1. Habilitar el módulo en **Stores > Configuration > Rollpix > Discount Badge**
2. Crear o buscar un producto con special price o catalog price rule
3. Verificar que el badge aparece en:
   - Página de listado de categoría
   - Ficha de producto
   - Resultados de búsqueda
   - Widgets de relacionados/upsell/crosssell
4. Para un producto configurable, cambiar opciones y verificar que el badge se actualiza
5. Configurar descuento mínimo a un valor mayor al descuento del producto y verificar que el badge desaparece
6. Probar cada opción de posición y estilo
7. Probar inyección de CSS personalizado
8. Deshabilitar el módulo y verificar que no aparecen badges

## Desinstalar

### Vía Composer

```bash
bin/magento module:disable Rollpix_DiscountBadge
composer remove rollpix/module-discount-badge
bin/magento setup:upgrade
bin/magento cache:flush
```

### Manual

```bash
bin/magento module:disable Rollpix_DiscountBadge
rm -rf app/code/Rollpix/DiscountBadge
bin/magento setup:upgrade
bin/magento cache:flush
```

## Licencia

[MIT](LICENSE)
