import ExcelJS from 'exceljs'

export interface IConfig {
  data: unknown[]
  /**
   * data里的子项为一个对象时，需要设置字段名，用于生成数据行
   */
  fields?: string[]
  /**
   * 表头
   * @example [['用户信息表'], ['姓名', '年龄', '性别']]
   */
  headers: string[][]
  /**
   * 单元格合并，row: 行，col: 列，rowspan: 合并的行数，colspan: 合并的列数
   */
  merges?: { row: number; col: number; rowspan: number; colspan: number }[]
  attrs?: {
    rowStart?: number
    rowEnd?: number
    colStart?: number
    colEnd?: number
    attr: Partial<ExcelJS.Style>
  }[]
  views?: Partial<ExcelJS.WorksheetView>[]
  columnsWidth?: number[]
  protect?: { password: string; options: Partial<ExcelJS.WorksheetProtection> }
  sheetName?: string
  sheetOptions?: Partial<ExcelJS.AddWorksheetOptions>
}


export const createExcelFile = async (configs: IConfig[] | IConfig) => {
  if (!Array.isArray(configs)) {
    configs = [configs]
  }
  if (configs.length === 0) return

  const workbook = new ExcelJS.Workbook()
  for (let idx = 0; idx < configs.length; idx++) {
    const item = configs[idx]
    const sheet = workbook.addWorksheet(item.sheetName || 'sheet' + (idx + 1))

    // 生成完整excel数据，包含表头和数据行。
    const results = item.data.map((obj: any) => {
      if (
        typeof obj === 'string' ||
        typeof obj === 'number' ||
        typeof obj === 'boolean' ||
        obj === null ||
        obj === undefined
      ) {
        return [obj]
      }

      return item?.fields?.map((key) => {
        return obj[key] ?? ''
      })
    })
    const excelData = [...item.headers, ...results]
    sheet.addRows(excelData)

    // 单元格合并处理
    item?.merges?.forEach((m) => {
      sheet.mergeCells(m.row, m.col, m.row + m.rowspan, m.col + m.colspan)
    })

    if (item.views) {
      sheet.views = item.views
    }

    if (item.protect) {
      await sheet.protect(item.protect.password, item.protect.options)
    }

    // 单元格样式处理
    item?.attrs?.forEach((val) => {
      const attr = val.attr
      const rowStart = val.rowStart
      const rowEnd = val.rowEnd
      const colStart = val.colStart
      const colEnd = val.colEnd

      if (rowStart !== undefined && rowEnd !== undefined) {
        for (let r = rowStart; r <= rowEnd; r++) {
          const row = sheet.getRow(r)

          if (colStart !== undefined && colEnd !== undefined) {
            for (let c = colStart; c <= colEnd; c++) {
              const cell = row.getCell(c)
              Object.keys(attr).forEach((key) => {
                // @ts-ignore
                cell[key] = attr[key]
              })
            }
            continue
          }

          // 未设置列，整行设置
          Object.keys(attr).forEach((key) => {
            // @ts-ignore
            row[key] = attr[key]
          })
        }
        return
      }

      if (colStart !== undefined && colEnd !== undefined) {
        for (let c = colStart; c <= colEnd; c++) {
          // 获取当前列，整列设置
          const column = sheet.getColumn(c)
          Object.keys(attr).forEach((key) => {
            // @ts-ignore
            column[key] = attr[key]
          })
        }
        return
      }

      // 没有设置具体的行列，则为整表设置
      Object.keys(attr).forEach((key) => {
        // @ts-ignore
        sheet[key] = attr[key]
      })
    })

    item?.columnsWidth?.forEach((width, index) => {
      sheet.columns[index].width = width
    })
  }

  return workbook.xlsx.writeBuffer()
}
