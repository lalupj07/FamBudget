param(
  [string]$InstallerPath = "C:\Users\lalup\OneDrive\Desktop\GenXis Inc\FamBudget\desktop-app\dist-v3.5.1\FamBudget-3.5.1-x64.exe"
)

Write-Output "=== Installer Verification ==="
if (!(Test-Path $InstallerPath)) {
  Write-Error "Installer not found: $InstallerPath"
  exit 1
}

$item = Get-Item $InstallerPath
[pscustomobject]@{
  FullName      = $item.FullName
  SizeMB        = [math]::Round($item.Length / 1MB, 2)
  LastWriteTime = $item.LastWriteTime
} | Format-List

Write-Output ""
Write-Output "=== Closing running FamBudget/Electron processes (if any) ==="
$procs = Get-Process -ErrorAction SilentlyContinue | Where-Object {
  $_.ProcessName -eq "electron" -or $_.MainWindowTitle -like "*FamBudget*"
}
if ($procs) {
  $procs | Select-Object ProcessName, Id, MainWindowTitle | Format-Table -AutoSize
  $procs | Stop-Process -Force -ErrorAction SilentlyContinue
  Start-Sleep -Seconds 2
  Write-Output "Closed."
} else {
  Write-Output "None found."
}

Write-Output ""
Write-Output "=== Launching Installer UI ==="
Start-Process -FilePath $InstallerPath
Write-Output "Installer started. Complete the wizard, then confirm it launches."

