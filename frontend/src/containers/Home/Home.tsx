import React from 'react';
import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import {Link} from 'react-router-dom';
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      height: 300,
    },
    paperone: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
      backgroundColor: theme.palette.primary.dark,
    },
    papertwo: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
      backgroundColor: theme.palette.primary.light,
    },
    paperContainer: {
      height: 200,
    },
  })
);
const Home = () => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Grid container alignItems='center' justify={'center'} spacing={2}>
        <Grid item className={classes.paperone} xs={6}>
          <Button variant='contained' color='primary'>
            <Link to='/login'> i am a teacher</Link>
          </Button>
        </Grid>
        <Grid className={classes.papertwo} item xs={6}>
          <Button variant='contained' color='primary'>
            <Link to='/'> i am a student</Link>
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
