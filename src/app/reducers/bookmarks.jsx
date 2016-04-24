export const bookmarks = (state = [], action) => {
  switch (action.type) {
    case 'EDIT_BOOKMARK_NOTE':
      return state.map(b => (
        // Overwrite with updated content.
        b.id === action.id ? Object.assign({}, b, action.updated) : b
      ));
    case 'INIT_BOOKMARKS':
      return action.bookmarks;
    default:
      return state;
  }
};

export const selected = (state = null, action) => {
  switch (action.type) {
    case 'SELECT_BOOKMARK':
      if (state === action.id) {
        // Unselect.
        return null;
      } else {
        return action.id;
      }
    case 'EDIT_BOOKMARK_NOTE':
      // Focus on currently selected bookmark.
      return action.id;
    default:
      return state;
  }
};
