import './App.css';
import { CurrentPage, EPage, PageProvider, usePage } from './objects/Page';
import { UserProvider, useUser } from './objects/User';

function App() {
	return <div className='App-container'>
		<PageProvider pageDefault={ EPage.WELCOME }>
			<UserProvider>
				<Navbar/>
				<CurrentPage/>
			</UserProvider>
		</PageProvider>
	</div>
}

const Navbar: React.FC = () => {
	const { user } = useUser()
	const { setPage } = usePage()

	return <> { user !== null &&
	<nav>
		<button onClick={ () => setPage( EPage.WELCOME ) }>Welcome</button>
		<button onClick={ () => setPage( EPage.CALENDAR ) }>Calendar</button>
		<button onClick={ () => setPage( EPage.EVENTS ) }>List</button>
		<button onClick={ () => setPage( EPage.SETTINGS ) }>Settings</button>
	</nav>
	} </>
}

export default App;
