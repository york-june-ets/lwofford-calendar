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
	const isToday : boolean =
		date !== null &&
		date.getDate() === today.getDate() &&
		date.getMonth() === today.getMonth() &&
		date.getFullYear() === today.getFullYear()

	const dateString = `${ date?.getFullYear() }-${ ( ( date?.getMonth() ?? -1 ) + 1).toString().padStart( 2, "0" ) }-${ ( ( date?.getDate() ?? -1 ) ).toString().padStart( 2, "0" ) }`
	const [ events, setEvents ] = useState<Event[]>( [] )
	const [ eventsLoading, setEventsLoading ] = useState<boolean>( true )

	useEffect(() => {
		if ( date === null ) return
		const getEvents = async () => {
			try {
				const response = await DBget<Event[]>( `events?date=${ dateString }` )
				setEvents( response )
			} catch (err) {
				console.error(err)
			} finally {
				setEventsLoading( false )
			}
		}
		getEvents()
	}, [])

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

export default CalendarDay;