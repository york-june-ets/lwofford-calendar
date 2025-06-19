import { useEffect, useState } from "react"
import { DBget } from "../Fetch"
import { User } from "./User"

export enum EInviteStatus {
	OWNER,
	INVITED,
	ACCEPTED,
	DECLINED,
}

export const STATUS_COLORS = [
	"#B5D2F3",
	"#F9FAFB",
	"#5CEBAD",
	"#F6ACA2",
]

export const STATUS_LABELS = [
	"Owner",
	"Invited",
	"Accepted",
	"Declined"
]

export interface Invite {
	user: string
	status: EInviteStatus
}

interface IInviteListItem {
	invite: Invite
}

export const InviteListItem: React.FC<IInviteListItem> = ( { invite } ) => {
	const [ user, setUser ] = useState<User | undefined>(undefined)
	
	useEffect( () => {
		const getUser = async () => {
			try {
				const response = await DBget<User>( `users/${ invite.user }` )
				setUser( response )
			} catch ( err ) {
				console.error( err )
			}
		}
		getUser()
	}, [])

	if ( user === undefined ) return <p className="invite-tag">...</p>

	return <p
		className="invite-tag"
		style={ { backgroundColor: STATUS_COLORS[ invite.status ] } }
		title={ `(${ STATUS_LABELS[ invite.status ] }) ${user!.name} <${ user!.email }>` }
	>{ user!.name }</p>
}
