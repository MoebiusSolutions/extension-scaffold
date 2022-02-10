Name:       extension-scaffold
Version:    2.6.0SNAPSHOT
Release:    1
Summary:    extension-scaffold
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
mkdir -p %{buildroot}/opt/scaffold/extension-scaffold-2.6.0-SNAPSHOT
mkdir -p %{buildroot}/opt/scaffold/extension-scaffold-2.6.0-SNAPSHOT/es-home/
mkdir -p %{buildroot}/opt/scaffold/extension-scaffold-2.6.0-SNAPSHOT/httpd
mkdir -p %{buildroot}/opt/scaffold/extension-scaffold-2.6.0-SNAPSHOT/httpd/conf
cp -a "/home/lrae/code-scaffold/extension-scaffold/rpmbuild/../es-home/build/." "%{buildroot}/opt/scaffold/extension-scaffold-2.6.0-SNAPSHOT/es-home"
cp -a "/home/lrae/code-scaffold/extension-scaffold/rpmbuild/files/." "%{buildroot}/opt/scaffold/extension-scaffold-2.6.0-SNAPSHOT/httpd/conf/"
# files: List the absolute path of files to install/uninstall to the target system.
# These are expected to also exist as root-relative under the %{buildroot}
# directory of the buildrpm machine.
%files
%attr(0640, jboss, jboss) /opt/scaffold/extension-scaffold-2.6.0-SNAPSHOT

# pre: Scripts to execute before install files to the target system
%pre
mkdir -p "/opt/scaffold/extension-scaffold-2.6.0-SNAPSHOT"

# pre: Scripts to execute after installing files to the target system
%post
ln -sf "/opt/scaffold/extension-scaffold-2.6.0-SNAPSHOT/es-home" "/opt/scaffold/es-home"
#copy conf.files
cp -rfp "/opt/scaffold/extension-scaffold-2.6.0-SNAPSHOT/httpd/conf/scaffold.conf" "/etc/httpd/conf"
systemctl reload httpd 
# preun: Scripts to execute before uninstalling files from the target system
%preun

# postun: Scripts to execute after uninstalling files from the target system
%postun
rm /etc/httpd/conf/scaffold.conf
rm -rf /opt/scaffold/extension-scaffold-2.6.0-SNAPSHOT
systemctl reload httpd
