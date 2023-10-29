const templateButton = (category: string): HTMLButtonElement => {
  const button = document.createElement("button");
  button.classList.add("profile-edit-button");
  button.type = "button";
  button.title = "Изменить данные";
  button.dataset.category = category;
  button.innerHTML = `
    <svg width="25" height="25" viewBox="0 0 25 25" stroke="currentColor" fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path d="M12.5 20H20.8333" stroke-width="1.5" stroke-linecap="round"
        stroke-linejoin="round" />
        <path
        d="M16.6485 4.74124C17.0164 4.37334 17.5154 4.16666 18.0357 4.16666C18.2933 4.16666 18.5484 4.2174 18.7864 4.31599C19.0244 4.41457 19.2407 4.55907 19.4228 4.74124C19.605 4.9234 19.7495 5.13966 19.8481 5.37767C19.9467 5.61568 19.9974 5.87078 19.9974 6.1284C19.9974 6.38602 19.9467 6.64111 19.8481 6.87912C19.7495 7.11713 19.605 7.33339 19.4228 7.51556L7.86315 19.0752L4.16406 20L5.08884 16.3009L16.6485 4.74124Z"
        stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
    `;

  return button;
};

export const handlerAddUpdateButtons = () => {
  const wrappersData: NodeListOf<HTMLElement> = document.querySelectorAll(
    ".profile-data__container"
  );
  wrappersData.forEach((wrapper) => {
    const category: string = wrapper.dataset.category;
    wrapper
      .querySelector(".profile-data__title")
      .appendChild(templateButton(category));
  });
};
