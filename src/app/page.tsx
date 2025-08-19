import HomeContent from "../components/HomeContent";
import type { DogBreed, CatBreed, DogImageApi } from "../types/breeds";
import { DOG_API_KEY, CAT_API_KEY } from "../constants/api";

async function fetchDogBreeds() {
  const res = await fetch(
    "https://api.thedogapi.com/v1/images/search?limit=30&has_breeds=1",
    {
      headers: {
        "x-api-key": DOG_API_KEY,
      },
      cache: "no-store",
    }
  );
  if (!res.ok) throw new Error("Failed to fetch dog breeds");
  const dogData: DogImageApi[] = await res.json();
  const dogWithBreeds: DogBreed[] = dogData
    .filter((img) => img.breeds && img.breeds.length > 0)
    .sort(() => 0.5 - Math.random())
    .slice(0, 12)
    .map((img) => ({
      id: img.id,
      breedId: img.breeds[0].id,
      name: img.breeds[0].name,
      imageUrl: img.url,
    }));
  return dogWithBreeds;
}

async function fetchCatBreeds() {
  const res = await fetch("https://api.thecatapi.com/v1/breeds", {
    headers: {
      "x-api-key": CAT_API_KEY,
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch cat breeds");
  const catData: CatBreed[] = await res.json();
  // For each breed, fetch an image using /images/search?breed_id=...
  const catWithImages = await Promise.all(
    catData.slice(0, 12).map(async (breed) => {
      let imageUrl = breed.image?.url;
      if (!imageUrl) {
        const imgRes = await fetch(
          `https://api.thecatapi.com/v1/images/search?breed_id=${breed.id}&limit=1`,
          {
            headers: {
              "x-api-key": CAT_API_KEY,
            },
            cache: "no-store",
          }
        );
        if (imgRes.ok) {
          const imgData = await imgRes.json();
          if (imgData.length > 0) {
            imageUrl = imgData[0].url;
          }
        }
      }
      return imageUrl
        ? { id: breed.id, name: breed.name, image: { url: imageUrl } }
        : null;
    })
  );
  return catWithImages.filter(Boolean) as CatBreed[];
}

export default async function Home() {
  let dogBreeds: DogBreed[] = [];
  let catBreeds: CatBreed[] = [];
  let error: string | null = null;
  try {
    [dogBreeds, catBreeds] = await Promise.all([
      fetchDogBreeds(),
      fetchCatBreeds(),
    ]);
  } catch (e) {
    error = e instanceof Error ? e.message : "Unknown error";
  }

  return (
    <HomeContent dogBreeds={dogBreeds} catBreeds={catBreeds} error={error} />
  );
}
