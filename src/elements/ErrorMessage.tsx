
interface IErrorMessage {
	message: string | null
}

const ErrorMessage: React.FC<IErrorMessage> = ( { message } ) => {
	return <>
		{ message !== null &&
			<p className="error-message">{ message }</p>
		}
	</>
}

export default ErrorMessage