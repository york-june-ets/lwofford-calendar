import './Settings.css'

import { useState } from "react"
import ValidationButton from "../elements/ErrorMessage"
import { EPage, usePage } from "../objects/Page"
import { getUserIdQuery, stringHash, User, useUser, validateEmail, validatePassword } from "../objects/User"
import { DBdelete, DBget, DBpatch } from "../Fetch"

export const SettingsPage: React.FC = () => {
	const { user, setUser } = useUser()
	const { setPage } = usePage()

	const [inputName, setInputName] = useState<string>( user!.name )
	const [inputEmail, setInputEmail] = useState<string>("")
	const [inputPasswordOld, setInputPasswordOld] = useState<string>("")
	const [inputPasswordNew, setInputPasswordNew] = useState<string>("")
	const [errorEmail, setErrorEmail] = useState<string | null>("")
	const [errorPassword, setErrorPassword] = useState<string | null>("")
	const [errorDelete, setErrorDelete] = useState<string | null>(null)
	const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false)

	const TryUpdateEmail = async () => {
		if ( user!.email === inputEmail ) {
			setErrorEmail( "New email isn't actually new." )
			return
		}
		if ( ( await DBget<User[]>( `users?email=${ inputEmail }` ) )[0] !== undefined ) {
			setErrorEmail( "New email already belongs to an existing user." )
			return
		}

		user!.email = inputEmail
		const response = await DBpatch( getUserIdQuery(user!), { email: inputEmail } )

		setInputEmail("")
		setErrorEmail("")
	}

	const TryUpdatePassword = async () => {
		const oldHash = stringHash( inputPasswordOld )
		const newHash = stringHash( inputPasswordNew )

		if ( user!.passhash !== oldHash ) {
			setErrorPassword( "Old password is incorrect." )
			return	
		}
		if ( user!.passhash === newHash ) {
			setErrorPassword( "New password can't be the same as the old password." )
			return	
		}

		user!.passhash = newHash
		const response = await DBpatch( getUserIdQuery(user!), { passhash: newHash } )

		setInputPasswordOld("")
		setInputPasswordNew("")
		setErrorPassword("")
	}

	const TryDeleteUser = async () => {
		const response = await DBdelete( getUserIdQuery( user! ) )
		setUser( null )
		setPage( EPage.WELCOME )
	}

	return <>
		<h1>Settings</h1>
		<div className="setting">
			<h2>Name</h2>
			<input
				type="text"
				value={ inputName }
				onChange={ async (e) => {
					setInputName( e.target.value )

					user!.name = e.target.value
					const response = await DBpatch( getUserIdQuery(user!), { name: e.target.value } )
				} }
			/>
		</div>
		<div className="setting">
			<h2>Email</h2>
			<p>Current Email:</p>
			<p>{ user!.email }</p>
			<p>New Email:</p>
			<input
				type="email"
				value={ inputEmail }
				onChange={ (e) => {
					setInputEmail( e.target.value )
					setErrorEmail( validateEmail( e.target.value ) )
				} }
			/>
			<ValidationButton
				errorMessage={ errorEmail }
				buttonLabel="Update Email"
				buttonOnClick={ TryUpdateEmail }
			/>	
		</div>
		<div className="setting">
			<h2>Password</h2>
			<p>Current password:</p>
			<input
				type="password"
				value={ inputPasswordOld }
				onChange={ (e) => {
					setInputPasswordOld( e.target.value )
					setErrorPassword("")
					setErrorDelete(null)
				} }
			/>
			<p>New password:</p>
			<input
				type="password"
				value={ inputPasswordNew }
				onChange={ (e) => {
					setInputPasswordNew( e.target.value )
					setErrorPassword( validatePassword( e.target.value ) )
				} }
			/>
			<ValidationButton
				errorMessage={ errorPassword }
				buttonLabel="Change Password"
				buttonOnClick={ TryUpdatePassword }
			/>
		</div>
		<div className="setting">
			<h2>Account Deletion</h2>
			<ValidationButton
				errorMessage={ errorDelete }
				buttonLabel="Delete My Account"
				buttonOnClick={ () => {
					if (user!.passhash !== stringHash(inputPasswordOld)) {
						setErrorDelete("Current password is incorrect. Go to the password change section and enter your current password.")
						return
					}
					setDeleteConfirm(true)
				} }
			/>
		</div>
		{ deleteConfirm &&
		<div className="modal-overlay">
			<div className="notification">
				<h2>WARNING!</h2>
				<p>This will instantly delete your accoount! Are you sure you want to delete?</p>
				<div>
					<button
						type="button"
						onClick={ () => {
							setDeleteConfirm(false)
						} }
					>No, lol jk jk</button>
					<button
						type="submit"
						onClick={ () => {
							TryDeleteUser()
						} }
					>Yes, Delete</button>
				</div>
			</div>
		</div> }
	</>
}