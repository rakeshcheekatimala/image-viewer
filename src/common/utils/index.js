export const isUserLoggedIn = () => {
	return sessionStorage.getItem('access-token') ? true : false
}

export const userLogout = () => {
	sessionStorage.clear();//remove all the keys stored
}