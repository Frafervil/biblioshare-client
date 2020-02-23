import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles';
import {Link} from 'react-router-dom';

//MUI
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';

const styles = {
    card: {
        display: 'flex',
        marginBottom: 20,
    },
    image:{
        minWidth: 200,
    },
    content: {
        padding: 25,
        objectFit: 'cover'
    }
};

class Book extends Component {
    render() {
        const { classes, book: {title, author, cover, owner, ownerImage, commentCount, requestCount}} = this.props;
        return (
            <Card className={classes.card}>
                <CardMedia image={cover} title="Cover image" className={classes.image}/>
                <CardContent className={classes.content}>
                    <Typography variant="h5">{title}</Typography>
                    <Typography variant="body2" color="textSecondary">{author}</Typography>
                    <Avatar alt={owner} src={ownerImage} /><Typography variant="body1" color="textSecondary" component={Link} to={`/users/${owner}`} color="primary">{owner}</Typography>
                </CardContent>
            </Card>
        );
    }
}

export default withStyles(styles)(Book);
