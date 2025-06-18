import { createContext, ReactNode, useContext, useState } from "react"
import { WelcomePage } from "../pages/Welcome"
import { CalendarPage } from "../pages/Calendar"
import { EventsPage } from "../pages/Events"
import { SettingsPage } from "../pages/Settings"
import { NotFoundPage } from "../pages/NotFound"

export enum EPage {
	WELCOME = 0,
	CALENDAR = 1,
	EVENTS = 2,
	SETTINGS = 3
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

export const CurrentPage: React.FC = () => {
	const { page } = usePage()
	let CurrentPageComponent: React.FC

	const ALL_PAGES = [ WelcomePage, CalendarPage, EventsPage, SettingsPage ]

	CurrentPageComponent = (page >= 0 && page < ALL_PAGES.length) ? ALL_PAGES[page] : NotFoundPage

	return <CurrentPageComponent/>

}