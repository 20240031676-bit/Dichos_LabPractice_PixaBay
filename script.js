import { API_KEY } from "./config.js";

const searchForm = document.querySelector("#searchForm");
const searchInput = document.querySelector("#searchInput");
const mediaType = document.querySelector("#mediaType");
const status = document.querySelector("#status");
const results = document.querySelector("#results");
const challengeButtons = document.querySelectorAll(".challenge-btn");

const RESULTS_PER_REQUEST = 9;

/*
 * Updated CHALLENGES: Removed hardcoded `endpoint` and `image_type: "photo"`
 * so searches work dynamically for both Photos and Videos based on the dropdown.
 */
const CHALLENGES = {
  rocketLaunch: {
    label: "Rocket Launch",
    params: {
      q: "rocket launch",
      orientation: "horizontal",
      safesearch: "true",
      per_page: RESULTS_PER_REQUEST
    }
  },
  basketball: {
    label: "Basketball",
    params: {
      q: "basketball",
      category: "sports",
      safesearch: "true",
      per_page: RESULTS_PER_REQUEST
    }
  },
  forest: {
    label: "Forest",
    params: {
      q: "forest",
      category: "nature",
      safesearch: "true",
      per_page: RESULTS_PER_REQUEST
    }
  },
  roadForest: {
    label: "Road Forest",
    params: {
      q: "road forest",
      orientation: "horizontal",
      safesearch: "true",
      per_page: RESULTS_PER_REQUEST
    }
  }
};

function setStatus(message, type = "") {
  status.textContent = message;
  status.className = `status ${type}`.trim();
}

function setButtonsDisabled(disabled) {
  const buttons = [
    searchForm.querySelector("button"),
    ...challengeButtons
  ];
  buttons.forEach(button => {
    button.disabled = disabled;
  });
}

function showLoading() {
  setButtonsDisabled(true);
  setStatus("Loading...", "loading");
  results.innerHTML = Array.from({ length: 3 }, () => `
    <div class="card">
      <div class="skeleton"></div>
    </div>
  `).join("");
}

function clearResults() {
  results.innerHTML = "";
}

function showEmpty() {
  results.innerHTML = `
    <div class="empty">
      No results were found. Try another search term.
    </div>
  `;
}

function displayPhotos(hits) {
  results.innerHTML = "";
  hits.forEach(photo => {
    const card = document.createElement("article");
    card.className = "card";

    const image = document.createElement("img");
    image.src = photo.webformatURL;
    image.alt = photo.tags || "Pixabay photo";
    image.loading = "lazy";

    const info = document.createElement("div");
    info.className = "card-info";

    const text = document.createElement("p");
    text.textContent = photo.tags || "Pixabay photo";

    info.appendChild(text);
    card.append(image, info);
    results.appendChild(card);
  });
}

function displayVideos(hits) {
  results.innerHTML = "";
  hits.forEach(video => {
    const card = document.createElement("article");
    card.className = "card";

    const player = document.createElement("video");
    player.controls = true;
    player.preload = "metadata";

    const source = document.createElement("source");
    source.src = video.videos.medium?.url || video.videos.small?.url || video.videos.tiny?.url;
    source.type = "video/mp4";

    const info = document.createElement("div");
    info.className = "card-info";

    const text = document.createElement("p");
    text.textContent = video.tags || "Pixabay video";

    player.appendChild(source);
    info.appendChild(text);
    card.append(player, info);
    results.appendChild(card);
  });
}

function displayResults(data, type) {
  if (!data || !Array.isArray(data.hits)) {
    throw new Error("Pixabay returned an invalid response.");
  }

  if (data.hits.length === 0) {
    showEmpty();
    setStatus("No results found.", "success");
    return;
  }

  if (type === "photos") {
    displayPhotos(data.hits);
  } else {
    displayVideos(data.hits);
  }

  setStatus(`${data.hits.length} result(s) displayed.`, "success");
}

function buildUrl(type, query) {
  const endpoint = type === "photos" 
    ? "https://pixabay.com/api/" 
    : "https://pixabay.com/api/videos/";

  const params = new URLSearchParams({
    key: API_KEY,
    q: query,
    safesearch: "true",
    per_page: String(RESULTS_PER_REQUEST)
  });

  if (type === "photos") {
    params.set("image_type", "photo");
  }

  return `${endpoint}?${params.toString()}`;
}

async function requestPixabay(url, type, successMessage) {
  if (!API_KEY || API_KEY === "YOUR_PIXABAY_API_KEY") {
    clearResults();
    setStatus(
      "API key is missing. Create config.js and add your Pixabay API key.",
      "error"
    );
    return;
  }

  showLoading();

  try {
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 400 || response.status === 401) {
        throw new Error(
          "Pixabay rejected the request. Check the API key and request parameters."
        );
      }
      throw new Error(
        `Pixabay request failed with status ${response.status}.`
      );
    }

    const data = await response.json();
    displayResults(data, type);

    if (data.hits?.length) {
      setStatus(successMessage, "success");
    }
  } catch (error) {
    console.error(error);
    clearResults();
    setStatus(
      error.message ||
        "Unable to load results. Please check your internet connection.",
      "error"
    );
  } finally {
    setButtonsDisabled(false);
  }
}

function searchPixabay(query, type) {
  requestPixabay(
    buildUrl(type, query),
    type,
    `Search results for "${query}".`
  );
}

/*
 * Updated runChallenge to use mediaType.value dynamically from the dropdown
 */
function runChallenge(challengeKey) {
  const challenge = CHALLENGES[challengeKey];
  if (!challenge) {
    setStatus("Challenge configuration was not found.", "error");
    return;
  }

  if (!API_KEY || API_KEY === "YOUR_PIXABAY_API_KEY") {
    clearResults();
    setStatus(
      "API key is missing. Create config.js and add your Pixabay API key.",
      "error"
    );
    return;
  }

  const currentType = mediaType.value; // Reads 'photos' or 'videos' from dropdown

  const params = new URLSearchParams({ key: API_KEY });
  Object.entries(challenge.params).forEach(([key, value]) => {
    params.set(key, String(value));
  });

  if (currentType === "photos") {
    params.set("image_type", "photo");
  }

  const endpoint = currentType === "videos" 
    ? "https://pixabay.com/api/videos/" 
    : "https://pixabay.com/api/";

  requestPixabay(
    `${endpoint}?${params.toString()}`,
    currentType,
    `${challenge.label} results loaded.`
  );
}

searchForm.addEventListener("submit", event => {
  event.preventDefault();
  const query = searchInput.value.trim();

  if (!query) {
    setStatus("Please enter a search term.", "error");
    searchInput.focus();
    return;
  }

  searchPixabay(query, mediaType.value);
});

challengeButtons.forEach(button => {
  button.addEventListener("click", () => {
    runChallenge(button.dataset.challenge);
  });
});
