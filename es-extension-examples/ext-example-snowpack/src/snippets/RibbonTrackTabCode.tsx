import React from 'react'
import { FormatCode } from './FormatCode'
import { useCode } from './ShowCode'

const options = {
  fileName: 'RibbonTrackTabCode.txt'
}
export const RibbonTrackTabCode = () => {
  const { codeString } = useCode(options)
  return <FormatCode source={codeString} />
}
