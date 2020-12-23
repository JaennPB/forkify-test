// helper functions contain functions that we reuse over and over again to help keep code more managable
// *************************************************************************
// ***************************************************************** imports

import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config.js';

// ****************************************************************************
// ****************************************************************** timeout f

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2

// ********************************************************************************
// ****************************************************************** get/send AJAX

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    // loading recipe
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    // console.log(res, data);

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

// ****************************************************************************
// ****************************************************************** getJSON f

export const getJSON = async function (url) {
  try {
    // loading recipe
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    // console.log(res, data);

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    return data;
  } catch (err) {
    // propagating error to getJSON at model module
    throw err;
  }
};

// ****************************************************************************
// ****************************************************************** getJSON f

export const sendJSON = async function (url, uploadData) {
  try {
    // loading recipe
    const res = await Promise.race([
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(uploadData),
      }),
      timeout(TIMEOUT_SEC),
    ]);
    const data = await res.json();
    // console.log(res, data);

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    return data;
  } catch (err) {
    // propagating error to getJSON at model module
    throw err;
  }
};
