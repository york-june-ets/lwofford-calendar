import { useEffect, useState } from 'react'
import { DBget } from '../Fetch'
import './../pages/Calendar.css'
import { Event, EventCalendarTile } from '../objects/Event'
import { EInviteStatus, Invite } from '../objects/Invite'
import { useUser } from '../objects/User'
import { useForceUpdate } from './ForceUpdate'


interface ICalendarDay {
	date: Date | null
}

const CalendarDay: React.FC<ICalendarDay> = ( { date } ) => {
	const { user } = useUser()
	const forceUpdate = useForceUpdate()
	
	const today : Date = new Date()
	const isToday : boolean = datesAreSameDay( date, today )

	const [ events, setEvents ] = useState<Event[]>( [] )
	const [ eventsLoading, setEventsLoading ] = useState<boolean>( true )

	useEffect(() => {
		if ( date === null ) return
		const getEvents = async () => {
			try {
				const response = await DBget<Event[]>( `events` )
				setEvents( response.filter( ( event ) => {
					return datesAreSameDay( date, event.dateTimeStart )
				} ) )
			} catch (err) {
				console.error(err)
			} finally {
				setEventsLoading( false )
			}
		}
		getEvents()
	}, [ events ])

	if ( date === null ) return <></>
	if ( eventsLoading ) return <></>

	return <>
		<div className={ `calendar-cell ${isToday ? 'today' : ''}` }>
			<p>{ date?.getDate() ?? "" }</p>
			<div className='scrollable'>{
				events.filter( (event: Event) => {
					const myInvite = event?.invites.reduce<Invite | undefined>( (r, i) => {
							if ( user!.id !== i.user ) return r
							return i
						}, undefined )
					return myInvite !== undefined
				} ).map( (event: Event) => {
					return ( <EventCalendarTile event={ event } /> )
				} )
			} </div>
		</div>
	</>
}

function datesAreSameDay( a: Date | string | null, b: Date | string | null ) : boolean {
	if (typeof a === "string") a = new Date( a )
	if (typeof b === "string") b = new Date( b )
	return (
		a !== null && b !== null &&
		a.getDate() === b.getDate() &&
		a.getMonth() === b.getMonth() &&
		a.getFullYear() === b.getFullYear()
	)
}

export default CalendarDay;