import axios from "axios";
import { ENDPOINT, EXPIRE_DATE, IMG_URl, ROLE, TOKEN } from "../const";
import Cookies from "js-cookie";

const token = Cookies.get(TOKEN);
console.log(token);
export const request = axios.create({
  baseURL: ENDPOINT,
  timeout: 10000,
  headers: {
    Authorization: token ? `Bearer ${token}` : "",
  },
});

export function setAuthCookies({ token, role, expire }) {
  Cookies.set(TOKEN, token);
  Cookies.set(ROLE, role);
  Cookies.set(EXPIRE_DATE, expire);
}

export const responsiveTable = () => {
  const headTitleName = document.querySelector(
    ".responsive-table__head__title--name"
  );
  const headTitleStatus = document.querySelector(
    ".responsive-table__head__title--status"
  );
  const headTitleTypes = document.querySelector(
    ".responsive-table__head__title--types"
  );
  const headTitleUpdate = document.querySelector(
    ".responsive-table__head__title--update"
  );
  const headTitleCountry = document.querySelector(
    ".responsive-table__head__title--country"
  );
  const headTitleActions = document.querySelector(
    ".responsive-table__head__title--actions"
  );
  const bodyTextName = document.querySelectorAll(
    ".responsive-table__body__text--name"
  );
  const bodyTextStatus = document.querySelectorAll(
    ".responsive-table__body__text--status"
  );
  const bodyTextTypes = document.querySelectorAll(
    ".responsive-table__body__text--types"
  );
  const bodyTextUpdate = document.querySelectorAll(
    ".responsive-table__body__text--update"
  );
  const bodyTextCountry = document.querySelectorAll(
    ".responsive-table__body__text--country"
  );
  const bodyTextActions = document.querySelectorAll(
    ".responsive-table__body__text--actions"
  );
  const totalTableBodyRow = document.querySelectorAll(
    ".responsive-table__body .responsive-table__row"
  );
  for (let i = 0; i < totalTableBodyRow.length; i++) {
    bodyTextName[i].setAttribute("data-title", headTitleName.innerText);
    bodyTextStatus[i].setAttribute("data-title", headTitleStatus.innerText);
    bodyTextTypes[i].setAttribute("data-title", headTitleTypes.innerText);
    bodyTextUpdate[i].setAttribute("data-title", headTitleUpdate.innerText);
    bodyTextCountry[i].setAttribute("data-title", headTitleCountry.innerText);
    bodyTextActions[i].setAttribute("data-title", headTitleActions.innerText);
  }
};
