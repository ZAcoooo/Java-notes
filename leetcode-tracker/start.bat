@echo off
chcp 65001 >nul
cd /d "%~dp0"

rem 使用 JDK 17+（Spring Boot 3 需要）
if exist "C:\Program Files\Java\jdk-22" (
    set "JAVA_HOME=C:\Program Files\Java\jdk-22"
) else if exist "C:\Program Files\Java\jdk-17" (
    set "JAVA_HOME=C:\Program Files\Java\jdk-17"
)
set "PATH=%JAVA_HOME%\bin;%PATH%"
set JAVA_OPTS=-Xms64m -Xmx256m -Duser.timezone=Asia/Shanghai

if exist "tools\apache-maven\bin\mvn.cmd" (
    call tools\apache-maven\bin\mvn.cmd spring-boot:run
    goto :end
)

where mvn >nul 2>&1
if %errorlevel%==0 (
    mvn spring-boot:run
    goto :end
)

echo [错误] 未找到 Maven，请先运行 setup-maven.ps1
pause

:end
