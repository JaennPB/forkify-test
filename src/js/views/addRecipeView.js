// IN CHARGE OF DOM manipulation + eventListeners / UPLOAD RECIPE MODAL
// *************************************************************************
// ***************************************************************** imports

import View from './View.js';

// *******************************************************************************************
// ***************************************************************** class RecipeView CHILDREN

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was succesfully uploaded :)';

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    // no need to delegate any function to controller, so this function will immediately launch as soon as instance is created
    this._addHandlerShowModal();
    this._addHandlerHideModal();
  }

  _addHandlerShowModal() {
    // binding this keyword to this = addRecipeView
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }
  _addHandlerHideModal() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  // adding a separate function so that this keyword point to this addRecipeView
  toggleWindow() {
    this._window.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
  }

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      e.preventDefault();
      const btn = e.target.closest('.upload__btn');

      if (!btn) return;
      // remember: this keyword is pointing to the element that is calling the function
      const dataArr = [...new FormData(this)]; // this = _parentElement
      // converting array of arrays to object for better usage
      const data = Object.fromEntries(dataArr);
      // console.log(data);
      handler(data);
    });
  }
}

// ********************************************************************************
// ***************************************************************** class instance

// exporting to controller so that this instance can be created and contrsuctor can run function immediately
export default new AddRecipeView();
