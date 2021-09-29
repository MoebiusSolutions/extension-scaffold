import React from 'react'
// @ts-ignore
import bannerStyle from './Banner.css' // eslint-disable-line

export type SecurityType = 'UNCLASSIFIED' | 'CLASSIFIED' | 'SECRET' | 'TOP_SECRET'

const ClassMap: Record<SecurityType, string> = {
    UNCLASSIFIED: 'unclassified',
    CLASSIFIED: 'classified',
    SECRET: 'secret',
    TOP_SECRET: 'top_secret',
}

const getSecurityClass = (security: SecurityType) => ClassMap[security]

interface BannerProps {
    security?: 'UNCLASSIFIED' | 'CLASSIFIED' | 'SECRET' | 'TOP_SECRET'
}

export const Banner: React.FC<BannerProps> = ({
    security = 'UNCLASSIFIED',
}) => <>
    <style>{bannerStyle}</style>
    <div className={`banner  ${getSecurityClass(security)}`}>{security}</div>
</>
