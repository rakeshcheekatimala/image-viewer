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
import ShareIcon from '@material-ui/icons/Share';
import MoreVertIcon from '@material-ui/icons/MoreVert';

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

	render() {
		const { classes } = this.props;
		return (
			<div>
				<LoggedInHeader />
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
											action={
												<IconButton aria-label="settings">
													<MoreVertIcon />
												</IconButton>
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
											<Typography variant="body2" color="textSecondary" component="p">
												{caption}
											</Typography>
										</CardContent>
										<CardActions disableSpacing>
											<IconButton aria-label="add to favorites">
												<FavoriteIcon />
											</IconButton>
											<IconButton aria-label="share">
												<ShareIcon />
											</IconButton>

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