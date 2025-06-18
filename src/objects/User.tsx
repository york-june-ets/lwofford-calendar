import { createContext, ReactNode, useContext, useState } from "react"

export interface User {
	id: string | undefined
	name: string
	email: string
	passhash: number
}

export interface IUserContext {
	user: User | null
	setUser: (user: User | null) => void
}

export const UserContext = createContext<IUserContext | null>(null)

export const UserProvider: React.FC< { children: ReactNode } > = ( { children } ) => {
	const [ user, setUser ] = useState<User | null>(null)

	return <UserContext.Provider value={ { user, setUser } }>
		{ children }
	</UserContext.Provider>
}

export const useUser = () => {
	const context = useContext(UserContext)
	if (!context) {
		throw new Error("useUser must be used within a UserProvider")
	}
	return context
}

export function getUserEmailQuery(user: User): string {
	return `users?email=${user.email}`
}

export function getUserIdQuery(user: User): string {
  return `users/${ user.id }`
}

export function checkUserPassword(user: User, password: string): boolean {
	return user.passhash === stringHash(password)
}

export function validateEmail(email: string): string | null {
	if (email.length === 0) return "Please enter a valid email."
	if (email.search("@") === -1) return "Please enter a valid email."
	return null
}

export function validatePassword(password: string): string | null {
	if (password.length < 8) return "Password must be at least 8 characters long."
	return null
}

export function validateName( name: string ): string | null {
	if ( name.length === 0 ) return "Please enter a name."
	return null
}

export function stringHash(str: string): number {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i)
  }
  return hash >>> 0
}