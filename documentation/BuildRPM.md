# RPM Build Instructions

## Why make an RPM?

For non-container environments such as DF-MOTF, the scaffold must be deployed as an rpm.

## RPM installation requirements

This RPM will fail to install if httpd is not installed on the target system.

## Steps for creating a release rpm

The following steps can and should be automated as a jenkins job

### Build the latest release and RPM

extension-scaffold/scripts/buildLatestReleaseAsRPM.sh

### Build the RPM

extension-scaffold/rpmbuild/build.sh

### Push RPM to Repo

## Keep in mind

 - Currently this script does not 'sign' the RPM.  This would typically be done by a Jenkins build.

## Some utility commands if you want to look inside the RPM

List files in the RPM:    rpm -qlp <rpmFile>
Show RPM package scripts:   rpm -qp --scripts <rpmFile>
Extract files from an RPM:  rpm2cpio <rpmFile> |cpio -idmv


