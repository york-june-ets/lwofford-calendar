import React, { ChangeEvent } from "react";

interface IFancyTextArea {
	value: string
	onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void
	editable?: boolean
	id?: string
	placeholder?: string
}

const FancyTextArea: React.FC<IFancyTextArea> = ({
	value,
	onChange,
	id,
	editable = true,
	placeholder = "Write something down..."
}) => {
	const textAreaRef = React.useRef<HTMLTextAreaElement | null>(null)

	const handleInput = (event: ChangeEvent<HTMLTextAreaElement>) => {
		const textAreaElement = textAreaRef.current
		if (textAreaElement) {
			textAreaElement.style.height = "auto"
			textAreaElement.style.height = `${textAreaElement.scrollHeight}px`
		}
		onChange(event)
	}

	return <textarea
		contentEditable={ editable }
		className="auto-textarea"
		id={id}
		ref={textAreaRef}
		value={value}
		onChange={handleInput}
		placeholder={placeholder}
	/>
}

export default FancyTextArea
