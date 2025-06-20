import './Event.css'
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react"
import FancyTextArea from "../elements/FancyTextArea"
import { EInviteStatus, Invite, InviteListItem, STATUS_COLORS } from "./Invite"
import { User, useUser } from "./User"
import { DBdelete, DBget, DBpatch, DBpost } from "../Fetch"
import ValidationButton from '../elements/ErrorMessage'

export interface Event {
	id: string | undefined
	title: string
	description: string
	dateTimeStart: Date
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
		user: owner.id!,
		status: EInviteStatus.OWNER,
	}
	const result: Event = {
		id: undefined,
		title: "",
		description: "",
		dateTimeStart: new Date(),
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
	
	const [ title, setTitle ] = useState<string>( event!.title )
	const [ description, setDescription ] = useState<string>( event!.description )
	const [ location, setLocation ] = useState<string>( event!.location )
	const [ dateTimeStart, setDateTimeStart ] = useState<Date>( new Date( event!.dateTimeStart ) )
	const [ invites, setInvites ] = useState<Invite[]>( event!.invites )
	
	const [ inviteText, setInviteText ] = useState<string>("")
	const [ inviteError, setInviteError ] = useState<string | null>( null )
	
	const [ myInvite, setMyInvite ] = useState<Invite | undefined>(
		event!.invites.reduce<Invite | undefined>( (r, i) => {
			if ( user!.id !== i.user ) return r
			return i
		}, undefined )
	)	
	
	const userIsOwner = myInvite && myInvite.status === EInviteStatus.OWNER	
	const userIsInvited = myInvite && !userIsOwner

	const CommitChanges = async () => {
		event!.title = title
		event!.description = description
		event!.location = location
		event!.dateTimeStart = dateTimeStart
		event!.invites = invites

		const response = DBpatch<Event>( getEventIdQuery( event! ), event )
	}

	const DeleteEvent = async () => {
		setEvent( null )

		await DBdelete( getEventIdQuery( event! ) )
	}

	const AddInvite = async ( invite: string, status = EInviteStatus.INVITED ) => {
		setInviteText("")
		
		let user : User | undefined
		if (user === undefined) user = ( await DBget<User[]>( `users?name=${ invite }` ) )[0]
		if (user === undefined) user = ( await DBget<User[]>( `users?email=${ invite }` ) )[0]

		if (user === undefined) {
			setInviteError( `No known user by the name/email '${ invite }'.` )
			return
		}
		if ( invites.some( ( invite ) => invite.user === user!.id ) ) {
			setInviteError( `${ user!.name } has already been invited!` )
			return
		}

		const newInvite : Invite = {
			user: user.id!,
			status: status
		}
		setInvites( [ ...invites, newInvite ] )

		await CommitChanges()
	}

	const UpdateInviteStatus = async ( status: EInviteStatus ) => {
		myInvite!.status = status
		setMyInvite( myInvite! )
		setInvites( [ ...invites.filter( (invite) => {
			return invite.user !== myInvite!.user
		} ), myInvite! ] )
		await CommitChanges()
	}

	return <div className="modal-overlay">
		<div className="editor">
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
			{/* <h4>Date</h4> */}
			<input
				type='datetime-local'
				disabled={ !userIsOwner }
				value={ dateToInputString( dateTimeStart ) }
				onChange={ (e) => {
					setDateTimeStart( new Date( e.target.value ) )
				} }
			/>
			<h2>Location</h2>
			<FancyTextArea
				editable={ userIsOwner }
				placeholder="Location..."
				value={ location }
				onChange={ (e) => {
					setLocation( e.target.value )
				} }
			/>
			<h2>Invitees</h2>
			<div className="invite-list">{
				invites.map( ( invite ) => {
					return <InviteListItem key={ invite.user } invite={ invite } />
				} )
			} </div>
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
							setInviteError( null )
						} }
					/>
				</form>
				<ValidationButton
					errorMessage={ inviteError }
					buttonLabel='Send Invite'
					buttonOnClick={ async () => {
						await AddInvite( inviteText )
					} }
				/>
				<button
					onClick={ () => {
						DeleteEvent()
					} }
				>Delete</button>
			</> }
			{ userIsInvited && <>
				<button
					onClick={ () => {
						UpdateInviteStatus( EInviteStatus.ACCEPTED )
					} }
					>Accept</button>
				<button
					onClick={ () => {
						UpdateInviteStatus( EInviteStatus.DECLINED )
					} }
				>Decline</button>
			</> }
			<button
				type="submit"
				onClick={ async () => {
					if (userIsOwner) {
						await CommitChanges()
					}
					setEvent( null )
				} }
			>{ userIsOwner ? "Save & Close" : "Close" }</button>
		</div>
	</div>
}

export function getEventIdQuery( event: Event ): string {
	return `events/${ event.id }`
}

function dateToInputString( date: Date ): string {
  const pad = (n: number) => n.toString().padStart(2, '0')

  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  const hours = pad(date.getHours())
  const minutes = pad(date.getMinutes())

  return `${year}-${month}-${day}T${hours}:${minutes}`
}
