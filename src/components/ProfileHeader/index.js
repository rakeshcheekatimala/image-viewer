import React, { useState } from 'react';
import styles from './styles.module.css';
import { Avatar, Typography, withStyles, FormControl, Input, InputLabel, Button } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { pink } from '@material-ui/core/colors';

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

function SimpleModal(props) {

	// getModalStyle is not a pure function, we roll the style only on the first render
	const [isOpen, setIsOpen] = useState(false);
	const [fullname, setFullName] = useState(props.full_name);

	const showModal = (e) => {
		e.preventDefault();
		setIsOpen(true)
	}

	const closeModal = (e) => {
		e.preventDefault();
		setIsOpen(false);
	}

	const onChangeHandler = (e) => {
		e.preventDefault();
		setFullName(e.target.value);
	}

	const updateUsername = (e) => {
		e.preventDefault();
		setIsOpen(false);
		props.onChange(fullname);
	}

	return (
		<div>
			<Avatar className={props.deepPink} onClick={showModal}><EditIcon /></Avatar>
			<Modal ariaHideApp={false} isOpen={isOpen} contentLabel="Login" onRequestClose={closeModal} style={customStyles}>
				<h2>Edit</h2>
				<FormControl required>
					<InputLabel htmlFor="username"> Full Name </InputLabel>
					<Input type="text" name="username" defaultValue={fullname} onChange={onChangeHandler} />
				</FormControl><br /><br />
				<Button variant="contained" color="primary" onClick={updateUsername} >UPDATE</Button>
			</Modal >
		</div>
	);
}

const useStyles = theme => ({
	full_name: {
		marginRight: '10px'
	},
	deepPink: {
		color: theme.palette.getContrastText(pink[500]),
		backgroundColor: pink[500],
	},
})

const ProfileHeader = (props) => {
	let { profile_picture, counts: { follows, followed_by, media }, username } = props.userProfile;
	const { classes } = props;
	const [full_name, setFullName] = useState(props.userProfile.full_name);

	const updateFullname = (value) => {
		setFullName(value);
	}

	return (
		<div className={styles.profile__header}>
			<img src={profile_picture} alt="profile" className={styles.round__image} />
			<div className={styles.profile__header__info}>
				<Typography variant="h6" color="textPrimary">
					{username}
				</Typography>
				<div className={styles.profile__header__followers}>
					<Typography variant="body2" component="p">
						Posts: {media}
					</Typography>
					<Typography variant="body2" component="p">
						Follows: {follows}
					</Typography>
					<Typography variant="body2" component="p">
						Followed By: {followed_by}
					</Typography>
				</div>
				<div className={styles.edit__icon}>
					<Typography variant="body2" component="span" className={classes.full_name}>
						{full_name}
					</Typography>
					<SimpleModal full_name={full_name} onChange={updateFullname} deepPink={classes.deepPink} />
				</div>
			</div>
		</div>
	)
};

export default withStyles(useStyles)(ProfileHeader);
