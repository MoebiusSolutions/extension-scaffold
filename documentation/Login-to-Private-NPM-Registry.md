# Login to Private NPM Registry

You will need to access a private NPM registry to build this project.
Depending on your development environment you will need to use a different login command.

See below.

## OSA/CSA Artifactory

`npm login --registry https://services.csa.spawar.navy.mil/artifactory/api/npm/mtc2-c2f-npm-group/ --scope @gots`

## TRMC Artifactory Nexus

> NOTE: TRMC has some setup before you can access Artifactory

```
Registry Access
You will need Artifactory access for both the docker registry and for NPM javascript builds.

First, make sure you have Artifactory permissions:

https://www.trmc.osd.mil/accounts/groups
Check your account has "User Group: Artifactory" permissions.
Verify you can log into: https://artifacts.trmc.osd.mil/ui
Set your TRMC password

https://www.trmc.osd.mil/accounts/reset-password
You'll still typically use your CAC on the website, but you must set a password to use Artifactory.
```

`npm login --registry https://artifacts.trmc.osd.mil/artifactory/api/npm/minerva-npm/ --scope @gots`

> NOTE: The above command stores an `authToken` in your `~/.npmrc` file.
> Token based access to TRMC requires an "Internal Artifactory Account".
> While, I was not able to get username/password to work without an "Internal Artifactory Account", it has worked for others.
> If you want to try username/password then,
> below is a working `~/.npmrc` file where you can either set environment variables needed:
> `NPM_BASE64_PASSWORD`, `NPM_USERNAME`, `NPM_EMAIL`
> or replace the place holders with the correct values.

> WARNING: using `strict-ssl=false` is not recommend, but helped some Leidos folks while on VPN.

```
always-auth = true
strict-ssl=false
@dcgsn:registry=https://artifacts.trmc.osd.mil/artifactory/api/npm/minerva-npm/
@ccri-dcgsn:registry=https://artifacts.trmc.osd.mil/artifactory/api/npm/minerva-npm/
@aeolus:registry=https://artifacts.trmc.osd.mil/artifactory/api/npm/minerva-npm/
@dcgsn-npm:registry=https://artifacts.trmc.osd.mil/artifactory/api/npm/minerva-npm/
@ccri-min:registry=https://artifacts.trmc.osd.mil/artifactory/api/npm/minerva-npm/
@dfntc-mil:registry=https://artifacts.trmc.osd.mil/artifactory/api/npm/minerva-npm/
@gots:registry=https://artifacts.trmc.osd.mil/artifactory/api/npm/minerva-npm/
//artifacts.trmc.osd.mil/artifactory/api/npm/minerva-npm/:_password=${NPM_BASE64_PASSWORD}
//artifacts.trmc.osd.mil/artifactory/api/npm/minerva-npm/:username=${NPM_USERNAME}
//artifacts.trmc.osd.mil/artifactory/api/npm/minerva-npm/:email=${NPM_EMAIL}
//artifacts.trmc.osd.mil/artifactory/api/npm/minerva-npm/:always-auth=true
```

> WARNING: A single failed login attempt may lock your TRMC username/password access.

> brad.evans
> 11:22 AM
> here WRT to Artifactory Accounts - keep in mind that we still haven't found the cause of WEB-6497 
> (users 'lose' memberships in Artifactory), so if you suddenly discover that you have no access to things 
> in Artifactory, the current workaround is to re-establish your memberships by performing the direct-login
> to <https://artifacts.trmc.osd.mil/ui/login> as above 
> (after logging out of TRMC at <https://www.trmc.osd.mil/accounts/logout>).

## Moebius Nexus

`npm login --registry https://nexus.moesol.com/repository/gccsje-npm-hosted/ --scope @gots`

# `NPM_AUTH_TOKEN` as an Environment Variable

If you would rather not place your raw authorization token in your `~/.npmrc` file
you can grab it and then replace the real string with `${NPM_AUTH_TOKEN}` in the file.

```bash
$ grep _authToken ~/.npmrc
$ export NPM_AUTH_TOKEN={value you copied from grep}
```

> Note: `grep` should return something like this:
```
//nexus.moesol.com/repository/gccsje-npm-hosted/:_authToken=blah-blah-some-token-here
```

Thus, your export would look like this:

```
$ export NPM_AUTH_TOKEN=blah-blah-some-token-here
```

> NOTE: Be careful to **not** leak this token value to the `git` repository.
