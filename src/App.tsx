import './App.css';
import { CurrentPage, EPage, PageProvider, usePage } from './objects/Page';

function App() {
	return <PageProvider pageDefault={ EPage.CALENDAR }>
		<Navbar/>
		<CurrentPage/>
	</PageProvider>
}

const Navbar: React.FC = () => {
	// const { user } = useUser()
	const { setPage } = usePage()

	return <> {
	<nav>
		<button onClick={ () => setPage( EPage.WELCOME ) }>Welcome</button>
		<button onClick={ () => setPage( EPage.CALENDAR ) }>Calendar</button>
		<button onClick={ () => setPage( EPage.EVENTS ) }>List</button>
		<button onClick={ () => setPage( EPage.SETTINGS ) }>Settings</button>
	</nav>
	} </>
}

export default App;
