// IN CHARGE OF ALL DATA
// *****************************************************************************************
// ********************************************************************************* imports

// helpers and config modules
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';

// *********************************************************************************************
// ********************************************************************************* data object

// contains ALL DATA created by model.js
// this object will be taken by controller to render recipe by using created data
export const state = {
  // main app view
  recipe: {},
  // pagination
  search: {
    query: '',
    results: [],
    page: 1, // default
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

// ************************************************************************************************
// ********************************************************************************* search results
// on search

export const loadSearchResults = async function (query) {
  try {
    // 1) sets query on state
    state.search.query = query;

    // 2) awaits all data from API search results (returns object with many variables)
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    // console.log(data);

    // 3) creates a new array from object from search results (extracts only recipes)
    // 4) pushes results to state object
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    // console.log(state.search.results);

    // 5) on every new search, reset page to 1 on state.search.page
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

// ********************************************************************************************
// ********************************************************************************* pagination

// pagination: this function will return part of the search results in a controlled way
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  // 1) calculating number of results from 'page' argument
  const start = (page - 1) * state.search.resultsPerPage; // 0
  const end = page * state.search.resultsPerPage; //10

  // 2) returning results dynamicaly (10 items per page)
  // from 0 - 10 (default), from 10 -20 (on page 2), etc...
  return state.search.results.slice(start, end);
};

// ******************************************************************************************************
// ********************************************************************************* create recipe object

const createRecipeObject = function (data) {
  // taking recipe object from fetched data + creating new object in state object with new property names
  // on every results click(haschange) main view and state data updates
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

// *********************************************************************************************
// ********************************************************************************* load recipe
// on main app

// creates state (data) object
// load recipe will be called by controller which will pass id as argument
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    // console.log(data);

    // creating recipe object
    state.recipe = createRecipeObject(data);

    // checking if loaded recipe is bookedmarked to render bookmark icon
    // some() loops over array and returns true or false based on condition
    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }

    // only 1 recipe is stored in data per hashchange
    // console.log(state.recipe);
  } catch (err) {
    throw err;
  }
};

// ******************************************************************************************
// ********************************************************************************* servings

export const updateServings = function (newServings) {
  // updates data (ingredients quantity) in recipe.ingredients from state
  state.recipe.ingredients.forEach(ing => {
    // newQuantity = oldQuantity * newServings / oldServings ... 2 * 8(servings) / 4(servings) = 4 NEW QUANTITY
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  // update state servings
  state.recipe.servings = newServings;
  // no need to return anything, function already updated state
};

// **********************************************************************************************************
// ********************************************************************************* add bookmarks to storage

const storeBookmarksData = function () {
  // taking current bookmarks and adding/removing them from state
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

// ***********************************************************************************************
// ********************************************************************************* add bookmarks

export const addBookmark = function (recipe) {
  // adding recipe to book marks array
  state.bookmarks.push(recipe);

  // setting current recipe as bookedmarked
  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true;
  }

  storeBookmarksData();
};

// **************************************************************************************************
// ********************************************************************************* delete bookmarks

export const deleteBookmark = function (id) {
  // will return recipe matching passed id
  const index = state.bookmarks.findIndex(el => el.id === id);
  // will delete said recipe from bookmarks
  state.bookmarks.splice(index, 1);

  // setting current recipe as NOT bookedmarked
  if (id === state.recipe.id) {
    state.recipe.bookmarked = false;
  }

  storeBookmarksData();
};

// ******************************************************************************************************************
// ********************************************************************************* adding stored bookmarks to state

// on program start, local storage automatically added back to API to state.bookmarks
// we can then render bookmarks
const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();
// console.log(state.bookmarks);

// **********************************************************************************************************************
// ********************************************************************************* clearing localStorage (for dev only)

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

// ***********************************************************************************************
// ********************************************************************************* upload recipe

export const uploadRecipe = async function (newRecipe) {
  try {
    // converting back to array
    const ingredients = Object.entries(newRecipe)
      // filtering only ingredients
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      // creating an object from filtered results
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());

        if (ingArr.length !== 3) {
          throw new Error('Wrong Format. Please use provided format. :)');
        }

        // using deconstruction to assing variables to values
        const [quantity, unit, description] = ingArr;
        // map will return an array of objects
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    // changing format so that API can receive it
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      // adding created ingredients array of objects
      ingredients,
    };

    // console.log(recipe);
    // sending data to API
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    // console.log(data);

    // creating recipe from object template
    state.recipe = createRecipeObject(data);
    // adding recipe to bookmarks array
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
