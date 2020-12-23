// IN CHARGE OF DOM manipulation + eventListeners / RESULTS FROM SEARCH BAR

// *************************************************************************
// ***************************************************************** imports

import View from './View.js';
import previewView from './previewView.js';

// ********************************************************************************************
// ***************************************************************** class ResultsView CHILDREN

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query! plase try again 😉';
  _message = '';

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultsView();
