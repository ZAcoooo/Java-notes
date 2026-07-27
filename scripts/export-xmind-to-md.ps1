param(
    [string]$InputPath = ".",
    [string]$OutputDir = "xmind-md",
    [int]$HeadingLevels = 4,
    [switch]$Recurse,
    [switch]$Merge,
    [string]$MergedFileName = "all-xmind.md"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.IO.Compression.FileSystem

function Get-TopicTitle {
    param(
        [Parameter(Mandatory = $true)]
        [object]$Topic
    )

    $title = ""

    if ($null -ne $Topic.PSObject.Properties["title"] -and $Topic.title) {
        $title = [string]$Topic.title
    } elseif ($null -ne $Topic.PSObject.Properties["attributedTitle"] -and $Topic.attributedTitle) {
        $parts = foreach ($item in $Topic.attributedTitle) {
            if ($null -ne $item.PSObject.Properties["text"]) {
                [string]$item.text
            }
        }
        $title = ($parts -join "")
    }

    $title = $title -replace "\r\n?", "`n"
    $title = ($title -split "`n" | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne "" }) -join " "
    return $title.Trim()
}

function Get-ChildTopics {
    param(
        [Parameter(Mandatory = $true)]
        [object]$Topic
    )

    if ($null -eq $Topic.PSObject.Properties["children"]) {
        return @()
    }

    $children = $Topic.children
    if ($null -eq $children) {
        return @()
    }

    $result = New-Object System.Collections.Generic.List[object]

    foreach ($propertyName in @("attached", "detached")) {
        if ($null -ne $children.PSObject.Properties[$propertyName] -and $children.$propertyName) {
            foreach ($child in $children.$propertyName) {
                $result.Add($child)
            }
        }
    }

    return $result
}

function Add-TopicMarkdown {
    param(
        [Parameter(Mandatory = $true)]
        [object]$Topic,
        [Parameter(Mandatory = $true)]
        [object]$Lines,
        [int]$Depth = 1,
        [int]$HeadingLevels = 4
    )

    $title = Get-TopicTitle -Topic $Topic
    if ([string]::IsNullOrWhiteSpace($title)) {
        return
    }

    if ($Depth -le $HeadingLevels) {
        $prefix = "#" * $Depth
        $Lines.Add("$prefix $title")
        $Lines.Add("")
    } else {
        $indentLevel = $Depth - $HeadingLevels - 1
        $indent = "  " * $indentLevel
        $Lines.Add("$indent- $title")
    }

    $children = Get-ChildTopics -Topic $Topic
    foreach ($child in $children) {
        Add-TopicMarkdown -Topic $child -Lines $Lines -Depth ($Depth + 1) -HeadingLevels $HeadingLevels
    }
}

function Read-XMindContentJson {
    param(
        [Parameter(Mandatory = $true)]
        [string]$FilePath
    )

    $zip = [System.IO.Compression.ZipFile]::OpenRead($FilePath)
    try {
        $entry = $zip.GetEntry("content.json")
        if ($null -eq $entry) {
            throw "content.json was not found in '$FilePath'. This script currently supports XMind files with content.json."
        }

        $stream = $entry.Open()
        $reader = New-Object System.IO.StreamReader($stream, [System.Text.Encoding]::UTF8)
        try {
            return $reader.ReadToEnd()
        } finally {
            $reader.Dispose()
            $stream.Dispose()
        }
    } finally {
        $zip.Dispose()
    }
}

function Convert-XMindFileToMarkdown {
    param(
        [Parameter(Mandatory = $true)]
        [string]$FilePath,
        [int]$HeadingLevels = 4
    )

    $jsonText = Read-XMindContentJson -FilePath $FilePath
    $sheets = $jsonText | ConvertFrom-Json

    $lines = New-Object System.Collections.Generic.List[string]
    $sheetCount = @($sheets).Count

    if ($sheetCount -gt 1) {
        $fileTitle = [System.IO.Path]::GetFileNameWithoutExtension($FilePath)
        $lines.Add("# $fileTitle")
        $lines.Add("")
    }

    foreach ($sheet in @($sheets)) {
        if ($null -eq $sheet.rootTopic) {
            continue
        }

        $startDepth = 1
        if ($sheetCount -gt 1) {
            $sheetTitle = Get-TopicTitle -Topic $sheet.rootTopic
            if ([string]::IsNullOrWhiteSpace($sheetTitle)) {
                $sheetTitle = "Untitled Sheet"
            }

            $lines.Add("## Sheet: $sheetTitle")
            $lines.Add("")
            $startDepth = 3
        }

        Add-TopicMarkdown -Topic $sheet.rootTopic -Lines $lines -Depth $startDepth -HeadingLevels $HeadingLevels
    }

    return ($lines -join [Environment]::NewLine).TrimEnd()
}

$resolvedInputPath = Resolve-Path -LiteralPath $InputPath
$resolvedOutputDir = if ([System.IO.Path]::IsPathRooted($OutputDir)) {
    $OutputDir
} else {
    Join-Path -Path $resolvedInputPath.Path -ChildPath $OutputDir
}

if (-not (Test-Path -LiteralPath $resolvedOutputDir)) {
    New-Item -ItemType Directory -Path $resolvedOutputDir | Out-Null
}

$item = Get-Item -LiteralPath $resolvedInputPath
$files = @()

if ($item.PSIsContainer) {
    $searchOptions = @{
        LiteralPath = $item.FullName
        Filter      = "*.xmind"
        File        = $true
    }

    if ($Recurse) {
        $searchOptions["Recurse"] = $true
    }

    $files = @(Get-ChildItem @searchOptions | Sort-Object FullName)
} else {
    if ($item.Extension -ne ".xmind") {
        throw "Input file must be a .xmind file."
    }
    $files = @($item)
}

if ($files.Count -eq 0) {
    throw "No .xmind files were found."
}

$mergedDocuments = New-Object System.Collections.Generic.List[string]

foreach ($file in $files) {
    $markdown = Convert-XMindFileToMarkdown -FilePath $file.FullName -HeadingLevels $HeadingLevels
    $outputName = ([System.IO.Path]::GetFileNameWithoutExtension($file.Name)) + ".md"
    $outputPath = Join-Path -Path $resolvedOutputDir -ChildPath $outputName

    Set-Content -LiteralPath $outputPath -Value $markdown -Encoding UTF8
    Write-Host "Exported: $($file.Name) -> $outputPath"

    if ($Merge) {
        $mergedDocuments.Add($markdown)
    }
}

if ($Merge) {
    $mergedPath = Join-Path -Path $resolvedOutputDir -ChildPath $MergedFileName
    $mergedContent = ($mergedDocuments -join ([Environment]::NewLine + [Environment]::NewLine + "---" + [Environment]::NewLine + [Environment]::NewLine)).TrimEnd()
    Set-Content -LiteralPath $mergedPath -Value $mergedContent -Encoding UTF8
    Write-Host "Merged file created: $mergedPath"
}
