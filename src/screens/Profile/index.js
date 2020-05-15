import React, { Component } from 'react';
import { LoggedInHeader, ProfileHeader } from './../../components';

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
import { FormControl, InputLabel, Input, FormHelperText, Button } from '@material-ui/core';
import { fetchUserMedia, fetchUserProfile } from './../../api';
import { updateFavoriteItem, pushComments } from './../../utils';
import Modal from 'react-modal';

const customStyles = {
	content: {
		top: '50%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)'
	}
};

const useStyles = theme => ({
	root: {
		marginTop: '2rem'
	},
	media: {
		height: 0,
		width: '100%',
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
	},
	addComment: {
		display: 'flex',
		justifyContent: 'space-between'
	},
	addCommentFormControl: {
		flexGrow: 1,
		display: 'flex',
		marginRight: '16px'
	},
	mb16: {
		marginBottom: '16px'
	},
	mbt: {
		marginTop: "-16px",
		marginBottom: "16px"
	}
});


class Profile extends Component {

	constructor() {
		super();
		this.state = {
			userMedia: [],
			commentRequired: "dispNone",
			comment: '',
			comments: [],
			selectedUserId: '',
			userProfile: null,
			selectedUser: null,
			isOpen: false
		};
	}

	showModal = (e) => {
		this.setState({
			isOpen: true
		})
	}

	closeModal = (e) => {
		e.preventDefault();
		this.setState({
			isOpen: false
		})
	}

	addFavorite = (id) => {
		let items = updateFavoriteItem(this.state.userMedia, id);
		this.setState({
			userMedia: items
		});
	}

	onChangeHandler = (e, id) => {
		let comment = e.target.value;
		this.setState({
			comment: comment,
			selectedUserId: id
		});
	}

	addCommentHandler = (id) => {
		let { comment } = this.state;
		if (comment.trim() === '') {
			return;
		}
		let items = pushComments(this.state.userMedia, id, comment);
		this.setState({
			comment: "",
			userMedia: items
		});
	}

	componentWillMount() {
		this.loadUserMedia();
		this.loadUserProfile();
	}

	loadUserMedia = async () => {
		let data = await fetchUserMedia();
		this.setState({ userMedia: data })
	}

	loadUserProfile = async () => {
		let data = await fetchUserProfile();
		console.log('loadUserProfile', data);
		this.setState({ userProfile: data })
	}

	onChangeHandler = (e, id) => {
		let comment = e.target.value;
		this.setState({
			comment: comment,
			selectedUserId: id
		});
	}

	onSearchHandler = (e) => {

	}

	showViewHandler = (user) => {
		this.setState({
			selectedUser: user,
			isOpen: true
		});
	}

	render() {
		const { classes, history } = this.props;
		let { commentRequired, selectedUserId, userProfile, selectedUser, isOpen } = this.state;
		let profile_picture = null;
		if (userProfile) {
			profile_picture = userProfile.profile_picture;
		}
		let text = null, caption = null, hashtags = null;
		let user = null;
		if (selectedUser) {
			user = selectedUser;
			text = selectedUser.caption.text.split("#");
			caption = text[0];
			hashtags = text.splice(1);
			var { comments, user: { username } } = user;
		}
		if (!profile_picture) {
			return <div>Loading....</div>
		}
		return (

			<div>
				<LoggedInHeader profile_picture={profile_picture} history={history} onSearchHandler={this.onSearchHandler.bind(this)} showSearchBar={false} />

				<Container className={classes.root}>
					{userProfile && <ProfileHeader userProfile={userProfile} />}

					<Grid container spacing={2} className={classes.root}>

						{
							this.state.userMedia.map(((user, index) => {
								return (<Grid item xs={12} sm={4} key={user.id} onClick={this.showViewHandler.bind(this, user)}>
									<Card>
										<CardMedia
											className={classes.media}
											image={user.images.standard_resolution.url}
											title="Paella dish"
										/>
									</Card>
								</Grid>)
							}))
						}
					</Grid>
				</Container>
				{selectedUser ? (
					<Modal ariaHideApp={false} isOpen={isOpen} contentLabel="Login" onRequestClose={this.closeModal} style={customStyles}>
						<Grid container spacing={3}>
							<Grid item xs={12} sm={6}>
								<img src={selectedUser.images.standard_resolution.url} width="100%" height="100%" alt={caption} />

							</Grid>
							<Grid item xs={12} sm={6}>
								<Card>
									<CardHeader
										avatar={
											<Avatar aria-label="recipe" className={classes.avatar}>
												<img src={profile_picture} alt="profile" />
											</Avatar>
										}
										title={username}
									/>

									<CardContent>
										<hr className={classes.mbt} />
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
										<IconButton aria-label="add to favorites" onClick={this.addFavorite.bind(this, selectedUser.id)}>
											{selectedUser.isFavorite ? <FavoriteIcon className={classes.fillColor} /> : <FavoriteBorderIcon />}
										</IconButton>
										<Typography variant="body2" component="p">
											{selectedUser.likes.count} likes
											</Typography>
										<br />
									</CardActions>
									<CardContent>
										{
											comments.values && comments.values.map((comment, index) => {
												return (<Typography variant="body2" component="p" key={comment + index + selectedUser.id} className={classes.mb16}>
													{username}: &nbsp; {comment}
												</Typography>)
											})
										}
										<br /><br />
										<Grid item xs={12} className={classes.addComment} justify-content="space-between">
											<FormControl className={classes.addCommentFormControl}>
												<InputLabel htmlFor="password"> Add a Comment </InputLabel>
												<Input type="text" onChange={(e) => this.onChangeHandler(e, selectedUser.id)} value={selectedUserId === selectedUser.id ? this.state.comment : ''} />
												<FormHelperText className={commentRequired}><span className="red">required</span></FormHelperText>
											</FormControl>
											<Button variant="contained" color="primary" onClick={this.addCommentHandler.bind(this, selectedUser.id)} className={classes.login__btn}>Add</Button>
										</Grid>
									</CardContent>
								</Card>
							</Grid >
						</Grid>
					</Modal>
				) : null}
			</div >
		)
	}

}

export default withStyles(useStyles)(Profile);