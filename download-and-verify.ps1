param([switch]$VerifyOnly)
$ErrorActionPreference = 'Stop'
$Base = 'https://raw.githubusercontent.com/ksgfin8-cyber/yellow/refs/heads/transfer/p01-c2-evidence-20261117/'
$Files = @(
    @{ Name = 'P01-E3-audited-evidence.tar.gz'; Bytes = 36085889; SHA256 = '8a1df2ac58fa2069afa4de52368097d79859b59e4b784e99a72966fa5690b7c7' },
    @{ Name = 'P01-E3-audited-evidence.tar.gz.sha256'; Bytes = 97; SHA256 = 'da7bbb55d4aaea5eb7f8de641781a28d78012e3212a9a983ce649a41e7a7e6c1' },
    @{ Name = 'P01-E4-scientific-validation.tar.gz'; Bytes = 309971; SHA256 = '47083b27d5875126ac3086fe8887adfdc813567673dec2e904a4e91bcf29db91' },
    @{ Name = 'P01-E4-scientific-validation.tar.gz.sha256'; Bytes = 102; SHA256 = '53451288e8dac7eb58334c1117649308eaef704e7bb30cab3121bee5c3bfdd7b' }
)
foreach ($Entry in $Files) {
    $Target = Join-Path (Get-Location) $Entry.Name
    if (-not $VerifyOnly) {
        if (Test-Path -LiteralPath $Target) { throw "El archivo ya existe; use -VerifyOnly para comprobarlo: $Target" }
        Invoke-WebRequest -UseBasicParsing -Uri ($Base + $Entry.Name) -OutFile $Target
    }
    if ((Get-Item -LiteralPath $Target).Length -ne $Entry.Bytes) { throw "Tamaño incorrecto: $Target" }
    $Hash = (Get-FileHash -LiteralPath $Target -Algorithm SHA256).Hash.ToLowerInvariant()
    if ($Hash -ne $Entry.SHA256) { throw "SHA-256 incorrecto: $Target" }
    Write-Output ("OK {0} {1}" -f $Entry.Name, $Hash)
}
Write-Output 'Recepción y hashes verificados localmente. Confirme ambos paquetes en el chat; C2 no se actualiza automáticamente.'
