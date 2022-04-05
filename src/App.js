import './App.css'

import { Amplify } from 'aws-amplify';

import { Authenticator, Button } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import awsExports from './aws-exports';
Amplify.configure(awsExports);

function App() {
  return (
    <div className="App">
      <Authenticator>
      {({ signOut, user }) => (
        <div className='landing-page'>
          <h1>Hello {user.username} this is Bungle</h1>
          <Button onClick={signOut}>Sign Out</Button>
        </div>
      )}
      </Authenticator>
    </div>
  );
}

export default App;
