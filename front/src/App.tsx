import SearchUserForm from './features/SearchUserForm/SearchUserForm.tsx';
import {useSelector} from 'react-redux';
import {RootState} from './app/store.ts';
import './style.css'
import {CircularProgress} from '@mui/material';

const App = () => {
  const {user,fetchLoad} = useSelector((state: RootState) => state.users);

  return (
    <>
      <SearchUserForm/>

      {
        fetchLoad ? ( <p style={{marginLeft: '100px'}}>
         < CircularProgress />
        </p>
        ) :
        user ?
        <div className="user-card">
          <div className="user-card-content">
            <p className="user-card-email">{user.email || 'User Not Found!'}</p>
            <p className="user-card-number">{user.number}</p>
          </div>
        </div> : null
      }
    </>
  );
};

export default App;