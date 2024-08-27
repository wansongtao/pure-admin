import shelljs from 'shelljs'

const { exec, which, echo } = shelljs

const getLatestCommit = () => {
  const currentBranch = exec('git symbolic-ref --short -q HEAD', {
    silent: true
  }).stdout

  const latestCommit = exec('git rev-parse --short HEAD', {
    silent: true
  }).stdout

  return `${currentBranch.replace(/\n/g, '')}-${latestCommit.replace(/\n/g, '')}`
}

const getLatestVersion = () => {
  if (!which('git')) {
    echo('Sorry, this script requires git.')
    return ''
  }

  if (process.env.NODE_ENV !== 'production') {
    return getLatestCommit()
  }

  const versionInfo = exec('git describe --abbrev=0 --tags', {
    silent: true
  }).stdout
  if (!versionInfo) {
    return getLatestCommit()
  }

  const versions = versionInfo.split('\n')
  return versions[versions.length - 2]
}

const version = `"${getLatestVersion()}"`
export default version
