import { getUserToken } from './../common/utils';
import axios from 'axios';

let API_URL = 'https://api.instagram.com/v1/users/self/media/recent?access_token=';

export const fetchUserMedia = async () => {
	let token = getUserToken();
	try {
		if (getUserToken) {
			const apiURL = `${API_URL}${token}`;
			let { data: { data } } = await axios.get(apiURL);
			//extract the response data which has data ,returned the array of user with images
			return data;
		}
	}
	catch (e) {
		console.log(e);
	}
}