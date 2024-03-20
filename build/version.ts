import shelljs from 'shelljs'

const { exec, which, echo } = shelljs

const getVersion = () => {
  if (!which('git')) {
    echo('Sorry, this script requires git.')
    return ''
  }

  let currentTag = exec('git describe --abbrev=0 --tags', { silent: true }).stdout
  if (!currentTag) {
    const currentBranch = exec('git symbolic-ref --short -q HEAD', {
      silent: true
    }).stdout

    // get the short hash name for the latest version
    const latest = exec('git rev-parse --short HEAD', {
      silent: true
    }).stdout

    return `${currentBranch}-${latest}`
  }

  const versions = currentTag.split('\n')
  currentTag = versions[versions.length - 2]
  return currentTag
}

export default getVersion()
