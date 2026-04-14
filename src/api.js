const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

export const searchBooks = async (
  query,
  page = 1,
  limit = 35,
  mode = "search"
) => {
  try {
    await sleep(200);

    const startIndex = (page - 1) * limit;

    // ✅ KEY FIX: different query types
    let q = "";

    if (mode === "genre") {
      q = `subject:${query}`; // for genres
    } else {
      q = `intitle:${query}`; // for search
    }

    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${q}&orderBy=relevance&startIndex=${startIndex}&maxResults=${limit}`
    );

    if (!res.ok) return [];

    const data = await res.json();

    return (
      data.items
        ?.filter(
          (item) =>
            item.volumeInfo?.imageLinks?.thumbnail // remove broken books
        )
        .map((item) => ({
          id: item.id,
          title: item.volumeInfo.title,
          genre: query,
          rating: item.volumeInfo.averageRating || 4,
          thumbnail: item.volumeInfo.imageLinks.thumbnail
        })) || []
    );
  } catch {
    return [];
  }
};