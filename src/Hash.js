import React from 'react';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

function _handleHashChange(evt) {
  console.log('_handleHashChange', evt);
}
function _handlePopChange(evt) {
  console.log('_handlePopChange', evt);
}

window.addEventListener('hashchange', _handleHashChange);
window.addEventListener('popstate', _handlePopChange);

// Get the current location.
const location = history.location;

// Listen for changes to the current location.
const unlisten = history.listen((location, action) => {
  // location is an object like window.location
  console.log(action, location.pathname, location.state);
});

// Use push, replace, and go to navigate around.


// To stop listening, call the function returned from listen().
unlisten();

function _handleClick(){
  history.push('/home', { some: 'state' });
}
const AppRouter = () => (
  <>
  <div onClick={_handleClick}>123</div>
  <a href='#a'>123</a>
  </>
);

export default AppRouter;
