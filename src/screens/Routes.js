import React from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route
} from "react-router-dom";
import { Home, Login, Profile } from './index';
import PrivateRoute from './../common/PrivateRoute';

const Routes = (props) => {
	console.log(props.history)
	return (
		<Router>
			<Switch>
				<Route exact path="/" render={({ history }, props) => <Login history={history} />}>

				</Route>
				<PrivateRoute component={Home} path="/home" />
				<PrivateRoute component={Profile} path="/profile" />
			</Switch>
		</Router>
	)
}

export default Routes;