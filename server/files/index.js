window.onload = function () {
  const xhr = new XMLHttpRequest();

  // HELPER FUNCTIONS
  function formatDate(isoDate) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return day + " " + month + " " + year;
  }

  function createCreditBlock(labelText, items) {
    const block = document.createElement("section");
    block.className = "credit-block";

    const label = document.createElement("h3");
    label.className = "info-label";
    label.textContent = labelText;

    const list = document.createElement("ul");
    items.forEach(function(item) {
      const li = document.createElement("li");
      li.textContent = item;
      list.append(li);
    });

    block.append(label, list);
    return block;
  }

  xhr.onload = function () {
    const bodyElement = document.body;

    if (xhr.status == 200) {
      const movies = JSON.parse(xhr.responseText);

      const heading = document.createElement("h1");
      heading.textContent = "Movie Collection";
      bodyElement.append(heading);

      const container = document.createElement("main");
      container.className = "movie-container";
      bodyElement.append(container);

      movies.forEach(function(movie) {
        const article = document.createElement("article");
        article.id = movie.imdbID;

        const header = document.createElement("header");

        const overviewSection = document.createElement("div");
        overviewSection.className = "overview";

        const detailsSection = document.createElement("div");
        detailsSection.className = "details";

        const creditsSection = document.createElement("section");
        creditsSection.className = "credits";

        const ratingsSection = document.createElement("div");
        ratingsSection.className = "ratings-section"; 

        // HEADER
        const title = document.createElement("h2");
        title.textContent = movie.Title;
        header.append(title);

        // POSTER
        const posterWrapper = document.createElement("div");
        posterWrapper.className = "poster-wrapper";

        const poster = document.createElement("img");
        poster.src = movie.Poster;
        poster.alt = movie.Title + " poster";

        posterWrapper.append(poster);
        overviewSection.append(posterWrapper);

        // METADATA
        const meta = document.createElement("dl");
        meta.className = "meta";

        const releaseLabel = document.createElement("dt");
        releaseLabel.textContent = "Release:";

        const releaseValue = document.createElement("dd");
        const time = document.createElement("time");
        time.dateTime = movie.Released;
        time.textContent = formatDate(movie.Released);
        releaseValue.append(time);

        const separator = document.createElement("span");
        separator.className = "separator";
        separator.textContent = "|";

        const runtimeLabel = document.createElement("dt");
        runtimeLabel.textContent = "Runtime:";

        const runtimeValue = document.createElement("dd");
        runtimeValue.textContent = movie.Runtime + " min";

        meta.append(releaseLabel, releaseValue, separator, runtimeLabel, runtimeValue);
        overviewSection.append(meta);

        // GENRES
        const genres = document.createElement("ul");
        genres.className = "genre-list";

        movie.Genres.forEach(function(genre) {
          const genreItem = document.createElement("li");
          const genreSpan = document.createElement("span");
          genreSpan.className = "genre";
          genreSpan.textContent = genre;
          genreItem.append(genreSpan);
          genres.append(genreItem);
        });

        overviewSection.append(genres);

        // PLOT
        const plotSection = document.createElement("section");

        const plotHeading = document.createElement("h3");
        plotHeading.className = "section-heading";
        plotHeading.textContent = "Plot:";

        const plot = document.createElement("p");
        plot.className = "plot";
        plot.textContent = movie.Plot;

        plotSection.append(plotHeading, plot);

        // CREDITS
        creditsSection.append(
          createCreditBlock("Actors:", movie.Actors),
          createCreditBlock("Directors:", movie.Directors),
          createCreditBlock("Writers:", movie.Writers)
        );

        // RATINGS
        const ratings = document.createElement("div");
        ratings.className = "ratings";

        const metascore = document.createElement("span");
        metascore.textContent = "Metascore: " + movie.Metascore;

        const imdbRating = document.createElement("span");
        imdbRating.textContent = "IMDb Rating: " + movie.imdbRating;

        ratings.append(metascore, imdbRating);
        ratingsSection.append(ratings);

        // EDIT BUTTON
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.onclick = function() {
          location.href = "edit.html?imdbID=" + movie.imdbID;
        };
        ratingsSection.append(editButton);

        // FINAL ASSEMBLY
        detailsSection.append(plotSection, creditsSection);
        article.append(header, overviewSection, detailsSection, ratingsSection);
        container.append(article);
      });

    } else {
      bodyElement.append("Data could not be loaded: " + xhr.status +
          " - " + xhr.statusText);
    }
  };

  xhr.open("GET", "/movies");
  xhr.send();
};
