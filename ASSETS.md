# Assets necessários — Landing Frotec

Lista para o time preencher. Marque o que já estiver em `public/`.

## Essenciais

| Asset | Path sugerido | Status |
|-------|---------------|--------|
| Logo SVG | `public/frotec-logo.svg` | Pendente (hoje: PNG) |
| Hero video desktop (≤ ~6 MB, H.264, sem áudio) | `public/hero-bg.mp4` | Pendente |
| Hero video mobile (crop vertical, curto) | `public/hero-bg-mobile.mp4` | Pendente |
| Hero poster AVIF/WebP | `public/hero-poster.webp` | Pendente (hoje: SVG) |
| Foto caminhão / estrada | `public/media/truck.jpg` | Pendente |
| Inspeção / oficina | `public/media/inspection.jpg` | Pendente |
| Scanner / diagnóstico | `public/media/scan.jpg` | Pendente |
| Laudo demonstrativo (anonimizado) | `public/media/laudo-demo.jpg` | Pendente |

## Quando o vídeo existir

1. Coloque os arquivos em `public/`.
2. Em `lib/media.ts`, defina `HERO_HAS_VIDEO = true`.

## Futuro

- Testemunhos em vídeo (10–30s)
- Cases autorizados
- Screenshots reais do portal (quando disponível)
- Fotos do time / operação
