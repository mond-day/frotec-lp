# Constroi a imagem de producao da LP (saida standalone do Next).
# Uso:
#   .\scripts\build-image.ps1
#   .\scripts\build-image.ps1 -Tag SEU-REGISTRY/frotec-lp:latest
#
# Depois: docker push <a mesma tag>

param(
    [string]$Tag = "frotec-lp:latest"
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
Write-Host "Para publicar no registry (troque SEU-REGISTRY de verdade):"
Write-Host "  docker push $Tag"
