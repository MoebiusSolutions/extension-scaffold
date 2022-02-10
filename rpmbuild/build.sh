#!/bin/bash

# Stop on any failure
set -e

# Define Variables
# --------
# Name and location of this script file
SCRIPT_FILE=$(basename "$0")
SCRIPT_DIR=$(dirname `readlink -f "$0"`)
VERSION_FILE="${SCRIPT_DIR}/../es-runtime/package.json"
if [[ ! -f "${VERSION_FILE}" ]]; then
  echo "" 1>&2
  echo "Missing Version file: '${VERSION_FILE}'." 1>&2
  echo "" 1>&2
  exit 1
fi
APP_NAME=extension-scaffold
INSTALL_FOLDER=/opt/scaffold/
APP_VERSION=` grep '"version"' ${VERSION_FILE}  |tr -d '\"version:, '`
# Drop dashes
APP_VERSION_RPM="${APP_VERSION//-/}"
APP_INSTALL_DIR="${INSTALL_FOLDER}${APP_NAME}-${APP_VERSION}"
SCAFFOLD_USER=root
SOURCE_FOLDER="${SCRIPT_DIR}/../es-home/build"

# Verify prerequisites
# --------
if [[ ! -d "${SOURCE_FOLDER}" ]]; then
  echo "" 1>&2
  echo "Missing Source Folder: '${SOURCE_FOLDER}'." 1>&2
  echo "" 1>&2
  exit 1
fi

# Wipe/recreate all temp/target directories
# --------
echo ""
echo "[[ WIPING DIRS ]]"
echo ""
SPEC_DIRS="SOURCES BUILD RPMS SPECS SRPMS"
for SPEC_DIR in $SPEC_DIRS; do
  rm -rf "${SCRIPT_DIR}/${SPEC_DIR}"
  mkdir "${SCRIPT_DIR}/${SPEC_DIR}"
done

# Write out RPM SPEC file
# --------
echo ""
echo "[[ WRITING SPEC ]]"
echo ""
cat << __EOF__ > "${SCRIPT_DIR}/SPECS/${APP_NAME}-${APP_VERSION_RPM}.spec"
Name:       ${APP_NAME}
Version:    ${APP_VERSION_RPM}
Release:    1
Summary:    ${APP_NAME}
License:    DoD
Requires:   httpd

%description

# prep: Prepare teh source code to be compiled (before building the RPM)
%prep
# (We build our binaries externally.)

# build: Compile source code to binaries (before building the RPM)
%build
# (We build our binaries externally.)

# install: Copy binaries into a local, temporary structure,
# under %{buildroot} (defined by "_topdir", as a command-line arg).
# The structure under %{buildroot} should be relative to the root
# of the target system. This is executed on the rpmbuild machine.
%install
mkdir -p %{buildroot}${APP_INSTALL_DIR}
mkdir -p %{buildroot}${APP_INSTALL_DIR}/es-home/
mkdir -p %{buildroot}${APP_INSTALL_DIR}/httpd
mkdir -p %{buildroot}${APP_INSTALL_DIR}/httpd/conf
cp -a "${SCRIPT_DIR}/../es-home/build/." "%{buildroot}${APP_INSTALL_DIR}/es-home"
cp -a "${SCRIPT_DIR}/files/." "%{buildroot}${APP_INSTALL_DIR}/httpd/conf/"
# files: List the absolute path of files to install/uninstall to the target system.
# These are expected to also exist as root-relative under the %{buildroot}
# directory of the buildrpm machine.
%files
%attr(0644, ${SCAFFOLD_USER}, ${SCAFFOLD_USER}) ${APP_INSTALL_DIR}

# pre: Scripts to execute before install files to the target system
%pre
mkdir -p "${APP_INSTALL_DIR}"

# pre: Scripts to execute after installing files to the target system
%post
ln -sf "${APP_INSTALL_DIR}/es-home" "/opt/scaffold/ui"
#copy conf.files
cp -rfp "${APP_INSTALL_DIR}/httpd/conf/scaffold.conf" "/etc/httpd/conf"
systemctl reload httpd 
# preun: Scripts to execute before uninstalling files from the target system
%preun

# postun: Scripts to execute after uninstalling files from the target system
%postun
rm /etc/httpd/conf/scaffold.conf
rm -rf ${APP_INSTALL_DIR}
systemctl reload httpd
__EOF__

# Run rpmbuild
# --------
echo ""
echo "[[ BUILDING RPM ]]"
echo ""
cd "${SCRIPT_DIR}"
rpmbuild -v -bb --define "_topdir ${SCRIPT_DIR}" "SPECS/${APP_NAME}-${APP_VERSION_RPM}.spec"

echo ""
echo "See: ${SCRIPT_DIR}/RPMS/x86_64/${APP_NAME}-${APP_VERSION_RPM}-1.x86_64.rpm"
echo ""
echo "[[ SUCCESS ]]"
echo ""
