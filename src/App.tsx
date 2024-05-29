import React from 'react';
import NotificationComponent from './pages/NotificationComponent';
import { AppConfiguration } from './pages/interfaces/Notifications';

const App: React.FC = () => {
  const host = 'localhost:7071'
  const apiKey = 'L-IjFkw_bYgqEvgVBs6DWUd9wMrFhAmk5m0hd8f8WvukyTeQbPs-p0iOKKb1UF2-';
  const userId = 'a3beb23d-45b1-4bbf-a728-0a7007f207e6';
  const appId = '597332b9-fbe7-40b8-a213-93fd3e094b59';

  const appConfiguration = {
    apiKey,
    userId,
    appId,
    host
  }
  

  return (
    <div>
      <NotificationComponent appConfiguration={appConfiguration}/>
    </div>
  );
};

export default App;