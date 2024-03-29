import FileSaver from 'file-saver'

/**
 * 下载文件
 * @param data
 * @param fileName
 */
export const downloadFile = (data: ArrayBuffer, fileName: string) => {
  const blob = new Blob([data], { type: 'application/octet-stream' })
  FileSaver.saveAs(blob, fileName)
}
