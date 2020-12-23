// IN CHARGE OF DOM manipulation + eventListeners / PAGINATION

import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  _currentPage;

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      // using event delegation
      const btn = e.target.closest('.btn--inline');
      // console.log(btn);
      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      // run subscriber
      handler(goToPage);
    });
  }

  _generateMarkup() {
    // calc of how many pages there are per search
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    // console.log(numPages);

    const currPage = this._data.page;
    this._currentPage = currPage;

    // if on page 1 and there are more pages
    if (currPage === 1 && numPages > 1) {
      return this._generateMarkupNext();
    }

    // if on other page
    if (currPage < numPages) {
      return this._generateMarkupMiddle();
    }

    // if on last page
    if (currPage === numPages && numPages > 1) {
      return this._generateMarkupPrevious();
    }

    // if there are no more pages (results less than 10 items)
    return '';
  }

  _generateMarkupMiddle() {
    return `
        <button data-goto="${
          this._currentPage - 1
        }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${this._currentPage - 1}</span>
        </button>
        <button data-goto="${
          this._currentPage + 1
        }" class="btn--inline pagination__btn--next">
            <span>Page ${this._currentPage + 1}</span>
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
      `;
  }
  _generateMarkupPrevious() {
    return `
        <button data-goto="${
          this._currentPage - 1
        }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${this._currentPage - 1}</span>
        </button>   
      `;
  }

  _generateMarkupNext() {
    return `
        <button data-goto="${
          this._currentPage + 1
        }" class="btn--inline pagination__btn--next">
            <span>Page ${this._currentPage + 1}</span>
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
      `;
  }
}

export default new PaginationView();
