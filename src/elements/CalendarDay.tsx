import './../pages/Calendar.css'


interface ICalendarDay {
	date: Date | null
}

const CalendarDay: React.FC<ICalendarDay> = ( { date } ) => {
	const today : Date = new Date()
	const isToday : boolean =
		date !== null &&
		date.getDate() === today.getDate() &&
		date.getMonth() === today.getMonth() &&
		date.getFullYear() === today.getFullYear()

	return <>
		<div className={ `calendar-cell ${isToday ? 'today' : ''}` }>
			{ date?.getDate() ?? "" }
		</div>
	</>
}

export default CalendarDay;