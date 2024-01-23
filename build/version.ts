import shelljs from 'shelljs'

const { exec, which, echo } = shelljs

/**
 * whether it is the latest version
 * @param {string} v version
 * @returns {boolean}
 */
const isLatestVersion = (v: string): boolean => {
  if (typeof v !== 'string' || !v) {
    console.warn('parameter error')
    return false
  }

  // gets a description message for the current version, containing a long hash name.
  const tagMessage = exec(`git show ${v} --pretty=%H`, {
    silent: true
  }).stdout
  if (!tagMessage) {
    console.warn('read git message error.')
    return false
  }

  // get the hash name for the latest version
  const latest = exec('git rev-parse HEAD', {
    silent: true
  }).stdout

  const idx = tagMessage.indexOf(latest)
  if (idx === -1) {
    return false
  }

  return true
}

const getVersion = () => {
  if (!which('git')) {
    echo('Sorry, this script requires git.')
    return ''
  }

  let tempVersion = exec('git tag', { silent: true }).stdout
  if (!tempVersion) {
    const currentBranch = exec('git symbolic-ref --short -q HEAD', {
      silent: true
    }).stdout

    // get the short hash name for the latest version
    const latest = exec('git rev-parse --short HEAD', {
      silent: true
    }).stdout

    return `${currentBranch}-${latest}`
  }

  const versions = tempVersion.split('\n')
  tempVersion = versions[versions.length - 2]

  if (!isLatestVersion(tempVersion)) {
    echo('Please update git tag.')
  }

  return tempVersion
}

const version = getVersion()

export default version
