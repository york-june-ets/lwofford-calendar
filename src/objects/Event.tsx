import { Invite } from "./Invite"

interface Event {
	id: string | undefined
	title: string
	description: string
	timeStart: Date
	timeEnd: Date
	location: string
	invites: Invite[]
}

interface IEventModal {
	event: Event
	setEvent: ( event: Event ) => void
}

const EventModal: React.FC<IEventModal> = ( { event, setEvent } ) => {

	const CommitChanges = async () => {

	}

	return <div className="modal-overlay">
		<div className="event-editor">
			<button
				type="submit"
				onClick={ async () => {
					CommitChanges()
				} }
			></button>
		</div>
	</div>
}
