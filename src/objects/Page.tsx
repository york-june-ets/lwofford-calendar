import { createContext, ReactNode, useContext, useState } from "react"

export enum EPage {
	WELCOME = 0,
	MAIN = 1,
	SETTINGS = 2
}

export interface IPageContext {
	page: EPage
	setPage: (page: EPage) => void
}

export const PageContext = createContext<IPageContext | null>(null)

export const PageProvider: React.FC< { children: ReactNode } > = ( { children } ) => {
	const [ page, setPage ] = useState<EPage>( EPage.WELCOME )

	return <PageContext.Provider value={ { page, setPage } }>
		{ children }
	</PageContext.Provider>
}

export const usePage = () => {
	const context = useContext(PageContext)
	if (!context) {
		throw new Error("usePage must be used within a PageProvider")
	}
	return context
}