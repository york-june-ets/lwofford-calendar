
const URL : string = "http://localhost:3000/"

async function request<T>( input: RequestInfo, init?: RequestInit ): Promise<T> {
	const response = await fetch(input, {
		headers: { "Content-Type": "application/json" },
		...init
	})
	if (!response.ok) {
		throw new Error(`API error: ${response.status} ${response.statusText}. Request: ${ input } ${ init }`)
	}
	const result = await response.json()
	// console.log(`Response: ${result}`)
	// console.log(result)
	return result
}

export async function DBpost<T>(query: string, obj: any) {
	return await request<T>(
		`${URL + query}`, {
			method: "POST",
			body: JSON.stringify(obj)
		}		
	)
}

export async function DBget<T>(query: string): Promise<T> {
	return await request<T>(URL + query)
}

export async function DBpatch<T>(query: string, obj: any) {
	return await request<T>(
		`${URL + query}`, {
			method: "PATCH",
			body: JSON.stringify(obj)
		}
	)
}

export async function DBdelete<T>(query: string) {
	return await request<T>(
		`${URL + query}`, {
			method: "DELETE"
		}
	)
}
