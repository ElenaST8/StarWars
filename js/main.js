document.addEventListener("DOMContentLoaded", () => {
  getPersons(1, true);
});

async function getPersons(page, create = false) {
  try {
    const response = await fetch(`https://swapi.dev/api/people/?page=${page}`);
    const data = await response.json();

    showAllPersons(data.results);

    if (create) {
      createPagination(data.count, data.results.length);
      document.querySelector(".number_page").classList.add("visible");
      activePagination();
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    document.querySelector(".spinner-border").classList.add("d-none");
  }
}

function showAllPersons(data) {
  let content = document.querySelector(".content");
  content.innerHTML = "";
  data.forEach((element) => {
    let str = `
      <div class="card mb-3">
        <h3 class="card-header">${element.name}</h3>
        <img src="https://starwars-visualguide.com/assets/img/characters/${
          element.url.match(/\/([0-9]*)\/$/)[1]
        }.jpg" class="d-block user-select-none">
      </div>
    `;
    content.insertAdjacentHTML("beforeend", str);
  });
  showPersonDetails(data);
}

function showPersonDetails(data) {
  let cards = document.querySelectorAll(".content div.card");
  for (let i = 0; i < cards.length; i++) {
    cards[i].addEventListener("click", () => {
      showDetails(data[i], cards[i].children[1].src);
      document.querySelector(".details").classList.add("show");
    });
  }
  document.querySelector(".border-info").addEventListener("click", () => {
    document.querySelector(".details").classList.remove("show");
  });
}

function showDetails(data, url) {
  let img = document.querySelector(".details .card-header img");
  let infoItems = document.querySelectorAll(".details .info");
  let personName = document.querySelector(".details .card-title");
  const { name, birth_year, eye_color, hair_color, height, mass } = data;
  personName.textContent = name;
  infoItems[0].textContent = birth_year;
  infoItems[1].textContent = eye_color;
  infoItems[2].textContent = hair_color;
  infoItems[3].textContent = height;
  infoItems[4].textContent = mass;
  img.src = url;
}

function activePagination() {
  let pages = document.querySelectorAll(".page-item");
  pages.forEach((page) => {
    page.addEventListener("click", function () {
      pages.forEach((p) => p.classList.remove("active"));
      this.classList.add("active");
      getPersons(parseInt(this.textContent));
    });
  });
}

function createPagination(totalItems, itemsPerPage) {
  let pagination = "";
  let numberOfPages = Math.ceil(totalItems / itemsPerPage);
  for (let i = 0; i < numberOfPages; i++) {
    if (i === 0) {
      pagination += `
        <li class="page-item active">
          <a class="page-link" href="#">${i + 1}</a>
        </li>
      `;
      continue;
    }
    pagination += `
      <li class="page-item">
        <a class="page-link" href="#">${i + 1}</a>
      </li>
    `;
  }
  document
    .querySelector(".pagination li:first-child")
    .insertAdjacentHTML("afterend", pagination);
}
