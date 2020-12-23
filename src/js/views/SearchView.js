// IN CHARGE OF DOM manipulation + eventListeners / SEARCH BAR
class SearchView {
  _parentElement = document.querySelector('.search');

  addHandlerSearch(handler) {
    // *** PUBLISHER ***
    // submit on the parent listens for both the click on btn and enter on search form
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }

  getQuery() {
    const query = this._parentElement.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._parentElement.querySelector('.search__field').value = '';
  }
}

export default new SearchView();
