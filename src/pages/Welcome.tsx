import { useState } from "react"
import { checkUserPassword, getUserEmailQuery, stringHash, User, useUser, validateEmail, validateName, validatePassword } from "../objects/User"
import ErrorMessage from "../elements/ErrorMessage"
import { DBget, DBpost } from "../Fetch"
import { EPage, usePage } from "../objects/Page"

export const WelcomePage: React.FC = () => {
	const { user, setUser } = useUser()
	const { page, setPage } = usePage()

	const [ inputEmail, setInputEmail ] = useState<string>("")
	const [ inputPassword, setInputPassword ] = useState<string>("")
	const [ inputName, setInputName ] = useState<string>("")
	
	const [ isCreatingNewUser, setIsCreatingNewUser ] = useState<boolean>(false)
	
	const [ errorMessage, setErrorMessage ] = useState<string | null>("")

	async function LoginOrRegister() {
		const query : string = `users?email=${ inputEmail }`
		const matchedUser : User | undefined = ( await DBget<User[]>(query) )[0]

		if ( matchedUser === undefined ) {
			setIsCreatingNewUser( true )
			return
		} else {
			setIsCreatingNewUser( false )
			Login( matchedUser )
		}
	}

	function Login( asUser: User ) {
		if ( checkUserPassword( asUser, inputPassword ) ) {
			setUser( asUser )
			setPage( EPage.CALENDAR ) 
			setInputPassword("")
			setErrorMessage(null)
		} else {
			setErrorMessage( "Incorrect password for an existing user." )
		}
	}
	
	async function Register() {
		setInputPassword("")
		
		const query : string = "users"
		const newUser : User = { id: undefined, email: inputEmail, passhash: stringHash( inputPassword ), name: inputName }

		const response = await DBpost<User>( query, newUser )
		newUser.id = ( await DBget<User[]>( getUserEmailQuery( newUser ) ) )[0].id

		setUser( newUser )
		setPage( EPage.CALENDAR )

		setErrorMessage(null)
	}

	return <main className="page">
		{ user === null && <>
			<h1>Welcome</h1>
			<p>Email</p>
			<input
				type="email"
				value={ inputEmail }
				onChange={ (e) => {
					setInputEmail( e.target.value )
					setIsCreatingNewUser( false )
					setErrorMessage( validateEmail( e.target.value ) )
				} }
			/>
			<p>Password</p>
			<form
				onSubmit={ (e) => {
					e.preventDefault()
					LoginOrRegister()
				} }
			>
				<input
				type="password"
				value={ inputPassword }
				onChange={ (e) => {
					setInputPassword( e.target.value )
					setIsCreatingNewUser( false )
					setErrorMessage( validatePassword( e.target.value ) )
				} }
				
				/>
			</form>
			<button
				onClick={ () => {
					LoginOrRegister()
				} }
			>Login or register</button>
			{ isCreatingNewUser && <>
				<p>You are creating a new user. We need some extra details to get started.</p>
				<p>Display Name</p>
				<form
					onSubmit={ (e) => {
						e.preventDefault()
						Register()
					} }
				>
					<input
						type="text"
						placeholder="Display Name..."
						value={ inputName }
						onChange={ (e) => {
							setInputName( e.target.value )
							setErrorMessage( validateName( e.target.value ) )
						} }
					/>
				</form>
				<button
					onClick={ () => {
						Register()
					} }
				>Register</button>
			</>	}
			<ErrorMessage message={ errorMessage }/>
		</> }
		{ user !== null && <>
			<h1>Welcome, { user.name }</h1>
			<button
				onClick={ () => {
					setUser( null )
				} }
			>Logout</button>
		</> }
	</main>
}