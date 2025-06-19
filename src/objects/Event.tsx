import './Event.css'
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react"
import FancyTextArea from "../elements/FancyTextArea"
import { EInviteStatus, Invite, STATUS_COLORS } from "./Invite"
import { User, useUser } from "./User"
import { DBget, DBpatch, DBpost } from "../Fetch"

export interface Event {
	id: string | undefined
	title: string
	description: string
	date: string
	location: string
	invites: Invite[]
}

export interface IEventContext {
	event: Event | null
	setEvent: (event: Event | null) => void
}

export const EventContext = createContext<IEventContext | null>(null)

export const EventProvider: React.FC< { children: ReactNode } > = ( { children } ) => {
	const [ event, setEvent ] = useState<Event | null>(null)

	return <EventContext.Provider value={ { event, setEvent } }>
		{ children }
	</EventContext.Provider>
}

export const useEvent = () => {
	const context = useContext(EventContext)
	if (!context) {
		throw new Error("useEvent must be used within a EventProvider")
	}
	return context
}


export const CreateNewEvent = async ( owner: User ): Promise<Event> => {
	const ownerInvite: Invite = {
		userId: owner.id!,
		status: EInviteStatus.OWNER,
	}
	const result: Event = {
		id: undefined,
		title: "",
		description: "",
		date: new Date().toLocaleDateString(),
		location: "",
		invites: [ ownerInvite ],
	}
	
	const response = await DBpost<Event>( "events", result )
	// result.id = ( await DBget<Event[]>( getUserEmailQuery( newUser ) ) )[0].id
	result.id = response.id
	console.log(result)

	return result
}

interface IEventCalendarTile {
	event: Event
}

export const EventCalendarTile: React.FC<IEventCalendarTile> = ( { event }  ) => {
	const { setEvent } = useEvent()

	return <div
		className="event-tile"
		onClick={ () => {
			setEvent( event )
		} }
	>
		<h5>{ event.title !== "" ? event.title : "New Event" }</h5>
		{/* <p>{ event.date.toString() }</p> */}
	</div>
}

export const EventModal: React.FC = () => {
	const { user } = useUser()
	const { event, setEvent } = useEvent()

	const userIsOwner = true

	const [ title, setTitle ] = useState<string>( event!.title )
	const [ description, setDescription ] = useState<string>( event!.description )
	const [ location, setLocation ] = useState<string>( event!.location )
	const [ date, setDate ] = useState<string>( event!.date )
	const [ invites, setInvites ] = useState<Invite[]>( event!.invites )

	const [ inviteText, setInviteText ] = useState<string>("")

	const CommitChanges = async () => {
		event!.title = title
		event!.description = description
		event!.location = location
		event!.date = date
		event!.invites = invites

		const response = DBpatch( getEventIdQuery( event! ), event )
		setEvent( event! )
	}

	const DeleteNote = async () => {
		setEvent( null )
	}

	const AddInvite = async ( invite: string, status = EInviteStatus.INVITED ) => {

	}

	return <div className="modal-overlay">
		<div className="editor">
			<button
				type="submit"
				onClick={ async () => {
					if (userIsOwner) {
						CommitChanges()
					}
					setEvent( null )
				} }
			>{ userIsOwner ? "Save & Close" : "Close" }</button>
			<FancyTextArea
				editable={ userIsOwner }
				id="title-textarea"
				placeholder="New Event"
				value={ title }
				onChange={ (e) => {
					setTitle( e.target.value )
				} }
			/>
			<FancyTextArea
				editable={ userIsOwner }
				placeholder="Description..."
				value={ description }
				onChange={ (e) => {
					setDescription( e.target.value )
				} }
			/>
			<h4>Date</h4>
			<input
				type='date'
				value={ date }
				onChange={ (e) => {
					console.log( e.target.value )
					setDate( e.target.value )
				} }
			/>
			<h4>Location</h4>
			<FancyTextArea
				editable={ userIsOwner }
				placeholder="Location..."
				value={ location }
				onChange={ (e) => {
					setLocation( e.target.value )
				} }
			/>
			<h4>Invitees</h4>
			<div className="invite-list">{
				// invites.map( ( invite ) => {
				// 	const inviteUser = await DBget<User>( `users/${ invite.userId }` )

				// 	return <p
				// 		className="invite-tag"
				// 		style={ { backgroundColor: STATUS_COLORS[ invite.status ] } }
				// 		title={ `${inviteUser.name} <${ inviteUser.email }>: ${ STATUS_COLORS[ invite.status ] }` }
				// 	>{ inviteUser.name }</p>
				// } )
			}</div>
			{ userIsOwner && <>
				<form
					onSubmit={ (e) => {
						e.preventDefault()
						AddInvite( inviteText )
					} }
				>
					<input
						type="text"
						placeholder="Invite someone..."
						value={ inviteText }
						onChange={ (e) => {
							setInviteText( e.target.value )
						} }
					/>
				</form>
				<button 
					type="submit"
					onClick={ async () => {
						await AddInvite( inviteText )
					} }
				>Send Invite</button>
				<button
					onClick={ () => {
						DeleteNote()
					} }
				>Delete</button>
			</> }
		</div>
	</div>
}

export function getEventIdQuery( event: Event ): string {
	return `events/${ event.id }`
}
