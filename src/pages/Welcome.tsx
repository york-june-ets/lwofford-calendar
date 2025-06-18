
export const WelcomePage: React.FC = () => {

	function LoginOrRegister() {

	}

	function Login() {
		
	}

	function Register() {
		
	}

	return <main className="page">
		<>
			<h1>Welcome</h1>
			<p>Email</p>
			<input
				type="email"
			/>
			<p>Password</p>
			<input
				type="password"
			/>
			<button>Login or register</button>
			<p>You are creating a new user. We need some extra details to get started.</p>
			<p>Display Name</p>
			<input
				type="text"
				placeholder="Display Name..."
			/>
			<button>Register</button>
		</>
		<>
			<h1>Welcome, Known User</h1>
			<button>Logout</button>
		</>
	</main>
}