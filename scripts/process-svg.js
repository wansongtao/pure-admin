import { getFiles, updateFileContent } from './file.js'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * 处理单色图标的fill和class，使其可以通过css控制颜色
 * @param {string} path
 * @param {string} [className='svg-icon']
 */
const updateMonochromeSvg = async (path, className = 'svg-icon') => {
  const monochromePath = resolve(__dirname, path)

  /**
   *
   * @param {string} data
   * @returns
   */
  const updateSvgContent = (data) => {
    if (!data.includes('fill="')) {
      data = data.replace(/<svg/, `<svg fill="currentColor"`)
    } else {
      data = data.replace(/(fill="[^"]*")/g, 'fill="currentColor"')
    }

    if (!className) {
      return data
    }

    if (!data.includes('class="')) {
      data = data.replace(/<svg/, `<svg class="${className}"`)
    } else {
      data = data.replace(/(class="[^"]*")/g, `class="${className}"`)
    }

    return data
  }

  const files = await getFiles(monochromePath).catch(() => [])
  files.forEach((file) => {
    const filePath = resolve(monochromePath, file)
    updateFileContent(filePath, updateSvgContent)
  })
}

updateMonochromeSvg('../src/assets/svgs/menus')
