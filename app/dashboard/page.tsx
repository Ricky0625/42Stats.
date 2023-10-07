'use client'

import React from "react";
import Loading from "../loading";

async function getUsers() {
	const res = await fetch(`/api/blackhole`);
	const resJson = await res.json()
	return resJson
}

export default function DashBoard() {
	const [users, setUsers] = React.useState([]);
	
	React.useEffect(() => {
		const fetchData = async () => {
			return await getUsers()
		}

		fetchData().then((res) => {
			setUsers(res);
		})
	}, [])

	React.useEffect(() => {
		console.log(users)
	}, [users])
	return (
		<Loading />
	)
}
