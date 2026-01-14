# Create Microsoft Store Required Assets
# This script generates all required logo sizes from the main icon

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "FamBudget - Store Assets Generator" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$assetsDir = "assets"
$iconPath = Join-Path $assetsDir "icon.png"

# Check if icon exists
if (-not (Test-Path $iconPath)) {
    Write-Host "❌ Error: icon.png not found in $assetsDir" -ForegroundColor Red
    Write-Host "   Please ensure assets/icon.png exists`n" -ForegroundColor Yellow
    exit 1
}

Write-Host "Source icon: $iconPath" -ForegroundColor Green
Write-Host ""
Write-Host "This script will use ImageMagick or PowerShell to resize the icon." -ForegroundColor White
Write-Host "If ImageMagick is not installed, it will create placeholder files.`n" -ForegroundColor Yellow

# Required assets and their sizes
$requiredAssets = @{
    "StoreLogo.png" = 50
    "Square44x44Logo.png" = 44
    "Square150x150Logo.png" = 150
    "Wide310x150Logo.png" = @(310, 150)
}

$hasImageMagick = $false
if (Get-Command magick -ErrorAction SilentlyStop) {
    $hasImageMagick = $true
    Write-Host "✓ ImageMagick found - will resize images`n" -ForegroundColor Green
} else {
    Write-Host "⚠️  ImageMagick not found" -ForegroundColor Yellow
    Write-Host "   Install from: https://imagemagick.org/script/download.php" -ForegroundColor White
    Write-Host "   Or install via: winget install ImageMagick.ImageMagick`n" -ForegroundColor White
    Write-Host "Without ImageMagick, this script will create placeholder files." -ForegroundColor Yellow
    Write-Host "You'll need to manually resize icon.png to the required sizes:`n" -ForegroundColor Yellow
}

foreach ($asset in $requiredAssets.Keys) {
    $assetPath = Join-Path $assetsDir $asset
    $size = $requiredAssets[$asset]
    
    if (Test-Path $assetPath) {
        Write-Host "✓ $asset already exists" -ForegroundColor Green
    } else {
        Write-Host "Creating: $asset..." -ForegroundColor Cyan
        
        if ($hasImageMagick) {
            if ($size -is [Array]) {
                # Wide logo
                $width = $size[0]
                $height = $size[1]
                magick convert $iconPath -resize "${width}x${height}" -gravity center -extent "${width}x${height}" $assetPath
            } else {
                # Square logo
                magick convert $iconPath -resize "${size}x${size}" $assetPath
            }
            Write-Host "  ✓ Created $asset (${size}x${size})" -ForegroundColor Green
        } else {
            # Create placeholder text file with instructions
            $instructions = @"
# Placeholder for $asset

This file should be replaced with a ${size}x${size} pixel PNG image.

To create this asset:
1. Open assets/icon.png in an image editor
2. Resize to ${size}x${size} pixels
3. Save as $asset in the assets/ folder

Online tools:
- https://www.resizepixel.com/
- https://www.iloveimg.com/resize-image

Or use ImageMagick:
winget install ImageMagick.ImageMagick
"@
            Set-Content -Path $assetPath -Value $instructions
            Write-Host "  ⚠️  Placeholder created - please resize icon.png to ${size}x${size}" -ForegroundColor Yellow
        }
    }
}

Write-Host ""
Write-Host "========================================`n" -ForegroundColor Cyan

if (-not $hasImageMagick) {
    Write-Host "📋 Next Steps:" -ForegroundColor Yellow
    Write-Host "1. Install ImageMagick: winget install ImageMagick.ImageMagick" -ForegroundColor White
    Write-Host "2. Re-run this script, OR" -ForegroundColor White
    Write-Host "3. Manually resize icon.png to create:" -ForegroundColor White
    foreach ($asset in $requiredAssets.Keys) {
        $size = $requiredAssets[$asset]
        if ($size -is [Array]) {
            Write-Host "   - $asset ($($size[0])x$($size[1])px)" -ForegroundColor White
        } else {
            Write-Host "   - $asset (${size}x${size}px)" -ForegroundColor White
        }
    }
    Write-Host ""
} else {
    Write-Host "✅ All store assets created successfully!`n" -ForegroundColor Green
    Write-Host "Required assets:" -ForegroundColor Cyan
    foreach ($asset in $requiredAssets.Keys) {
        $assetPath = Join-Path $assetsDir $asset
        if (Test-Path $assetPath) {
            $size = $requiredAssets[$asset]
            if ($size -is [Array]) {
                Write-Host "  ✓ $asset ($($size[0])x$($size[1])px)" -ForegroundColor Green
            } else {
                Write-Host "  ✓ $asset (${size}x${size}px)" -ForegroundColor Green
            }
        }
    }
    Write-Host ""
    Write-Host "You can now build the MSIX package with:" -ForegroundColor Yellow
    Write-Host "  npm run build-msix`n" -ForegroundColor White
}

