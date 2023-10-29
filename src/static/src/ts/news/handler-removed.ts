import { offActualButton } from "./helpers";
import { NewsAPI } from "../../js/API/newsApi";
import { handlerCloseModalNew } from "../util";
import { handlerRenderNews } from "./handlerRenderNews";
import { TYPE_BODY_NEWS, TYPE_NEWS } from "../TYPES";
import { apiPath } from "../../main";
import { TYPE_PHOTOS } from "../TYPES";
import { openAdminModal, openPopupLink, openPopupPublic } from "./helpers";
import { transformationDate } from "../utils/transformationDate";
import { renderPagination } from "../pagination";
import { getPageCount, handlerPagination } from "./handlerPaginationNew";
const removedWrapper = document.querySelector(".removed__list");
const renderRemovedNews = () => {
  const getActualData = {
    status: 3,
    limit: 6,
    offset: 0,
  };
  NewsAPI.getNews(getActualData, (data: TYPE_BODY_NEWS) => {
    const paginationContainer: HTMLElement = document.querySelector(
      ".removed__pagination-container"
    );

    const dataNew = data.rows;
    paginationContainer.innerHTML = "";
    removedWrapper.innerHTML = "";
    if (data.count > 6) {
      renderPagination(
        ".removed__pagination-container",
        getPageCount(data.count)
      );

      handlerPagination(paginationContainer, 3, (dataObj: TYPE_BODY_NEWS) => {
        const data = dataObj.rows;
        removedWrapper.innerHTML = "";
        data.forEach((item) => {
          renderNew(item);
        });
      });
    } else {
      removedWrapper.innerHTML = "";
    }

    if (dataNew) {
      dataNew.forEach((data) => {
        renderNew(data);
      });
    }
  });
};

const returnNew = (evt: Event) => {
  const button = evt.target as HTMLButtonElement;
  const newId = button.dataset.id;
  const status = {
    status: 1,
  };
  NewsAPI.updateStatusNews(status, newId, renderRemovedNews);
};

const renderNew = (item: TYPE_NEWS) => {
  const template = (
    document.querySelector(".public-template") as HTMLTemplateElement
  ).content.querySelector(".public__item");

  const newItem = template.cloneNode(true) as HTMLElement;
  newItem.dataset.id = item.id;
  newItem.dataset.sono = item.sono;
  const buttonReturn: HTMLButtonElement =
    newItem.querySelector(".button--main");
  buttonReturn.textContent = "Восстановить";
  buttonReturn.dataset.id = item.id;
  buttonReturn.addEventListener("click", (evt) => {
    returnNew(evt);
  });
  newItem.addEventListener("click", (evt) => {
    if ((evt.target as HTMLElement).tagName != "BUTTON") {
      NewsAPI.getLink(+item.id, openPopupLink);
    }
  });
  if (item.userlogin) {
    newItem.dataset.userlogin = item.userlogin;
  }
  let date = transformationDate(item.createdAt);
  newItem.querySelector(".public__date").textContent = date;
  newItem.querySelector(".public__title").textContent = item.title;
  if (item.pdf) {
    (newItem.querySelector(".public__pdf") as HTMLLinkElement).href =
      `${apiPath}` + item.pdf;
  } else {
    newItem.querySelector(".public__pdf").remove();
  }

  if (item.video) {
    (newItem.querySelector(".public__video") as HTMLVideoElement).src =
      `${apiPath}` + item.video;
  } else {
    newItem.querySelector(".public__video").remove();
  }
  newItem.querySelector(".public__description").innerHTML = item.description;
  (newItem.querySelector(".public__image") as HTMLImageElement).src =
    `${apiPath}` + item.avatar;
  if (item.images && item.images !== "Все фотографии удалены модератером") {
    for (let j = 0; j < item.images.length; j++) {
      const imageSecondary = newItem
        .querySelector(".public__image")
        .cloneNode(true) as HTMLImageElement;
      imageSecondary.src =
        `${apiPath}` + (item.images[j] as TYPE_PHOTOS).photos;
      imageSecondary.classList.add("js-nodisplay");
      imageSecondary.classList.remove("public__image--avatar");
      imageSecondary.classList.add("public__image--photo");
      imageSecondary.dataset.id = (item.images[j] as TYPE_PHOTOS).id.toString();
      newItem.appendChild(imageSecondary);
    }
  }
  if (item.admin) {
    for (let j = 0; j < item.admin.length; j++) {
      const imageSecondary = newItem
        .querySelector(".public__image")
        .cloneNode(true) as HTMLImageElement;
      imageSecondary.src = `${apiPath}` + item.admin[j];
      imageSecondary.classList.add("js-nodisplay");
      imageSecondary.classList.remove("public__image--avatar");
      imageSecondary.classList.add("public__image--photo");
      newItem.appendChild(imageSecondary);
    }
  }
  removedWrapper.appendChild(newItem);
};

export const removeNew = (button: HTMLButtonElement) => {
  const newId = +button.dataset.id;
  NewsAPI.deleteNew(newId);
  handlerCloseModalNew();
  const category = (document.querySelector(".actual__list") as HTMLElement)
    .dataset.category;
  handlerRenderNews(category);
};

const activatedTab = (button: HTMLButtonElement) => {
  const allButtons: NodeListOf<HTMLButtonElement> =
    document.querySelectorAll(".news-nav__btn");
  const tabsWrappers: NodeListOf<HTMLElement> =
    document.querySelectorAll(".new-tab-container");
  const removedWrapper = document.querySelector(".removed");
  allButtons.forEach((button) => button.classList.remove("tab--actual"));
  button.classList.add("tab--actual");
  tabsWrappers.forEach((wrapper) => wrapper.classList.remove("js-display"));
  removedWrapper.classList.add("js-display");
};

export const handlerRemoved = () => {
  const button = document.createElement("button");
  button.className = "tab news-nav__btn news-nav__btn--removed";
  button.textContent = "Удаленные новости";
  button.addEventListener("click", (evt) => {
    const button = evt.currentTarget as HTMLButtonElement;
    activatedTab(button);
    renderRemovedNews();
  });

  document.querySelector(".tab-section__wrapper").appendChild(button);
};
