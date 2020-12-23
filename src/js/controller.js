// IN CHARGE OF APP FUNCTIONALITY / CONTROLLERS + SUBSCRIBERS
// likned to views and model
// *****************************************************************************************
// ********************************************************************************* imports

// model module
import * as model from './model.js';
// own class
import searchView from './views/SearchView.js';
// instance of class View
import recipeView from './views/recipeView.js';
// insatance of class View
import resultsView from './views/resultsView.js';
// insatance of class View
import paginationView from './views/paginationView.js';
// insatnce of class View
import bookmarksView from './views/bookmarksView.js';
// insatnce of class View
import addRecipeView from './views/addRecipeView.js';

// config
import { MODAL_CLOSE_SEC } from './config.js';

// pollyfilling
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { setTimeout } from 'core-js';

// *********************************************************************************************
// ************************************************************************ controlSearchResults

// *** SUBSCRIBER/HANDLER - controller ***
const controlSearchResults = async function () {
  try {
    // 1) load spinner
    resultsView.renderSpinner();

    // 2) get query search value
    const query = searchView.getQuery();
    if (!query) return;

    // 3) await load of search results from model (mutates state object in model)
    await model.loadSearchResults(query);

    // ============================================== initial states PAGINATION ===========
    // 4) render initial results (on search load)
    // CALLBACK: controlling how many results to display on pagination from model.state.results
    resultsView.render(model.getSearchResultsPage());

    // 5) render initial pagination + buttons (on search load)
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

// ============================================== updated states PAGINATION ================
// *** SUBSCRIBER/HANDLER - controller ***
const controlPagination = function (goToPage) {
  // 1) render NEW results (on event listener, receives which 'page to go' to from view)
  // same as before, displays pagination (10 items per page), this time there is no default page
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 5) render NEW pagination buttons (on event listener)
  paginationView.render(model.state.search);
};

// ***************************************************************************************
// ************************************************************************ controlRecipes

// *** SUBSCRIBER/HANDLER - controller ***
const controlRecipes = async function () {
  try {
    // 1) getting hash id from url
    // hash changes everytime an HTML link is cliked
    const id = window.location.hash.slice(1);
    // console.log(id);

    if (!id) return;

    // 0, dependent)
    // this will only work here because: after runing this function, clicking on a result, hash will change on url and we will be able to work with that to render/update currently selected item
    // use update to only change the element that is different from old (new item has a new class name of avtive)
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // 2) rendering spinner
    recipeView.renderSpinner();

    // 3) loading recipe from module on state
    // CALLBACK: receives id/hash
    // this does not return anything, all it does is modify state object in model module
    await model.loadRecipe(id);

    // 4) rendering recipe on main view
    recipeView.render(model.state.recipe);
  } catch (err) {
    // recipeView is in charge of rendering message and error on the UI
    recipeView.renderError();
  }
};

// ****************************************************************************************
// ************************************************************************ controlServings

// *** SUBSCRIBER/HANDLER - controller ***
const controlServings = function (newServings) {
  // newServings = dataset is received
  // 1) update recipe state(data) from the model
  model.updateServings(newServings);
  // 2) update/overwrite recipe view
  recipeView.update(model.state.recipe);
  // check algorithm 'update()' in recipeView to only update ingredients and servings
};

// ********************************************************************************************
// ************************************************************************ controlAddBookmarks

const controlAddBookmarks = function () {
  // 1) add/remove bookmarks
  // will add current recipe to the bookmarks array in model.state
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    // will delete current recipe from the bookmarks array in model.state
    model.deleteBookmark(model.state.recipe.id);
  }
  // console.log(model.state.recipe);

  // 2) updating recipeView to add/remove filled icon when bookmarking
  recipeView.update(model.state.recipe);

  // 3) rendering/removing bookmarks on list preview
  bookmarksView.render(model.state.bookmarks);
};

// ********************************************************************************************
// ************************************************************************ controlBookmarks

const controlBookmarks = function () {
  // rendering stored bookmarks in state.bookmarks on reload
  bookmarksView.render(model.state.bookmarks);
};

// *********************************************************************************************
// ************************************************************************ controlAddRecipe

const controlAddRecipe = async function (newRecipe) {
  try {
    // 0) render spinner
    addRecipeView.renderSpinner();

    // 1) upload recipe data to state and bookmarks array
    await model.uploadRecipe(newRecipe);
    // console.log(model.state.recipe);

    // 2) render recipe data
    recipeView.render(model.state.recipe);

    // 3) render success message
    addRecipeView.renderMessage();

    // 4) render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // 5) change url id to current created recipe
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // 6) close modal on submit after 2.5 secs
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
};

// ***************************************************************************************
// ********************************************************* publiser-subscriber technique

// as soon as program starts,  init() runs the PUBLISHERS (functions that know when to react) from outside modules to listen for events
// publishers in view modules will wait patiently for event listeners, once they are triggered, they run passed arguments(functions) from controller
const init = function () {
  // *** PUBLISHERS ***     *** SUBSCRIBERS ***
  // 0) LISTEN "load". user reloads page, local storage is rendered
  bookmarksView.addHandlerBookmarks(controlBookmarks);
  // 1) LISTEN "SUBMIT". user searches, data loads on state, views render on UI, displays initial pagination
  searchView.addHandlerSearch(controlSearchResults);
  // 2) LISTEN "click". user clicks 'next page' on results, renders new results + new pagination numbers based on current page
  paginationView.addHandlerClick(controlPagination);
  // 3) LISTEN "hashchange, load". user clicks on links from results in pagination, renders recipe on main view
  recipeView.addHandlerRender(controlRecipes);
  // 4) LISTEN "click". user clicks to modify servings, dataset is returned (current number of servings)
  recipeView.addHandlerUpdateServings(controlServings);
  // 5) LISTEN "click". user clicks on bookmark icon, state is updated, ui is updated
  recipeView.addHandlerAddBookmark(controlAddBookmarks);
  // 5) LISTEN "click/submit". user submits form, data is tranfered from form to controller to model
  addRecipeView.addHandlerClick(controlAddRecipe);
  console.log('Welcome!');
};
init();
