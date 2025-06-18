import './App.css';
import { EPage, PageProvider, usePage } from './objects/Page';
import { MainPage } from './pages/Main';
import { NotFoundPage } from './pages/NotFound';
import { SettingsPage } from './pages/Settings';
import { WelcomePage } from './pages/Welcome';

function App() {
	return <PageProvider>
		<Navbar/>
		<CurrentPage/>
	</PageProvider>
}

const CurrentPage: React.FC = () => {
	const { page } = usePage()
	let CurrentPageComponent: React.FC

	const ALL_PAGES = [ WelcomePage, MainPage, SettingsPage ]

	CurrentPageComponent = (page >= 0 && page < ALL_PAGES.length) ? ALL_PAGES[page] : NotFoundPage

	return <CurrentPageComponent/>

}

const Navbar: React.FC = () => {
	// const { user } = useUser()
	const { setPage } = usePage()

	return <> {
	<nav>
		<button onClick={ () => setPage( EPage.WELCOME ) }>Welcome</button>
		<button onClick={ () => setPage( EPage.MAIN ) }>Notes</button>
		<button onClick={ () => setPage( EPage.SETTINGS ) }>Settings</button>
	</nav>
	} </>
}

export default App;
