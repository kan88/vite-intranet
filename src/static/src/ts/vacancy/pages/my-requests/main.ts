// API;
import { VacancyAPI } from "../../../../js/API/vacancyApi.js";
// Loader;
import { showLoader, hiddenLoader } from "../../../util";
// Initial;
import { initialTabs } from "../../helpers/initial/initial-tabs";
import { getAdministratorRole } from "../../helpers/get-administrator-role";
// Helpers;
import { TAB_NAME, VacancyStatus, VACANCY_HELPERS_HIDDEN } from "../../const";
import { createCard } from "../../helpers/creators/cards/create-card";
import { VacancyCard } from "../../const";

// Types;
import type { TYPE_REQUEST } from "../../types/request";

const { samaccountname } = JSON.parse(sessionStorage.getItem(`auth`));

const tabContainer = document.querySelector(
  `.tab-section__wrapper`
) as HTMLElement;
const administratorRole = await getAdministratorRole(samaccountname);

initialTabs(tabContainer, TAB_NAME.MY_REQUESTS, administratorRole);

const vacancyListContainer = document.querySelector(
  `.vacancy-list--requests`
) as HTMLElement;
const emptyContainer = document.querySelector(`.vacancy-empty-container`);
const errorContainer = document.querySelector(`.vacancy-error-container`);

showLoader();

VacancyAPI.getMyRequest({ samaccountname, status: VacancyStatus.REQUEST })
  .then((data: TYPE_REQUEST[]) => {
    if (data.length === 0) {
      vacancyListContainer.classList.add(VACANCY_HELPERS_HIDDEN);
      errorContainer.classList.add(VACANCY_HELPERS_HIDDEN);
      emptyContainer.classList.remove(VACANCY_HELPERS_HIDDEN);
      return;
    }

    vacancyListContainer.classList.remove(VACANCY_HELPERS_HIDDEN);
    errorContainer.classList.add(VACANCY_HELPERS_HIDDEN);
    emptyContainer.classList.add(VACANCY_HELPERS_HIDDEN);

    data
      .sort((a, b) => Number(a.id) - Number(b.id))
      .forEach((item) => {
        const card = createCard(VacancyCard.REQUEST, item, administratorRole);
        const liElement = document.createElement(`li`);

        liElement.className = `vacancy-list__item`;
        liElement.append(card);

        vacancyListContainer.append(liElement);
      });
  })
  .finally(hiddenLoader);
