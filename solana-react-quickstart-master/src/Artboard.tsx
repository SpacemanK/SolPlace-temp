import * as React from 'react';
import { useState, useEffect } from 'react';

const Artboard = ({currentColorState} :{currentColorState : number[]}) => {
    const rgb_string = (...color_list: number[]) => {  
        return `rgb(${color_list[0]},${color_list[1]},${color_list[2]})`;
      }
    const matrix  = (numrows:number, numcols:number, initial:number[]) =>{
        var arr = [];
        for (var i = 0; i < numrows; ++i) {
            var columns = [];
            for (var j = 0; j < numcols; ++j) {
                columns[j] = initial;
            }
            arr[i] = columns;
        }
        return arr;
    }
    const array: number[][][]=matrix(100,100,[255,255,255]);
    const [artboardState,setArtboardState]=useState(array);
    const change_color = (event: React.MouseEvent<HTMLElement>) => {
        let new_array=[...artboardState];
        let row=event.currentTarget.getAttribute('data-row');
        let col=event.currentTarget.getAttribute('data-col');
        if (col && row){
            new_array[parseInt(row)][parseInt(col)]=[...currentColorState];
            console.log(new_array[parseInt(row)][parseInt(col)])
            setArtboardState(new_array);
            console.log(artboardState[parseInt(row)])
        }
        
        
    }
    
    //console.log(array)
    const listItems=  artboardState.map((element,row) => <div className='row' data-row-index={row}> {element.map((currElement: number[], index:number) => {
        return <div className="box" 
                    key={index} 
                    data-row={row} 
                    data-col={index} 
                    style={{ background: rgb_string(...currElement) }}
                    onClick={(event)=>{change_color(event)}}>
                    
                </div>;
    })}</div>);
    
    return ( <div className="artboard">
        {listItems}


    </div> );
}
 
export default Artboard;