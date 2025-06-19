import CalendarDay from '../elements/CalendarDay'
import { ForceUpdateProvider, useForceUpdate } from '../elements/ForceUpdate'
import { CreateNewEvent, EventModal, EventProvider, useEvent } from '../objects/Event'
import { EInviteStatus, Invite } from '../objects/Invite'
import { useUser } from '../objects/User'
import './Calendar.css'
import { useState } from "react"

const WEEK_DAY_ABBRS = [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ]

export const CalendarPage: React.FC = () => {	
	return <EventProvider>
		<ForceUpdateProvider>
			<CalendarPageWithEvent />
		</ForceUpdateProvider>
	</EventProvider>
}

const CalendarPageWithEvent: React.FC = () => {
	const { user } = useUser()
	const { event, setEvent } = useEvent()
	const forceUpdate = useForceUpdate()

	const NOW = new Date()
	const [ currentDate, setCurrentDate ] = useState<Date>( new Date( NOW.getFullYear(), NOW.getMonth(), 1 ) )

	const year = currentDate.getFullYear()
	const month = currentDate.getMonth()

	const firstDayOfMonth = new Date(year, month, 1).getDay()
	const daysInMonth = new Date(year, month + 1, 0).getDate()

	const weeks: (Date | null)[][] = [];
	let week: (Date | null)[] = new Array(firstDayOfMonth).fill(null)
	
	for (let day = 1; day <= daysInMonth; day++) {
			week.push(new Date(year, month, day));
			if (week.length === 7) {
			weeks.push(week);
			week = [];
		}
	}

	if (week.length) {
		while (week.length < 7) week.push(null);
		weeks.push(week);
	}

	return <main className="page">
		<div style={ { display: "flex", gap: "10px", alignItems: "center", justifyContent: "center" } }>
			<button 
				style={ { marginRight: "auto" } }
				onClick={ () => {
					setCurrentDate(
						new Date( currentDate.getFullYear(), currentDate.getMonth() - 1, 1 )
					)
				} }
			>◀️</button>
			<button
			>{ currentDate.toLocaleString('default', { month: 'long' } ) } { year }</button>
			<button
				onClick={ async () => {
					const newEvent = await CreateNewEvent( user! )
					setEvent( newEvent! )
				} }
			>New Event</button>
			<button
				style={ { marginLeft: "auto" } }
				onClick={ () => {
					setCurrentDate(
						new Date( currentDate.getFullYear(), currentDate.getMonth() + 1, 1 )
					)
				} }
			>▶️</button>
		</div>		
		<div className="calendar-grid">
		{	
			WEEK_DAY_ABBRS.map(day => (
				<div key={day} className="calendar-header">{ day }</div>
			) )
		}
		{	
			weeks.map( ( week, i ) => (
				week.map( ( date, j ) => {
					return <CalendarDay key={`${ i }-${ j }`} date={ date } />
				} )
			) )
		}
		</div>
		{ event !== null &&
			<EventModal />
		}
	</main>
}