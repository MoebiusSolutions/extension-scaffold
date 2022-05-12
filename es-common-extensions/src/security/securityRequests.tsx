
const mode = import.meta.env.NODE_ENV
const securityUrl = import.meta.env[`ES_SECURITY_URL_${mode}`]
import { extractJsonFromResponse } from './requestResponseUtils.js'

export const fetchTokenInfo = async () => {
  const url = `${securityUrl}/api/userinfo/getTokenInfo`;
  return fetch(url, {
      method: "GET",
      credentials: "same-origin",
      headers: {
          "Content-Type": "application/json"
      }
  })
  .then(extractJsonFromResponse)
}
