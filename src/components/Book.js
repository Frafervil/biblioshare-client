import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles';
import {Link} from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PropTypes from 'prop-types';
import RequestButton from './RequestButton';
import ButtonWish from './ButtonWish'
import DeleteBook from './DeleteBook';
import { withTranslation } from 'react-i18next';

//MUI
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import { red } from '@material-ui/core/colors';
import CircularProgress from '@material-ui/core/CircularProgress';

// Redux
import { connect } from 'react-redux';

//Actions
import {changeToAvailable } from '../redux/actions/dataAction';
import i18next from 'i18next';


const styles = {
    card: {
        display: 'flex',
        marginBottom: 20,
    },
    image:{
        minWidth: 150,
    },
    content: {
        padding: 25,
        objectFit: 'cover',
        width: '100%'
    },
    requestButton: {
       float: 'right'
    },
   noTickets: {
        float: 'right', 
   },
   progressSpinner: {
    position: 'absolute'
}
};
const ColorButton = withStyles((theme) => ({
    root: {
      color: theme.palette.getContrastText(red[300]),
      backgroundColor: red[300],
      '&:hover': {
        backgroundColor: red[500],
      },
    },
}))(Button);

class Book extends Component {

    changeToAvailable = () => {
        this.props.changeToAvailable(this.props.book.bookId);
    };


    render() {
        dayjs.extend(relativeTime);
        const { classes, book: {bookId, title, author, cover, owner, ownerImage, userPostDate, location, availability, price, tags}, user: {authenticated,credentials: { handle,tickets }}, UI: {loading}} = this.props;
        const { t } = this.props;
        let isOwner = (owner === handle) ? true : false;
        const deleteButton = authenticated && owner === handle && availability === 'available' ? (
            <DeleteBook bookId={bookId}/>
        ): null;
        const changeToAvailable = authenticated && owner === handle && availability === 'provided' ? (
            <div className={classes.buttons}>  
                <Button variant="contained" color="primary" className={classes.noTickets} disabled={loading} onClick={this.changeToAvailable}>
                {t('ChangeAvailable')}{loading && (<CircularProgress size={30} className={classes.progressSpinner} />)}
                </Button>
            </div>
        ): null; 
        let showTags = false;
        let translatedTags = "";
        if(tags){
            showTags = tags.length > 0 ? true : false;
            for(let i = 0; i < tags.length; i++){
                let last = i === (tags.length - 1) ? "" : ", ";
                translatedTags = translatedTags + t(tags[i]).toUpperCase() + last;
            }
        }
        ;

        return (
            <Card className={classes.card}>
                <CardMedia image={cover} title="Cover image" className={classes.image}/>
                <CardContent className={classes.content}>
                    {deleteButton}{changeToAvailable}
                    {showTags ? ( 
                        <Typography variant="body2" color="textSecondary">{translatedTags}</Typography>
                    ) : null}
                    <Typography variant="h5" component={Link} to={`/books/${bookId}`} color="primary">{title}</Typography>
                    <Typography variant="body2" color="textSecondary">{author}</Typography>
                    { (i18next.language === 'en') ? (
                     <Typography variant="body2" color="primary">{t('status')}: {availability}</Typography>
                    ) : null}
                    { (i18next.language === 'es' && availability === 'available' ) ? (
                     <Typography variant="body2" color="primary">{t('status')}: Disponible</Typography>
                    ) : null}
                    { (i18next.language === 'es' && availability === 'provided' ) ? (
                     <Typography variant="body2" color="primary">{t('status')}: Prestado</Typography>
                    ) : null}
                   
                    <Avatar alt={owner} src={ownerImage}/><Typography variant="body1" component={Link} to={`/users/${owner}`} color="primary">{owner}</Typography>
                    <Typography className={classes.date} variant="body2" color="textSecondary">{t('posted')}: {dayjs(userPostDate).fromNow()} from {location}</Typography>
                    { (!isOwner && authenticated && availability === 'available' && tickets > price) ? (
                    <RequestButton bookId={bookId} price={price}/>
                    ) : null}
                    { (!isOwner && authenticated && availability === 'available' && tickets < price) ? (
                    <ColorButton component={Link} variant="contained" className={classes.noTickets} to="/ticket">
                    {t('noTickets')}
                    </ColorButton>
                    ) : null}
                     {authenticated? (!isOwner  && availability === 'provided') ? (
                    <ButtonWish bookId={bookId} />
                    ) : null: null }
                </CardContent>
            </Card>
        );
    }
}

Book.propTypes = {
    user: PropTypes.object.isRequired,
    book: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    user: state.user,
    UI: state.UI,
});

const mapActionsToProps= { changeToAvailable };

const Book1 = withTranslation()(Book)
export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Book1));