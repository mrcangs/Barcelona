# Değişiklik varsa otomatik commit + push yapar.
# Claude Code Stop hook'u her yanıt sonunda çalıştırır; elle de çalıştırılabilir:
#   powershell -ExecutionPolicy Bypass -File scripts/auto-commit.ps1
$ErrorActionPreference = 'Continue'
$root = Split-Path -Parent $PSScriptRoot
$log = Join-Path $root '.auto-commit.log'

function Log($msg) {
  $line = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')  $msg"
  Add-Content -Path $log -Value $line -Encoding UTF8
}

# git'i bul (kurulumdan sonra PATH henüz yenilenmemiş olabilir)
$git = (Get-Command git -ErrorAction SilentlyContinue).Source
if (-not $git) {
  foreach ($p in @("$env:ProgramFiles\Git\cmd\git.exe", "$env:LOCALAPPDATA\Programs\Git\cmd\git.exe")) {
    if (Test-Path $p) { $git = $p; break }
  }
}
if (-not $git) { Log 'git bulunamadı, atlandı'; exit 0 }
if (-not (Test-Path (Join-Path $root '.git'))) { Log 'git deposu yok, atlandı'; exit 0 }

$env:GIT_TERMINAL_PROMPT = '0'
Set-Location $root

$status = & $git status --porcelain
if (-not $status) { exit 0 }

& $git add -A

# Gizli davet anahtarı commit'e sızmasın
$keyFile = Join-Path $root '.trip-key'
if (Test-Path $keyFile) {
  $secret = (Get-Content $keyFile -Raw).Trim()
  if ($secret) {
    $diff = & $git diff --cached
    if ($diff -match [regex]::Escape($secret)) {
      & $git reset -q
      Log 'İPTAL: staged değişikliklerde davet anahtarı bulundu'
      Write-Output '{"systemMessage": "auto-commit iptal: davet anahtarı bir dosyaya yazılmış, commit edilmedi."}'
      exit 0
    }
  }
}

$files = (& $git diff --cached --name-only) -join ', '
if (-not $files) { exit 0 }
if ($files.Length -gt 120) { $files = $files.Substring(0, 117) + '...' }
$msg = "auto: $files ($(Get-Date -Format 'yyyy-MM-dd HH:mm'))"

& $git commit -q -m $msg
if ($LASTEXITCODE -ne 0) { Log "commit başarısız: $msg"; exit 0 }
Log "commit: $msg"

$remote = & $git remote
if ($remote -contains 'origin') {
  & $git push -q origin HEAD 2>$null
  if ($LASTEXITCODE -eq 0) { Log 'push: ok' } else { Log 'push başarısız (ağ/kimlik?)' }
}
exit 0
