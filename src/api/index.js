import { getUserToken } from './../common/utils';
import axios from 'axios';

let API_URL = 'https://api.instagram.com/v1/users/self/';

export const fetchUserMedia = async () => {
	let token = getUserToken();
	try {
		if (getUserToken) {
			const apiURL = `${API_URL}media/recent?access_token=${token}`;
			let { data: { data } } = await axios.get(apiURL);
			//extract the response data which has data ,returned the array of user with images
			return data;
		}
	}
	catch (e) {
		console.log(e);
	}
}

export const fetchUserProfile = async () => {
	let token = getUserToken();
	try {
		if (getUserToken) {
			const apiURL = `${API_URL}?access_token=${token}`;
			let { data: { data } } = await axios.get(apiURL);
			//extract the response data which has data ,returned the array of user with images
			return data;
		}
	}
	catch (e) {
		console.log(e);
	}
}