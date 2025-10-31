; FamBudget Windows Installer Script
; Created with NSIS (Nullsoft Scriptable Install System)

!define APPNAME "FamBudget"
!define COMPANYNAME "FamBudget"
!define DESCRIPTION "Family Budgeting Made Simple"
!define VERSIONMAJOR 1
!define VERSIONMINOR 0
!define VERSIONBUILD 0
!define HELPURL "https://github.com/fambudget/fambudget"
!define UPDATEURL "https://github.com/fambudget/fambudget/releases"
!define ABOUTURL "https://github.com/fambudget/fambudget"
!define INSTALLSIZE 200000

RequestExecutionLevel admin
InstallDir "$PROGRAMFILES\${APPNAME}"
Name "${APPNAME}"
Icon "icon.ico"
outFile "FamBudget-Setup.exe"

!include LogicLib.nsh
!include MUI2.nsh

; Interface Settings
!define MUI_ABORTWARNING
!define MUI_ICON "icon.ico"
!define MUI_UNICON "icon.ico"

; Pages
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "LICENSE"
!insertmacro MUI_PAGE_COMPONENTS
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

; Languages
!insertmacro MUI_LANGUAGE "English"

; Installer sections
Section "FamBudget Application" SecApp
    SectionIn RO
    
    SetOutPath $INSTDIR
    
    ; Copy application files
    File /r "backend"
    File /r "mobile"
    File "README.md"
    File "LICENSE"
    File "package.json"
    
    ; Create desktop shortcuts
    CreateShortCut "$DESKTOP\FamBudget.lnk" "$INSTDIR\FamBudget-Launcher.bat" "" "$INSTDIR\icon.ico"
    CreateShortCut "$DESKTOP\FamBudget Setup.lnk" "$INSTDIR\SETUP-FAMBUDGET.bat" "" "$INSTDIR\icon.ico"
    
    ; Create start menu shortcuts
    CreateDirectory "$SMPROGRAMS\${APPNAME}"
    CreateShortCut "$SMPROGRAMS\${APPNAME}\FamBudget.lnk" "$INSTDIR\FamBudget-Launcher.bat" "" "$INSTDIR\icon.ico"
    CreateShortCut "$SMPROGRAMS\${APPNAME}\FamBudget Setup.lnk" "$INSTDIR\SETUP-FAMBUDGET.bat" "" "$INSTDIR\icon.ico"
    CreateShortCut "$SMPROGRAMS\${APPNAME}\Uninstall.lnk" "$INSTDIR\Uninstall.exe" "" "$INSTDIR\icon.ico"
    
    ; Write uninstaller
    WriteUninstaller "$INSTDIR\Uninstall.exe"
    
    ; Write registry keys
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "DisplayName" "${APPNAME}"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "UninstallString" "$\"$INSTDIR\Uninstall.exe$\""
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "QuietUninstallString" "$\"$INSTDIR\Uninstall.exe$\" /S"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "InstallLocation" "$\"$INSTDIR$\""
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "DisplayIcon" "$\"$INSTDIR\icon.ico$\""
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "Publisher" "${COMPANYNAME}"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "HelpLink" "${HELPURL}"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "URLUpdateInfo" "${UPDATEURL}"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "URLInfoAbout" "${ABOUTURL}"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "DisplayVersion" "${VERSIONMAJOR}.${VERSIONMINOR}.${VERSIONBUILD}"
    WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "VersionMajor" ${VERSIONMAJOR}
    WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "VersionMinor" ${VERSIONMINOR}
    WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "NoModify" 1
    WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "NoRepair" 1
    WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "EstimatedSize" ${INSTALLSIZE}
SectionEnd

Section "Node.js Runtime" SecNode
    ; Download and install Node.js
    inetc::get "https://nodejs.org/dist/v20.10.0/node-v20.10.0-x64.msi" "$TEMP\nodejs-installer.msi"
    Pop $0
    ${If} $0 == "OK"
        ExecWait 'msiexec /i "$TEMP\nodejs-installer.msi" /quiet /norestart'
        Delete "$TEMP\nodejs-installer.msi"
    ${EndIf}
SectionEnd

Section "PostgreSQL Database" SecPostgres
    ; Download and install PostgreSQL
    inetc::get "https://get.enterprisedb.com/postgresql/postgresql-15.5-1-windows-x64.exe" "$TEMP\postgresql-installer.exe"
    Pop $0
    ${If} $0 == "OK"
        ExecWait '"$TEMP\postgresql-installer.exe" --mode unattended --superpassword fambudget123 --servicename postgresql --serviceaccount postgres --servicepassword fambudget123'
        Delete "$TEMP\postgresql-installer.exe"
        
        ; Start PostgreSQL service
        ExecWait 'net start postgresql'
    ${EndIf}
SectionEnd

Section "Expo CLI" SecExpo
    ; Install Expo CLI globally
    ExecWait 'npm install -g @expo/cli'
SectionEnd

Section "Demo Data" SecDemo
    ; Setup demo database
    SetOutPath $INSTDIR\backend
    ExecWait 'npm install'
    ExecWait 'npm run seed'
SectionEnd

; Section descriptions
!insertmacro MUI_FUNCTION_DESCRIPTION_BEGIN
    !insertmacro MUI_DESCRIPTION_TEXT ${SecApp} "Core FamBudget application files"
    !insertmacro MUI_DESCRIPTION_TEXT ${SecNode} "Node.js JavaScript runtime (required)"
    !insertmacro MUI_DESCRIPTION_TEXT ${SecPostgres} "PostgreSQL database server (required)"
    !insertmacro MUI_DESCRIPTION_TEXT ${SecExpo} "Expo CLI for mobile development"
    !insertmacro MUI_DESCRIPTION_TEXT ${SecDemo} "Demo data and sample accounts"
!insertmacro MUI_FUNCTION_DESCRIPTION_END

; Uninstaller section
Section "Uninstall"
    ; Stop services
    ExecWait 'net stop postgresql'
    
    ; Remove files
    RMDir /r "$INSTDIR"
    
    ; Remove shortcuts
    Delete "$DESKTOP\FamBudget.lnk"
    Delete "$DESKTOP\FamBudget Setup.lnk"
    RMDir /r "$SMPROGRAMS\${APPNAME}"
    
    ; Remove registry keys
    DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}"
    
    ; Remove PostgreSQL service
    ExecWait 'sc delete postgresql'
SectionEnd
