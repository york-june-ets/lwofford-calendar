import './Events.css'

import { useEffect, useState } from "react"
import { Event, EventListTile, EventModal, EventProvider, useEvent } from "../objects/Event"
import { useUser } from "../objects/User"
import { DBget } from "../Fetch"

export const EventsPage: React.FC = () => {
	return <EventProvider>
		<EventsPageWithEvent />
	</EventProvider>
}

const EventsPageWithEvent: React.FC = () => {
	const { user } = useUser()
	const { event } = useEvent()
	
	const [ events, setEvents ] = useState<Event[]>( [] )
	const [ eventsLoading, setEventsLoading ] = useState<boolean>( true )

	const [ filterDateRangeMin, setFilterDateRangeMin ] = useState<Date | null>( new Date() )
	const [ filterDateRangeMax, setFilterDateRangeMax ] = useState<Date | null>( null )

	let filterDateRangeMinString: string
	if ( filterDateRangeMin === null ) filterDateRangeMinString = ""
	else {
		filterDateRangeMinString = `${ filterDateRangeMin!.getFullYear() }-${ ( filterDateRangeMin!.getMonth() + 1 ).toString().padStart( 2, "0" ) }-${ filterDateRangeMin!.getDate().toString().padStart( 2, "0" ) }`
	}

	let filterDateRangeMaxString: string
	if ( filterDateRangeMax === null ) filterDateRangeMaxString = ""
	else {
		filterDateRangeMaxString = `${ filterDateRangeMax!.getFullYear() }-${ ( filterDateRangeMax!.getMonth() + 1 ).toString().padStart( 2, "0" ) }-${ filterDateRangeMax!.getDate().toString().padStart( 2, "0" ) }`
	}

	let actualMinDate: Date | null = filterDateRangeMin
	let actualMaxDate: Date | null = filterDateRangeMax
	if ( filterDateRangeMin !== null && filterDateRangeMax !== null && filterDateRangeMin.getTime() > filterDateRangeMax.getTime()) {
		actualMinDate = filterDateRangeMax
		actualMaxDate = filterDateRangeMin
	}

	const NOW = new Date()

	useEffect(() => {
		const getEvents = async () => {
			try {
				const response = await DBget<Event[]>( `events` )
				setEvents( response.filter( ( event ) => {
					return event.invites.some( invite => {
						return invite.user === user!.id
					} )
				} ) )
			} catch (err) {
				console.error(err)
			} finally {
				setEventsLoading( false )
			}
		}
		getEvents()
	}, [ events ])

	if ( eventsLoading ) {
		return <p>Loading...</p>
	}
	
	return <main className="page" style={ { display: "flex" } }>
		<div className='sidebar'>
			<p>Show events between...</p>
			<input
				type="date"
				value={ filterDateRangeMinString }
				onChange={ e => {
					const newDate = new Date( e.target.value )
					newDate.setMinutes( newDate.getMinutes() + NOW.getTimezoneOffset() )
					setFilterDateRangeMin( e.target.value === "" ? null : newDate )
				} }
			/>
			<p>and...</p>
			<input
				type="date"
				value={ filterDateRangeMaxString }
				onChange={ e => {
					const newDate = new Date( e.target.value )
					newDate.setMinutes( newDate.getMinutes() + NOW.getTimezoneOffset() )
					setFilterDateRangeMax( e.target.value === "" ? null : newDate )
				} }
			/>
		</div>
		<div className="event-list"> {
			events.filter( event => {
				if (actualMinDate === null) return true
				return new Date( event.dateTimeStart ).getTime() - actualMinDate.getTime() > 0
			} ).filter( event => {
				if (actualMaxDate === null) return true
				return new Date( event.dateTimeStart ).getTime() - actualMaxDate.getTime() < 0
			} ).sort( ( a, b ) => {
				return new Date( a.dateTimeStart ).getTime() - new Date( b.dateTimeStart ).getTime()
			} ).map( event => {
				return <EventListTile event={ event } />
			} )
		} </div>
		{ event !== null &&
			<EventModal />
		}
	</main>
}