import * as React from 'react';
import {useState} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {User} from '../../../types';
import {AppDispatch} from '../../app/store.ts';
import {useDispatch} from 'react-redux';
import {searchUser} from '../../store/UsersThunk.ts';

const regEx = /[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,8}(.[a-z{2,8}])?/g;
const defaultTheme = createTheme();
const SearchUserForm = () => {

  const dispatch = useDispatch<AppDispatch>();

  const [state, setState] = useState<User>({
    email: '',
    number: ''
  });

  const [emailIsValid, setEmailIsValid] = useState<boolean>(true);
  const [emailLabel, setEmailLabel] = useState<string>('');

  const formatNumber = (value) => {
    const cleanedValue = value.replace(/-/g, '');
    const parts = cleanedValue.match(/.{1,2}/g) || [];
    return parts.join('-');
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    const number = value.replace(/-/g, '');
    if (name === 'number' && isNaN(Number(number))) return;

    setState((prevState) => ({
      ...prevState,
      [name]: value.trim()
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regEx.test(state.email)) {
      setEmailIsValid(true);
    } else if (!regEx.test(state.email) && state.email !== '') {
      setEmailLabel('Неверный формат электронной почты');
      setEmailIsValid(false);
      return;
    }
    await dispatch(searchUser(
      {
        email: state.email,
        number: state.number,
        clientId: '1234'
      }));

    setState({email: '', number: ''});
    setEmailLabel('');

  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline/>
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{m: 1, bgcolor: 'brown'}}>
            <AccountCircleIcon/>
          </Avatar>
          <Typography component="h1" variant="h5">
            Search User
          </Typography>
          <Box component="form" onSubmit={onSubmit} sx={{mt: 1}}>
            <TextField
              required
              fullWidth
              label="Email"
              name="email"
              error={Boolean(!emailIsValid)}
              placeholder="email@email.com"
              value={state.email}
              helperText={emailLabel}
              onChange={onChange}
              autoComplete="email"
              autoFocus
            />

            <TextField
              margin="normal"
              fullWidth
              name="number"
              value={formatNumber(state.number)}
              label="Number"
              onChange={onChange}
              type="text"
              autoComplete="current-number"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{mt: 3, mb: 2}}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default SearchUserForm;