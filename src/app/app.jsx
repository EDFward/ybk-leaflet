import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import api from './api.js';
import { initBookmarks } from './actions';
import Master from './components/master.jsx';
import YBK from './reducers';

import '../less/main.less';

const injectTapEventPlugin = require('react-tap-event-plugin');

// Needed for React Developer Tools
window.React = React;

// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

let store = createStore(YBK);

// Fetch init bookmarks!
Promise
  .all([api.getBookmarks(), api.getNotes()])
  .then(
    // Success.
    results => {
      let bookmarks = results[0];
      let notes = results[1];
      // A map keyed on bookmark ID.
      let bookmarkMap = new Map();
      for (let b of bookmarks) {
        bookmarkMap.set(b.id, b);
        // Add another field to indicate display or not.
        b.visible = true;
      }
      for (let note of notes) {
        const id = note['bookmark_id'];
        let b = bookmarkMap.get(id);
        if (b) {
          Object.assign(b, {
            context: note.context,
            review: note.review,
            mark: note.mark,
          });
        }
      }
      const bookmarkList = Array.from(bookmarkMap.values());
      store.dispatch(initBookmarks(bookmarkList));
    },
    // Failure.
    () => alert('Failed to fetch bookmarks/notes!')
  );

ReactDOM.render(
  <Provider store={store}>
    <Master />
  </Provider>,
  document.getElementById('app')
);
