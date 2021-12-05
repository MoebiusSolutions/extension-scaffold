import React from 'react'
import { FormatCode } from './FormatCode'
import { useCode } from './ShowCode'

const options = {
  fileName: 'RibbonDropdownCode.txt'
}
export const RibbonDropdownCode = () => {
  const { codeString } = useCode(options)
  return <FormatCode source={codeString} />
}
