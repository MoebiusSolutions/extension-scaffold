import React from 'react'
import type { ExtensionScaffoldApi } from '@gots/es-runtime/build/es-api'
import './ClassificationBannerDynamic.css'
// build classification banner based on user clearance
export const ClassificationBannerDynamic: React.FC<{ es: ExtensionScaffoldApi }> = ({ es }) => {
    // get user information
    let banner =  React.createElement("div", {
        className: "classification-banner-unclass"
      }, "UNCLASSIFIED-def");
    const requestUrl = `/es-security-helper/getTokenInfo`;
    async function requestUserInfo(url: string): Promise<UserInfoResult> {
        const response = await GET(url);
        let userinfo = await jsonOrError(response, 'Failed to get user data') as UserInfoResult
        return userinfo;
    }
    //let userInfoResult = requestUserInfo(requestUrl);
    Promise.resolve(requestUserInfo(requestUrl)).then((userInfoResult: UserInfoResult) => {
        // build div string based on results
           
        if (userInfoResult && userInfoResult.clearance) {
            let clearencelevel = userInfoResult.clearance;
            // add in cavaet
            banner =  React.createElement("div", {
                className: `classification-banner-`+userInfoResult.clearance.toLowerCase()
              }, );
        }
        return banner;
    })
    // should never get here, however method needs a return
    return  banner

}
export interface UserInfoResult {
    realm: string
    sessionUid: string
    uid: string
    valid: boolean
    id: string
    firstName: string
    lastName: string
    name: string
    iCamSource: string
    email: string
    citizenship: string
    clearance: string
    sessionExpiration: bigint
    seContext: string
    sessionActive: boolean
    controls: string[]
    groups: string[]
}


async function GET(url: string) {
    return await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: {
            "Accept-API-Version": "protocol=1.0,resource=3.0"
        },
    })
}
async function jsonOrError(response: Response, msg: string) {
    if (response.status === 200 || response.status === 304) {
        return await response.json()
    } else {
        throw new ErrorResponse(`${msg}, status code - ${response.status} - ${response.statusText}`, response)
    }
}
export class ErrorResponse extends Error {
    constructor(message: string, public response: Response) {
        super(message)
        Object.setPrototypeOf(this, new.target.prototype)
        this.name = 'ErrorResponse'
    }
}
