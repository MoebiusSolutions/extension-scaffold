import React from 'react'

export const MyPanel: React.FC<{}> = () => {
    function handleClick() {
        console.log('snowpack clicked')
    }
    return <div onClick={handleClick}>
        MyPanel - snowpack - with a whole lot of text so that if a panel is over this Panel
        you can still see that something is here.
    </div>
}
