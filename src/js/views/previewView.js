// IN CHARGE OF DOM manipulation from bookmarks and search results, same markup

// *************************************************************************
// ***************************************************************** imports

import View from './View.js';
import icons from 'url:../../img/icons.svg';

// ********************************************************************************************
// ***************************************************************** class PreviewView CHILDREN

class PreviewView extends View {
  _parentElement = '';

  _generateMarkup() {
    const urlId = window.location.hash.slice(1);

    return `
        <li class="preview">
          <a class="preview__link ${
            urlId === this._data.id ? 'preview__link--active' : ''
          }" href="#${this._data.id}">
            <figure class="preview__fig">
                <img src="${this._data.image}" alt="${this._data.title}" />
            </figure>
            <div class="preview__data">
              <h4 class="preview__title">${this._data.title}</h4>
              <p class="preview__publisher">${this._data.publisher}</p>
              <div class="preview__user-generated ${
                this._data.key ? '' : 'hidden'
              }">
                <svg>
                  <use href="${icons}#icon-user"></use>
                </svg>
              </div>
            </div>
          </a>
        </li>
    `;
  }
}

export default new PreviewView();
