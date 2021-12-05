import React from 'react'
import { FormatCode } from './FormatCode'
import { useCode } from './ShowCode'

const options = {
  fileName: 'RibbonButtonSplitCode.txt'
}
export const RibbonButtonSplitCode = () => {
  const { codeString } = useCode(options)
  return <FormatCode source={codeString} />
}
