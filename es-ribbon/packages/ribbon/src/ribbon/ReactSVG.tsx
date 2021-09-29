import React, { useRef, useLayoutEffect } from 'react'
import SVGInjector from 'svg-injector'

interface ReactSVGProps {
    id?: string
    src: string
    style?: React.CSSProperties,
    svgStyle?: React.CSSProperties,
    className?: string
}
export const ReactSVG: React.FC<ReactSVGProps> = ({
    id = '',
    src,
    style,
    svgStyle = { height: 24, width: 24, color: 'white' },
    className = '',
}) => {
    const imgElem = useRef<HTMLImageElement>(null)

    useLayoutEffect(() => {
        if (imgElem.current) {
            SVGInjector(imgElem.current, {}, () => {})
        }
    }, [])

    return (
        <div style={style}>
            <img
                id={id}
                src={src}
                ref={imgElem}
                style={svgStyle}
                className={className}
                alt=""
            />
        </div>
    )
}

export default ReactSVG
