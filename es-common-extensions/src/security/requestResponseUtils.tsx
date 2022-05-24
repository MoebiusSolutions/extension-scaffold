
const throwHttpError = (response: any) => {
  throw new Error(`${response.status} ${response.statusText}`)
}

export const extractJsonFromResponse = (response: any) => {
  if (!response.ok) {
    throwHttpError(response)
  }
  return response.json()
}


export const evaluateError = (response: any) => {
  const withStatusWrapper = (cause: any) => `HTTP Code(${cause.status}) Text(${cause.statusText})`
  const defaultUnexpected = (cause: any) => `Unexpected(${JSON.stringify(cause)})`
  const deriveCauseMessage = (cause: any) => {
    let causeMessage

    if (!cause) {
        causeMessage = 'Unexpected'
    } else if (cause.message) {
        causeMessage = cause.message
    } else if (cause.status) {
        causeMessage = withStatusWrapper(cause)
    } else {
        causeMessage = defaultUnexpected(cause)
    }
    return causeMessage
  }
  return deriveCauseMessage(response)
}
