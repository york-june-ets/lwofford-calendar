
export enum EInviteStatus {
	OWNER,
	INVITED,
	ACCEPTED,
	DECLINED,
}

export interface Invite {
	userId: string
	status: EInviteStatus
}