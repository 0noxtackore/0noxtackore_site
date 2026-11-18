Add-Type -AssemblyName System.Drawing

$source = "public/sites/0noxtackore/favicon.png"
$output = "src/app/favicon.ico"
$sizes = @(16, 32, 48, 64, 128, 256)

$original = [System.Drawing.Image]::FromFile($source)
$images = @()

foreach ($size in $sizes) {
  $bitmap = New-Object System.Drawing.Bitmap($size, $size)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $graphics.DrawImage($original, 0, 0, $size, $size)
  $graphics.Dispose()

  $stream = New-Object System.IO.MemoryStream
  $bitmap.Save($stream, [System.Drawing.Imaging.ImageFormat]::Png)
  $bitmap.Dispose()

  $images += [pscustomobject]@{
    Size   = $size
    Bytes  = $stream.ToArray()
    Offset = 0
  }
  $stream.Dispose()
}
$original.Dispose()

$offset = 6 + (16 * $images.Count)
foreach ($image in $images) {
  $image.Offset = $offset
  $offset += $image.Bytes.Length
}

$stream = New-Object System.IO.MemoryStream
$writer = New-Object System.IO.BinaryWriter($stream)
$writer.Write([uint16]0)
$writer.Write([uint16]1)
$writer.Write([uint16]$images.Count)

foreach ($image in $images) {
  $writer.Write([byte]$(if ($image.Size -ge 256) { 0 } else { $image.Size }))
  $writer.Write([byte]$(if ($image.Size -ge 256) { 0 } else { $image.Size }))
  $writer.Write([byte]0)
  $writer.Write([byte]0)
  $writer.Write([uint16]1)
  $writer.Write([uint16]32)
  $writer.Write([uint32]$image.Bytes.Length)
  $writer.Write([uint32]$image.Offset)
}

foreach ($image in $images) {
  $writer.Write($image.Bytes)
}

$writer.Flush()
[System.IO.File]::WriteAllBytes($output, $stream.ToArray())
$writer.Dispose()
$stream.Dispose()

Write-Output "Wrote $output"
Get-Item $output | ForEach-Object { Write-Output ("{0} bytes" -f $_.Length) }
