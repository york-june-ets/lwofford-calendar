
interface IErrorMessage {
	errorMessage: string | null
	buttonLabel?: string | undefined
	buttonOnClick?: () => void
}

const ValidationButton: React.FC<IErrorMessage> = ( {
	errorMessage,
	buttonLabel=undefined,
	buttonOnClick=undefined
} ) => {
	return <>
		{ errorMessage !== null &&
			<p className="error-message">{ errorMessage }</p>
		}
		{ errorMessage === null && buttonLabel !== undefined &&
			<button
				onClick={ buttonOnClick }
			>{ buttonLabel }</button>
		}
	</>
}

export default ValidationButton