# Constroi a imagem de producao da LP (saida standalone do Next).
# Em producao o GitHub Actions ja publica em ghcr.io/mond-day/frotec-lp.
# Este script e so para testar o Dockerfile na maquina local.
#
# Uso:
#   .\scripts\build-image.ps1
#   .\scripts\build-image.ps1 -Tag ghcr.io/mond-day/frotec-lp:latest

param(
    [string]$Tag = "ghcr.io/mond-day/frotec-lp:latest"
)

Set-Location (Join-Path $PSScriptRoot "..")

Write-Host "Construindo imagem $Tag ..."
docker build -t $Tag .
if ($LASTEXITCODE -ne 0) {
    Write-Error "docker build falhou (codigo $LASTEXITCODE)."
    exit $LASTEXITCODE
}

Write-Host ""
Write-Host "Imagem pronta: $Tag"
Write-Host "Push na main e o CI que publica no GHCR. Push local so se voce souber o que esta fazendo:"
Write-Host "  docker push $Tag"
