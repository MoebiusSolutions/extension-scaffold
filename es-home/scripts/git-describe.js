const { gitDescribeSync } = require('git-describe')
const packageVersion = require('../package.json').version;

const version = gitDescribeSync()
version.version = packageVersion
console.log(JSON.stringify(version, null, 2))
