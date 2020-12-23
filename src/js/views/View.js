// PARENT CLASS OF ALL VIEWS
// *************************************************************************
// ***************************************************************** imports

import { mark } from 'regenerator-runtime';
import icons from 'url:../../img/icons.svg';

// ***********************************************************************************
// ***************************************************************** class View PARENT

export default class View {
  _data;

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    // _data in RecipeView class now has all state object from model module
    this._data = data;
    const markup = this._generateMarkup();

    // return markup
    if (!render) return markup;

    // emptying container
    this._clear();

    // redering generated markup
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    // new updated data from model.state.recipe (new servings)
    this._data = data;
    // will return a string of indented html
    const newMarkup = this._generateMarkup();
    // creating virtual dom from string of this._generateMarkup()
    const newDom = document.createRange().createContextualFragment(newMarkup);
    // create array from virtual dom of all thml elements
    const newElements = Array.from(newDom.querySelectorAll('*'));
    // create array from _parentElement dom to compare to
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      // looping both arrays at the same time
      const curEl = curElements[i];

      // === changing TEXT ===
      if (
        // comparing elememts. Will return 'true' or 'false'. We are looking for 'false' (different)
        !newEl.isEqualNode(curEl) &&
        // selecting first child of element (textNode) !== should Not be empty
        // this will only change elements that are different (! false) and contain text
        newEl.firstChild?.nodeValue.trim() !== '' // meaning it contains text and not images
      ) {
        // changing only text from old to new/updated servings
        curEl.textContent = newEl.textContent;
      }

      // === changing ATTRIBUTES ===
      if (!newEl.isEqualNode(curEl)) {
        // console.log(curEl, newEl.isEqualNode(curEl));
        // console.log(newEl.attributes);
        // making an array so they can be looped
        Array.from(newEl.attributes).forEach(attr => {
          // setting attributes from curEl on newEl attributes (old to new)
          // all attribute names to attributte values (including data attribute, if present)
          // console.log(attr);
          // attr.name = 'class' + 'data' / attr.value = 'class name' + 'dataset value'
          curEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  renderSpinner() {
    const markup = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
            <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
            <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }
}
