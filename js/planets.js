document.addEventListener("DOMContentLoaded", () => {
  getPlanets(1, true);
});

async function getPlanets(page, create = false) {
  try {
    const response = await fetch(`https://swapi.dev/api/planets/?page=${page}`);
    const data = await response.json();

    showAllPlanets(data.results);

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

function showAllPlanets(data) {
  let content = document.querySelector(".content");
  content.innerHTML = "";
  data.forEach((element) => {
    let imgURL = `https://starwars-visualguide.com/assets/img/planets/${
      element.url.match(/\/([0-9]*)\/$/)[1]
    }.jpg`;
    let str = `
      <div class="card mb-3">
        <h3 class="card-header">${element.name}</h3>
        <img src="${imgURL}" class="d-block user-select-none">
      </div>
    `;
    content.insertAdjacentHTML("beforeend", str);
  });
  showPlanetDetails(data);
}

function showPlanetDetails(data) {
  let cards = document.querySelectorAll(".content div.card");
  let img = document.querySelectorAll(".content div.card img");
  for (let j = 0; j < img.length; j++) {
    img[j].onerror = function () {
      img[j].src =
        "https://starwars-visualguide.com/assets/img/placeholder.jpg";
    };
  }

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
  let title = document.querySelector(".details .card-title");
  const {
    name,
    population,
    rotation_period,
    orbital_period,
    diameter,
    gravity,
  } = data;
  title.textContent = name;
  infoItems[0].textContent = population;
  infoItems[1].textContent = rotation_period;
  infoItems[2].textContent = orbital_period;
  infoItems[3].textContent = diameter;
  infoItems[4].textContent = gravity;
  img.src = url;
}

function activePagination() {
  let pages = document.querySelectorAll(".page-item");
  pages.forEach((page) => {
    page.addEventListener("click", function () {
      pages.forEach((p) => p.classList.remove("active"));
      this.classList.add("active");
      getPlanets(parseInt(this.textContent));
    });
  });
}

function createPagination(totalPages, itemsPerPage) {
  let pagination = "";
  let numberOfPages = Math.ceil(totalPages / itemsPerPage);
  for (let i = 0; i < numberOfPages; i++) {
    if (i === 0) {
      pagination += `<li class="page-item active">
        <a class="page-link" href="#">${i + 1}</a>
      </li>`;
      continue;
    }
    pagination += `<li class="page-item">
      <a class="page-link" href="#">${i + 1}</a>
    </li>`;
  }
  document
    .querySelector(".pagination li:first-child")
    .insertAdjacentHTML("afterend", pagination);
}
