# RPM Build Instructions

## Why make an RPM?

For non-container environments such as DF-MOTF, the scaffold must be deployed as an rpm.

## RPM installation requirements

This RPM will fail to install if httpd is not installed on the target system.

## Steps for creating a release rpm

The following steps can and should be automated. Automation vi Jenkins has been postponed at this point as DI2E sunsets Sept 2022.

### Build the latest release and RPM

extension-scaffold/scripts/buildLatestReleaseAsRPM.sh

This script will checkout the latest 'release' branch and build an RPM.

### Build the RPM

extension-scaffold/rpmbuild/build.sh

### RPM Location
extension-scaffold releases are avaialable for download here:

<br>https://nexus.di2e.net/nexus/content/repositories/Private_DFNTC_Releases/extension-scaffold/extension-scaffold/

### Push RPM to Repo
There are 2 options available:
1. Upload the RPM to Nexus 

* Nexus: https://nexus.di2e.net/
* List the nexus repositories in the GUI and click the Private_DFNTC_Releases repository.
* At the bottom, a new tab will appear called Artifact Upload
* Select GAV Parameters from the dropdown and enter values for the following:
    Group: extension-scaffold
    Artifact:extension-scaffold
    Version: 1.2.3  (ie. the x.y.z version for this release)
    Packaging: rpm   (type in "rpm", it won't appear as a choice in the dropdown)
* Click "Select Artifact to Upload"
* Browse to the RPM file you downloaded from the Jenkins build.
* Leave "Classifier" blank
* Extension should automatically be "rpm"
* Click Add Artifact
* Click Upload Artifact(s)

2. Use a Maven CLI script

```
mvn deploy:deploy-file \
    -DgroupId=extension-scaffold \
    -DartifactId=extension-scaffold \
    -Dversion=x.x.x \
    -Dpackaging=rpm \
    -Dfile=extension-scaffold-x.x.x-1.noarch.rpm \
    -DrepositoryId=di2e \
    -Durl=https://nexus.di2e.net/nexus/content/repositories/Private_DFNTC_Releases
```    

## Keep in mind

Currently this script does not 'sign' the RPM.  This would typically be done by a Jenkins build.

## Some utility commands if you want to look inside the RPM

* List files in the RPM:    rpm -qlp <rpmFile>
* Show RPM package scripts:   rpm -qp --scripts <rpmFile>
* Extract files from an RPM:  rpm2cpio <rpmFile> |cpio -idmv


