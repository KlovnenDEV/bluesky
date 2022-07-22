import React, { useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import RandomMC from 'random-material-color';
import {
	makeStyles,
	Avatar,
	TextField,
    ButtonGroup,
	Button,
	Switch,
	FormGroup,
    FormControlLabel,
    Fade,
    Paper,
} from '@material-ui/core';
import InputMask from 'react-input-mask';
import { createContact } from './actions';
import { showAlert } from '../../actions/alertActions';
import { Modal, ColorPicker } from '../../components';

const useStyles = makeStyles(theme => ({
	wrapper: {
		height: '100%',
		background: theme.palette.secondary.main,
		overflowY: 'auto',
		overflowX: 'hidden',
		padding: 10,
		'&::-webkit-scrollbar': {
			width: 6,
		},
		'&::-webkit-scrollbar-thumb': {
			background: '#ffffff52',
		},
		'&::-webkit-scrollbar-thumb:hover': {
			background: theme.palette.primary.main,
		},
		'&::-webkit-scrollbar-track': {
			background: 'transparent',
		},
    },
    avatar: {
        height: 100,
        width: 100,
        fontSize: 35,
        color: theme.palette.text.light,
        position: 'absolute',
        left: 0,
        right: 0,
        top: '10%',
        display: 'block',
        textAlign: 'center',
        lineHeight: '100px',
        margin: 'auto',
        '&:hover': {
            filter: 'brightness(0.6)',
            transition: 'filter ease-in 0.15s',
            cursor: 'pointer',
        }
    },
    avatarFav: {
        height: 100,
        width: 100,
        fontSize: 35,
        color: theme.palette.text.light,
        position: 'absolute',
        left: 0,
        right: 0,
        top: '10%',
        display: 'block',
        textAlign: 'center',
        lineHeight: '100px',
        margin: 'auto',
        border: '2px solid gold',
        '&:hover': {
            filter: 'brightness(0.6)',
            transition: 'filter ease-in 0.15s',
            cursor: 'pointer',
        }
    },
    contactHeader: {
        padding: 20,    
        background: theme.palette.secondary.dark,
        borderRadius: 10,
        marginBottom: 25,
    },
    editBody: {
        padding: 20,
        background: theme.palette.secondary.dark,
        borderRadius: 10,
        width: '100%',
        margin: '55px auto 0 auto',
    },
    editField: {
        width: '100%',
        marginBottom: 20,
        fontSize: 20,
    },
    buttons: {
        width: '100%',
        display: 'flex',
        margin: 'auto',
    },
    buttonNegative: {
        width: '-webkit-fill-available',
        padding: 20,
        color: theme.palette.error.main,
        '&:hover': {
            backgroundColor: `${theme.palette.error.main}14`
        }
    },
    buttonPositive: {
        width: '-webkit-fill-available',
        padding: 20,
        color: theme.palette.error.dark,
        '&:hover': {
            backgroundColor: `${theme.palette.error.dark}14`
        }
    },
    editAvatar: {
        position: 'absolute',
        background: theme.palette.secondary.main,
        padding: 25,
        width: '70%',
        left: 0,
        right: 0,
        margin: 'auto',
        zIndex: 15,
    },
    colorPreview: {
        marginBottom: 10,
    },
    colorLabel: {
        color: theme.palette.text.main,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    colorDisplay: {
        width: '100%',
        height: 45,
        border: `1px solid ${theme.palette.text.main}`
    }
}));

export default connect(null, { createContact, showAlert })(props => {
	const classes = useStyles();
    const navigate = useNavigate()
    const contacts = useSelector(state => state.data.data).contacts;
    const { number } = props.match.params;
	const [contact, setContact] = useState({ name: '', number: number == null ? '' : number, favorite: false, color: RandomMC.getColor(), avatar: '' });

    const [colorSelection, setColorSelection] = useState(false);
    const [avatarSelection, setAvatarSelection] = useState(false);

	const onChange = e => {
        if(e.hex != null) {
            setContact({
                ...contact,
                color: e.hex
            })
        } else {
            switch (e.target.name) {
                case 'favorite':
                    setContact({
                        ...contact,
                        [e.target.name]: e.target.checked,
                    });
                    break;
                default:
                    setContact({
                        ...contact,
                        [e.target.name]: e.target.value,
                    });
                    break;
            }
        }
	};

	const onSubmit = (e) => {
        setAvatarSelection(false);
        e.preventDefault();

        if (contacts.filter(c => c.number === contact.number).length > 0) {
            props.showAlert('Contact Already Exists For This Number');
        } else {
            props.createContact(contact);
            props.showAlert(`${contact.name} Created`);
			history.goBack();
        }
    };

    const removeImage = () => {
        props.showAlert('Avatar Image Removed');
        setAvatarSelection(false);
        setContact({
            ...contact,
            avatar: '',
        });
    }

	return (
		<div className={classes.wrapper}>
            <Fade in={true}>
                <div>
                    <Paper className={classes.editBody}>
                        { contact.avatar != null && contact.avatar !== '' ?
                        <Avatar
                            className={contact.favorite ? classes.avatarFav : classes.avatar}
                            src={contact.avatar}
                            alt={contact.name.charAt(0)}
                            onClick={() => setAvatarSelection(true)}
                        >
                            +
                        </Avatar> :
                        <Avatar
                            className={contact.favorite ? classes.avatarFav : classes.avatar}
                            style={{
                                background: contact.color,
                            }}
                            onClick={() => setAvatarSelection(true)}
                        >
                            +
                        </Avatar> }
                        <div style={{ textAlign: 'center' }}><h1>Contact Details</h1></div>
                        <form autoComplete="off" onSubmit={onSubmit} id='contact-form'>
                            <TextField
                                className={classes.editField}
                                label='Name'
                                name="name"
                                type="text"
                                required
                                value={contact.name}
                                onChange={onChange}
                                InputLabelProps={{
                                    style: { fontSize: 20 }
                                }}
                            />
                            <InputMask
                                mask="999-999-9999"
                                value={contact.number}
                                onChange={onChange}
                            >
                                {() => (
                                    <TextField
                                        className={classes.editField}
                                        label="Number"
                                        name="number"
                                        type="text"
                                        required
                                        InputLabelProps={{
                                            style: { fontSize: 20 }
                                        }}
                                    />
                                )}
                            </InputMask>
                            <div className={classes.colorPreview}>
                                <div className={classes.colorLabel}>Contact Color *</div>
                                <div className={classes.colorDisplay} style={{ background: contact.color }} onClick={() => setColorSelection(true)}></div>
                            </div>
                            <FormGroup row>
                                <FormControlLabel
                                    style={{ width: '100%' }}
                                    control={
                                        <Switch
                                            checked={contact.favorite}
                                            onChange={onChange}
                                            value='favorite'
                                            name='favorite'
                                            color='primary'
                                        />
                                    }
                                    label='Favorite'
                                />
                            </FormGroup>
                        </form>
                    </Paper>
                    <ButtonGroup variant="text" color="primary" className={classes.buttons} style={{ margin: 'auto' }}>
                        <Button className={classes.buttonNegative} onClick={() => history.goBack()}>Cancel</Button>
                        <Button className={classes.buttonPositive} type='submit' form='contact-form'>Save</Button>
                    </ButtonGroup>

                    <Modal open={avatarSelection} handleClose={() => setAvatarSelection(false)} title='Avatar'>
                        <TextField
                            className={classes.editField}
                            label="Link"
                            name="avatar"
                            type="text"
                            onChange={onChange}
                            value={contact.avatar}
                            InputLabelProps={{
                                style: { fontSize: 20 }
                            }}
                        />
                        <ButtonGroup variant='text' color="primary" className={classes.buttons}>
                            { contact.avatar != null && contact.avatar !== '' ? <Button className={classes.buttonNegative} onClick={removeImage}>Delete</Button> : null }
                            <Button className={classes.buttonPositive} onClick={() => setAvatarSelection(false)} >Done</Button>
                        </ButtonGroup>
                    </Modal>

                    <Modal open={colorSelection} handleClose={() => setColorSelection(false)} title='Contact Color'>
                        <ColorPicker color={contact.color} onChange={onChange} onSave={() => setColorSelection(false)} />
                    </Modal>
                </div>
            </Fade>
		</div>
	);
});
