import React from 'react'
import { FormatCode } from './FormatCode'
import { useCode } from './ShowCode'

export const FormatFileName: React.FC<{fileName: string}> = ({
  fileName
}) => {
  const { codeString } = useCode({
    fileName
  })
  return <FormatCode source={codeString} />
}
