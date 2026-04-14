import fs from "fs";

const GENRES = [
  "fiction",
  "romance",
  "fantasy",
  "history",
  "science",
  "mystery",
  "thriller",
  "biography",
  "adventure",
  "self-help", // ✅ fixed
  "nonfiction"
];

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY; // 🔴 put your real key locally

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const RANDOM_RATINGS = [2.5, 3, 3.5, 4, 4.5];

const getRandomRating = () =>
  RANDOM_RATINGS[Math.floor(Math.random() * RANDOM_RATINGS.length)];

const getBooks = async () => {
  let result = {};

  /* ---------------- FIRST PASS ---------------- */

  for (let genre of GENRES) {
    let collected = [];
    let page = 0;

    try {
      while (collected.length < 20 && page < 5) {
        const res = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=subject:${genre}&orderBy=relevance&startIndex=${page * 40}&maxResults=40&printType=books&key=${API_KEY}`
        );

        const data = await res.json();

        if (!data.items) break;

        const filtered = data.items.filter((item) => {
          const info = item.volumeInfo;
          return info.title && info.imageLinks?.thumbnail;
        });

        collected = [...collected, ...filtered];

        page++;
        await sleep(500);
      }

      result[genre] = collected.slice(0, 20).map((item) => ({
        id: item.id,
        title: item.volumeInfo.title,
        rating: item.volumeInfo.averageRating ?? getRandomRating(),
        thumbnail: item.volumeInfo.imageLinks.thumbnail
      }));

      console.log(`✅ ${genre}: ${result[genre].length} books`);
    } catch (e) {
      console.log(`❌ error ${genre}`, e);
    }
  }

  /* ---------------- RETRY LOGIC ---------------- */

  const MIN_BOOKS = 15;
  const MAX_RETRIES = 3;

  let retries = 0;

  while (retries < MAX_RETRIES) {
    const failedGenres = Object.entries(result)
      .filter(([_, books]) => books.length < MIN_BOOKS);

    if (failedGenres.length === 0) break;

    console.log(
      `🔁 Retry ${retries + 1} for:`,
      failedGenres.map(([g]) => g)
    );

    for (let [genre, existingBooks] of failedGenres) {
      let collected = [...existingBooks];
      let page = 0;

      while (collected.length < 20 && page < 5) {
        const res = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=subject:${genre}&orderBy=relevance&startIndex=${page * 40}&maxResults=40&printType=books&key=${API_KEY}`
        );

        const data = await res.json();

        if (!data.items) {
          page++;
          continue;
        }

        const filtered = data.items.filter((item) => {
          const info = item.volumeInfo;
          return info.title && info.imageLinks?.thumbnail;
        });

        collected = [...collected, ...filtered];

        page++;
        await sleep(800); // 🔥 slower retry
      }

      result[genre] = collected.slice(0, 20).map((item) => ({
        id: item.id,
        title: item.volumeInfo.title,
        rating: item.volumeInfo.averageRating ?? getRandomRating(),
        thumbnail: item.volumeInfo.imageLinks.thumbnail
      }));

      console.log(`🔄 ${genre}: ${result[genre].length} after retry`);
    }

    retries++;
  }

  /* ---------------- SAVE FILES ---------------- */

  fs.writeFileSync("books.json", JSON.stringify(result, null, 2));

  const flat = Object.entries(result).flatMap(([genre, books]) =>
    books.map((b) => ({ ...b, genre }))
  );

  fs.writeFileSync("books_flat.json", JSON.stringify(flat, null, 2));

  console.log("✅ Done! Files created:");
  console.log(" - books.json");
  console.log(" - books_flat.json");
};

getBooks();