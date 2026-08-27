# Assets necessários — Landing Frotec

Lista para o time preencher. Marque o que já estiver em `public/`.

## Essenciais

| Asset | Path sugerido | Status |
|-------|---------------|--------|
| Logo | `public/frotec-logo.png` | OK |
| Hero poster | `public/hero-poster.svg` | OK (atmosfera cinematográfica; trocar por foto/vídeo quando houver) |
| Hero video desktop | `public/media/hero/hero-desktop.mp4` | Pendente |
| Hero video mobile | `public/media/hero/hero-mobile.mp4` | Pendente |
| Coverage route video | `public/media/coverage/route.mp4` | Pendente — fallback = Leaflet |
| Portal desktop mockup | `public/mockups/portal-desktop.webp` (+ `.png` fallback) | Gerar via `npm run capture:mockups` |
| Portal mobile mockup | `public/mockups/portal-mobile.webp` | Gerar via `npm run capture:mockups` |

## Quando o vídeo existir

1. Coloque os arquivos nos paths acima.
2. Em `lib/media.ts`, defina `HERO_HAS_VIDEO = true` e/ou `COVERAGE_HAS_VIDEO = true`.
3. O `<video>` usa `onError` como fallback — sem HEAD request.
4. Sem vídeo de cobertura, a seção `#cobertura` mostra o mapa Leaflet legível (não SVG cartoon).

## Captura de mockups

```bash
npm run capture:mockups
# opcional: MOCKUP_SOURCE_URL=file:///caminho/frotec_apresentacao.html
```

Não roda no build de produção.

## Futuro

- Foto/vídeo real do corredor (AVIF/MP4)
- Depoimentos autorizados (não inventar)
- Screenshots do portal em produção (quando existir)
