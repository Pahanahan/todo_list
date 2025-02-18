const dateMain = document.querySelector(".main__top-date");
const addBtn = document.querySelector(".footer__add");
const itemsContainer = document.querySelector(".main__items");
const dealNot = document.querySelector(".main__top-not");

const closeBtn = document.querySelector(".popup__add-close");
const popup = document.querySelector(".popup");
const form = document.querySelector(".popup__add-form");
const dateEl = document.querySelector(".popup__add-input-date");
const textarea = document.querySelector(".popup__add-textarea");

const closeBtnChange = document.querySelector(".popup-change__add-close");
const popupChange = document.querySelector(".popup-change");
const formChange = document.querySelector(".popup-change__add-form");
const dateChangeEl = document.querySelector(".popup-change__add-input-date");
const textareaChange = document.querySelector(".popup-change__add-textarea");

addBtn.addEventListener("click", showPopup);
closeBtn.addEventListener("click", hiddenPopup);
popup.addEventListener("click", removePopup);
form.addEventListener("submit", addTask);

closeBtnChange.addEventListener("click", hiddenChangePopup);
popupChange.addEventListener("click", removeChangePopup);

itemsContainer.addEventListener("click", removeOrChangeOrDone);

let tasksArray = JSON.parse(localStorage.getItem('tasksArray')) || [];
console.log(tasksArray);

if (tasksArray.length > 0) {
  tasksArray.forEach((task) => {
    renderTask(task);
  });
}

checkArraysTask();

function initToday() {
  const today = new Date().toISOString().split("T")[0];
  dateEl.value = today;

  const dateTransform = Intl.DateTimeFormat("ru-RU", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(dateEl.value));
  dateMain.textContent = dateTransform;
}

initToday();

function showPopup() {
  popup.classList.add("popup--active");
  setTimeout(() => {
    textarea.focus();
  }, 100);
}

function hiddenPopup() {
  popup.classList.remove("popup--active");
}

function removePopup(e) {
  if (e.target.classList.contains("popup")) {
    hiddenPopup();
  }
}

function showChangePopup() {
  popupChange.classList.add("popup-change--active");
  setTimeout(() => {
    textarea.focus();
  }, 100);
}

function hiddenChangePopup() {
  popupChange.classList.remove("popup-change--active");
}

function removeChangePopup(e) {
  if (e.target.classList.contains("popup-change")) {
    hiddenChangePopup();
  }
}

function addTask(e) {
  console.log(e.target);
  const dateTransform = Intl.DateTimeFormat("ru-RU", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(dateEl.value));

  const newTask = {
    text: textarea.value,
    date: dateTransform,
    done: false,
    id: Date.now(),
  };

  tasksArray.push(newTask);
  console.log(tasksArray);

  hiddenPopup();

  textarea.value = "";

  renderTask(newTask);
  checkArraysTask();
  saveToLocalStorege()
}

function renderTask(task) {
  itemsContainer.classList.remove("hidden");

  const classCss = task.done
    ? "main__item-title  main__item-title--done"
    : "main__item-title";

  class Task {
    constructor(id, date, text, done) {
      this.id = id;
      this.date = date;
      this.text = text;
      this.done = done;
    }

    render() {
      const taskHTML = `
      <div class="main__item" id="${task.id}">
        <div class="main__item-contents">
          <div class="main__item-date">${task.date}</div>
          <div class="${classCss}">${task.text}</div>
        </div>
        <div class="main__item-buttons">
          <button class="main__item-remove">Удалить</button>
          <button class="main__item-change">Изменить</button>
          <button class="main__item-done">Сделано</button>
        </div>
      </div>
    `;

      itemsContainer.insertAdjacentHTML("beforeend", taskHTML);
    }
  }

  new Task(task.id, task.date, task.text, task.done).render();
}

function checkArraysTask() {
  if (tasksArray.length === 0) {
    dealNot.textContent = "Дел нет";
    itemsContainer.classList.add("hidden");
  } else {
    dealNot.textContent = `Дел: ${tasksArray.length}`;
  }
}

function removeOrChangeOrDone(e) {
  if (e.target.classList.contains("main__item-remove")) {
    removeTask(e);
  } else if (e.target.classList.contains("main__item-change")) {
    showChangePopup(e);
  } else if (e.target.classList.contains("main__item-done")) {
    doneTask(e);
  }
}

function removeTask(e) {
  const taskItem = e.target.closest(".main__item");
  const id = Number(taskItem.id);

  tasksArray = tasksArray.filter((task) => task.id !== id);

  taskItem.remove();

  checkArraysTask();
  saveToLocalStorege()
}

function doneTask(e) {
  const taskItem = e.target.closest(".main__item");
  const id = Number(taskItem.id);

  const task = tasksArray.find((task) => task.id === id);
  task.done = !task.done;

  const itemTitle = taskItem.querySelector(".main__item-title");

  itemTitle.classList.toggle("main__item-title--done");

  saveToLocalStorege()
}

function showChangePopup(e) {
  const taskItem = e.target.closest(".main__item");
  const taskItemText = taskItem.querySelector(".main__item-title");
  const taskItemDate = taskItem.querySelector(".main__item-date");
  const id = Number(taskItem.id);

  const task = tasksArray.find((task) => task.id === id);

  const [day, month, year] = task.date.split(".").map(Number);

  const date = new Date(year, month - 1, day + 1).toISOString().split("T")[0];

  popupChange.classList.add("popup-change--active");
  setTimeout(() => {
    textareaChange.focus();
  }, 100);

  dateChangeEl.value = date;
  textareaChange.value = task.text;

  formChange.addEventListener("submit", function () {
    const dateTransform = Intl.DateTimeFormat("ru-RU", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    }).format(new Date(dateChangeEl.value));

    task.text = textareaChange.value;
    task.date = dateTransform;

    taskItemText.textContent = task.text;
    taskItemDate.textContent = task.date;

    popupChange.classList.remove("popup-change--active");

    saveToLocalStorege()
  });
}

function saveToLocalStorege() {
  localStorage.setItem('tasksArray', JSON.stringify(tasksArray))
}