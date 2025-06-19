import { DBget } from "../Fetch"
import { User } from "./User"

export enum EInviteStatus {
	OWNER,
	INVITED,
	ACCEPTED,
	DECLINED,
}

export const STATUS_COLORS = [
	"green",
	"gray",
	"green",
	"red",
]

export const STATUS_LABELS = [
	"Owner",
	"Invited",
	"Accepted",
	"Declined"
]

export interface Invite {
	userId: string
	status: EInviteStatus
}
