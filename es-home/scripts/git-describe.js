const { gitDescribeSync } = require('git-describe')
const packageVersion = require('../package.json').version;
const GIT_COMMIT = 'GIT_COMMIT'

function useGitEnv() {
    return !! process.env[GIT_COMMIT]
}
const version = useGitEnv() ? {
    hash: process.env[GIT_COMMIT],
    buildUrl: process.env['BUILD_TAG']
} : gitDescribeSync()

version.version = packageVersion
console.log(JSON.stringify(version, null, 2))
