// IN CHARGE OF DOM manipulation + eventListeners / BOOKMARK PREVIEW

// *************************************************************************
// ***************************************************************** imports

import View from './View.js';
import previewView from './previewView.js';

// ********************************************************************************************
// ***************************************************************** class ResultsView CHILDREN

class bookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a recipe and bookmark it. ;)';
  _message = '';

  addHandlerBookmarks(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    // for this to work, this function needs to return a string, so that the inherited render() method is able to place that markup string in the dom
    // using render() from view so that we are able to use the _data and the this. keyword in the markup
    // setting parameter to false, so that render() from view can return markup string instead of trying to render it
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
    // looping through array
    // setting to false to trigger return of markup
    // because of map, we end up with an array of markup strings (each element a recipe)
    // it is joined into one big string of all markup we want to render
  }
}

export default new bookmarksView();
