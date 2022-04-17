
const mode = import.meta.env.NODE_ENV;
const securityUrl = import.meta.env[`ES_SECURITY_URL_${mode}`];

export const fetchTokenInfo = async () => {
  const url = `${securityUrl}/api/userinfo/getPrincipal`;
  return fetch(url, {
      method: "GET",
      credentials: "same-origin",
      headers: {
          "Content-Type": "application/json"
      }
  })
  .then(response => response.json())
  .then(json => {
    // TODO: augmenting the json with fake data to facilitate UFS integration while the backend meta-data gets worked out.
    return {
      ...json,
      opauth: import.meta.env[`ES_SECURITY_FAKE_OPAUTH_${mode}`]
    }
  });
}