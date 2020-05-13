import React, { Component } from 'react';
import { LoggedInHeader } from './../../components';

import { Grid, withStyles, Container } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';

import { fetchUserMedia } from './../../api';

const useStyles = theme => ({
	root: {
		marginTop: '2rem'
	},
	paper: {
		padding: theme.spacing(2),
		textAlign: 'center',
		color: theme.palette.text.secondary,
	},
	media: {
		height: 0,
		paddingTop: '56.25%', // 16:9
	},
	expand: {
		transform: 'rotate(0deg)',
		marginLeft: 'auto',
		transition: theme.transitions.create('transform', {
			duration: theme.transitions.duration.shortest,
		}),
	},
	expandOpen: {
		transform: 'rotate(180deg)',
	},
	hashtag: {
		color: 'skyblue'
	},
	fillColor: {
		color: 'red'
	}
});


class Home extends Component {

	constructor() {
		super();
		this.state = {
			userMedia: []
		};
	}
	componentWillMount() {
		this.loadUserMedia();
	}

	loadUserMedia = async () => {
		let data = await fetchUserMedia();
		console.log(data)
		this.setState({ userMedia: data })
	}

	addFavorite = (id) => {
		let items = this.state.userMedia.map((item) => {
			let modifiedItem = item;

			if (!modifiedItem.hasOwnProperty('isFavorite')) {
				modifiedItem.isFavorite = false;
			}

			if (modifiedItem.id === id) {
				modifiedItem.isFavorite = !modifiedItem.isFavorite;
				modifiedItem.isFavorite ? ++modifiedItem.likes.count : --modifiedItem.likes.count;
			}
			return modifiedItem;
		});
		console.log('items', items)
		this.setState({
			userMedia: items
		});
	}

	render() {
		const { classes, history } = this.props;
		let profile_picture = null;
		if (this.state.userMedia[0]) {
			let { user } = this.state.userMedia[0];
			profile_picture = user.profile_picture
		}

		if (!profile_picture) {
			return <div>Loading....</div>
		}
		return (
			<div>
				<LoggedInHeader profile_picture={profile_picture} history={history} />
				<Container className={classes.root}>
					<Grid container spacing={2} >

						{
							this.state.userMedia.map(((user, index) => {
								let text = user.caption.text.split("#");
								let caption = text[0];
								let hashtags = text.splice(1);
								return (<Grid item xs={12} sm={6} key={user.created_time}>
									<Card className={classes.root}>
										<CardHeader
											avatar={
												<Avatar aria-label="recipe" className={classes.avatar}>
													<img src={user.user.profile_picture} alt="profile" />
												</Avatar>
											}
											title={user.user.username}
											subheader={new Date(parseInt(user.created_time)).toLocaleString()}
										/>
										<CardMedia
											className={classes.media}
											image={user.images.standard_resolution.url}
											title="Paella dish"
										/>
										<CardContent>
											<Typography variant="body2" component="p">
												{caption}
											</Typography>
											{
												hashtags.map((value) => {
													return (<Typography key={"hashtag" + value} variant="body2" component="span" className={classes.hashtag}>
														#{value}
													</Typography>)
												})
											}

										</CardContent>
										<CardActions disableSpacing>
											<IconButton aria-label="add to favorites" onClick={this.addFavorite.bind(this, user.id)}>
												{user.isFavorite ? <FavoriteIcon className={classes.fillColor} /> : <FavoriteBorderIcon />}
											</IconButton>
											<Typography variant="body2" component="p">
												{user.likes.count} likes
											</Typography>
										</CardActions>
									</Card>
								</Grid>)
							}))
						}
					</Grid>
				</Container>
			</div >
		)
	}

}

export default withStyles(useStyles)(Home);