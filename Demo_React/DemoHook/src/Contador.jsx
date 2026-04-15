import React, { useState } from "react";
export default function Contador(){
    const [numero, setNumero] = useState(5);
    return(
        <div>
            <h1>{numero}</h1>
            <button onClick={()=>setNumero(numero + 1)}>
                inc
            </button>
            <button onClick={()=>setNumero(numero - 1)}>
                dec
            </button>
        </div>
    )
}