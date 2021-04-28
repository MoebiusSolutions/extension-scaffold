import React from 'react'
import ReactDOM from 'react-dom';
import type { ExtensionScaffoldApi } from '../../../es-api/es-api'
import { Center2 } from './Center2';

export const MyPanel: React.FC<{es: ExtensionScaffoldApi}> = ({es}) => {
    function handleClick() {
        console.log('snowpack clicked')
    }
    function handleMaximize() {
        console.log('snowpack maximize')
        es.maximizePanel('ext.example.snowpack')
    }
    function handleRestore() {
        es.restorePanel('ext.example.snowpack')
    }
    function handleAddCenter() {
        es.addPanel({
            id: 'ext.example.snowpack.2',
            location: 'center',
        }).then(onPanelAdded)
    }
    function onPanelAdded(div: HTMLDivElement) {
        console.log('got a div', div)
        ReactDOM.render(
            <React.StrictMode>
              <Center2 es={es}/>
            </React.StrictMode>,
            div
          );
      }

    return <><div onClick={handleClick}>
        MyPanel - snowpack - with a whole lot of text so that if a panel is over this Panel
        you can still see that something is here.
    </div>
    <button onClick={handleMaximize}>Maximize Me</button>
    <button onClick={handleRestore}>Restore Me</button>
    <button onClick={handleAddCenter}>Add Center</button>
    </>
}
