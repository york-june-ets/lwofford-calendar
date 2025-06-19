import { createContext, ReactNode, useContext, useState } from "react";

const ForceUpdateContext = createContext<() => void>( () => {} )

export const useForceUpdate = () => useContext( ForceUpdateContext )

export const ForceUpdateProvider: React.FC<{ children: ReactNode }> = ( { children } ) => {
	const [ tick, setTick ] = useState(0)
	const forceUpdate = () => setTick( t => t + 1 )

	return <>{/*<p>{ tick }</p>*/}<ForceUpdateContext.Provider value={ forceUpdate }>
		{ children }
	</ForceUpdateContext.Provider></>
}
