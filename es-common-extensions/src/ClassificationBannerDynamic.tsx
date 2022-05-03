import React from 'react'
import type { ExtensionScaffoldApi } from '@gots/es-runtime/build/es-api'
import './ClassificationBannerDynamic.css'


export const ClassificationBannerDynamic: React.FC<{ es: ExtensionScaffoldApi, userInfo: UserInfo }> = ({ es, userInfo }) => {
    let banner = React.createElement("div", {
        className: "classification-banner-unclass"
    }, "UNCLASSIFIED-def");
    if (userInfo && userInfo.clearance) {
        let clearanceString = userInfo.clearance;
        // add in cavaet
        if(userInfo.controls){
            clearanceString += "//"+ userInfo.controls.join('/');
        }
        banner = React.createElement("div", {
            className: `classification-banner-` + userInfo.clearance.toLowerCase()
        },clearanceString);
    }
    return banner;
}

export async function buildBanner() {
    const requestUrl = `/es-security-helper/api/userinfo/getTokenInfo`;
    const userInfo = await requestUserInfo(requestUrl);
    return userInfo;
  
}
async function requestUserInfo(url: string): Promise<UserInfo> {
    const response = await GET(url);
    let userinfo = await jsonOrError(response, 'Failed to get user data') as UserInfo
    return userinfo;
}
export interface UserInfo {
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
