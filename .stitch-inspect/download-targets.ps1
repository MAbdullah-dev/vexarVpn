$ErrorActionPreference = "Stop"
$cfg = Get-Content -Raw "C:\Users\MobileDev\Desktop\VexarVpn\.cursor\mcp.json" | ConvertFrom-Json
$key = $cfg.mcpServers.stitch.headers.'X-Goog-Api-Key'
$inspect = "C:\Users\MobileDev\Desktop\VexarVpn\.stitch-inspect"
$assetDir = "C:\Users\MobileDev\Desktop\VexarVpn\design\stitch\screens"
New-Item -ItemType Directory -Force -Path $assetDir | Out-Null

$screens = (Get-Content -Raw (Join-Path $inspect "screens.body") | ConvertFrom-Json).result.structuredContent.screens
$ids = @(
  "3a1c321ae050417b9f2dcab726ef4bdb",
  "8eea3806d504452baff364fc9fb93d30",
  "957e5e2f9067469ea3a080a9ed4991be",
  "c786e310297546af84e86a1d304b8cda",
  "1f38120093fd488a8de941ae6d5b4330",
  "ae22d6c46f9d41fd83cfad44dd0a675c",
  "dd327346d62b4439b87ddfcde10f8695",
  "03c61cfdec87445d881238c1a7e5f050",
  "e142f6a2bbe743babd38ab50f09bcb2f",
  "e7cc3801c70540e388a0e26a0bc840d5",
  "a792648f5fe94e09959512954743fad5"
)

function Save-StitchFile($url, $destJson) {
  curl.exe -sS -L -o $destJson -H "X-Goog-Api-Key: $key" -H "Accept: application/json" $url
  if ($LASTEXITCODE -ne 0) { throw "curl failed for $url" }
}

function Get-VisibleText($html) {
  $clean = [regex]::Replace($html, '(?is)<(script|style)[^>]*>.*?</\1>', ' ')
  $clean = [regex]::Replace($clean, '(?i)<br\s*/?>', "`n")
  $clean = [regex]::Replace($clean, '(?i)</(p|div|h1|h2|h3|h4|li|button|section|header|footer|tr)>', "`n")
  $clean = [regex]::Replace($clean, '<[^>]+>', ' ')
  $clean = [System.Net.WebUtility]::HtmlDecode($clean)
  $lines = $clean -split "`n" | ForEach-Object { ($_ -replace '\s+', ' ').Trim() } | Where-Object { $_ -and $_.Length -gt 1 }
  return ($lines -join "`n")
}

$manifest = @()
foreach ($id in $ids) {
  $s = $screens | Where-Object { $_.name -like "*$id" } | Select-Object -First 1
  if (-not $s) { throw "missing $id" }
  $slug = $id.Substring(0, 8)
  $shotJson = Join-Path $assetDir "$slug.screenshot.json"
  $htmlJson = Join-Path $assetDir "$slug.html.json"
  Write-Output "DOWNLOAD $slug $($s.title)"
  Save-StitchFile $s.screenshot.downloadUrl $shotJson
  Save-StitchFile $s.htmlCode.downloadUrl $htmlJson

  $shot = Get-Content -Raw $shotJson | ConvertFrom-Json
  $pngPath = Join-Path $assetDir "$slug.png"
  [System.IO.File]::WriteAllBytes($pngPath, [Convert]::FromBase64String($shot.dataString))
  Remove-Item $shotJson

  $htmlObj = Get-Content -Raw $htmlJson | ConvertFrom-Json
  $html = $htmlObj.html
  if (-not $html) { $html = $htmlObj.dataString }
  if (-not $html) { $html = Get-Content -Raw $htmlJson }
  $htmlPath = Join-Path $assetDir "$slug.html"
  [System.IO.File]::WriteAllText($htmlPath, $html)
  $textPath = Join-Path $assetDir "$slug.txt"
  $visible = Get-VisibleText $html
  [System.IO.File]::WriteAllText($textPath, $visible)
  Remove-Item $htmlJson

  $manifest += [PSCustomObject]@{
    id = $id
    slug = $slug
    title = $s.title
    width = $s.width
    height = $s.height
    png = $pngPath
    html = $htmlPath
    textChars = $visible.Length
    imageWidth = $shot.imageMetadata.width
    imageHeight = $shot.imageMetadata.height
  }
  Write-Output ("  png={0} text={1}" -f (Get-Item $pngPath).Length, $visible.Length)
}

$manifest | ConvertTo-Json -Depth 4 | Out-File (Join-Path $inspect "download-manifest.json") -Encoding utf8
Write-Output "DONE $($manifest.Count)"
