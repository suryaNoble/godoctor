/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext } from "react";

export const AppContext = createContext()

const AppContextProvider = (props)=>{

    const currency = "₹"

    // any value added in below value can be accessed by any file using below props.children
    const value ={
        currency
    }

    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}


export default AppContextProvider