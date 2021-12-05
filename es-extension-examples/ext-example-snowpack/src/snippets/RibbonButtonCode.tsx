import React from 'react'
import { FormatCode } from './FormatCode'
import { useCode } from './ShowCode'

const options = {
  fileName: 'RibbonButtonCode.txt'
}
export const RibbonButtonCode = () => {
  const { codeString } = useCode(options)
  return <FormatCode source={codeString} />
}
