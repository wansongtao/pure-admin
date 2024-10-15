import fs from 'fs'

/**
 *
 * @param {string} path 文件绝对路径
 * @param {(fileContent: string | Buffer) => string | NodeJS.ArrayBufferView} [callback]
 * @param {Object} [options='utf8']
 * @param {fs.WriteFileOptions} [options.writeOptions]
 * @param {{encoding?: string | null; signal?: AbortSignal} | string} [options.readOptions]
 */
export const updateFileContent = (path, callback, options) => {
  const baseEncoding = 'utf8'
  const { readOptions = baseEncoding, writeOptions = baseEncoding } = options || {}

  fs.readFile(path, readOptions, function (err, data) {
    if (err) {
      return console.error(err)
    }
    if (!callback) {
      return
    }

    const newData = callback(data)
    fs.writeFile(path, newData, writeOptions, function (err) {
      if (err) {
        return console.error(err)
      }
    })
  })
}

/**
 *
 * @param {string} path
 * @returns {Promise<string[]>}
 */
export const getFiles = (path) => {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, files) => {
      if (err) {
        reject(err)
      } else {
        resolve(files)
      }
    })
  })
}
