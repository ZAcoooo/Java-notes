# 下载便携版 Maven 到项目 tools 目录（仅需运行一次）
$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$toolsDir = Join-Path $projectRoot "tools"
$mavenDir = Join-Path $toolsDir "apache-maven"
$mavenZip = Join-Path $toolsDir "maven.zip"

if (Test-Path (Join-Path $mavenDir "bin\mvn.cmd")) {
    Write-Host "Maven 已存在: $mavenDir"
    exit 0
}

New-Item -ItemType Directory -Force -Path $toolsDir | Out-Null
$url = "https://archive.apache.org/dist/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.zip"
Write-Host "正在下载 Maven 3.9.9 ..."
Invoke-WebRequest -Uri $url -OutFile $mavenZip
Expand-Archive -Path $mavenZip -DestinationPath $toolsDir -Force
Rename-Item (Join-Path $toolsDir "apache-maven-3.9.6") "apache-maven" -ErrorAction SilentlyContinue
Remove-Item $mavenZip
Write-Host "Maven 安装完成: $mavenDir"
