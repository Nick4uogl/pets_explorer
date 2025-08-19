import { notFound } from "next/navigation";
import Image from "next/image";
import {
  DogBreedDetail,
  CatBreedDetail,
  GalleryImage,
} from "../../../../types/breeds";
import { DOG_API_KEY, CAT_API_KEY } from "../../../../constants/api";

export type PageProps = { params: Promise<{ type: string; id: string }> };

async function fetchDogBreed(id: string) {
  const res = await fetch(`https://api.thedogapi.com/v1/breeds`, {
    headers: {
      "x-api-key": DOG_API_KEY,
    },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const breeds: DogBreedDetail[] = await res.json();
  return breeds.find((b) => b.id.toString() === id) || null;
}

async function fetchCatBreed(id: string) {
  const res = await fetch(`https://api.thecatapi.com/v1/breeds/${id}`, {
    headers: {
      "x-api-key": CAT_API_KEY,
    },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return await res.json();
}

async function fetchDogGallery(id: string) {
  const res = await fetch(
    `https://api.thedogapi.com/v1/images/search?breed_id=${id}&limit=8`,
    {
      headers: {
        "x-api-key": DOG_API_KEY,
      },
      cache: "no-store",
    }
  );
  if (!res.ok) return [];
  return (await res.json()) as GalleryImage[];
}

async function fetchCatGallery(id: string) {
  const res = await fetch(
    `https://api.thecatapi.com/v1/images/search?breed_id=${id}&limit=8`,
    {
      headers: {
        "x-api-key": CAT_API_KEY,
      },
      cache: "no-store",
    }
  );
  if (!res.ok) return [];
  return (await res.json()) as GalleryImage[];
}

export default async function BreedDetailPage({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}) {
  const { type, id } = await params;
  let breed: DogBreedDetail | CatBreedDetail | null = null;
  let gallery: GalleryImage[] = [];

  try {
    if (type === "dog") {
      breed = await fetchDogBreed(id);
      gallery = await fetchDogGallery(id);
    } else if (type === "cat") {
      breed = await fetchCatBreed(id);
      gallery = await fetchCatGallery(id);
    } else {
      notFound();
    }
  } catch {
    notFound();
  }

  if (!breed) {
    notFound();
  }

  const renderWeight = (breed: DogBreedDetail | CatBreedDetail) =>
    breed.weight ? (
      <p>
        <b>Weight:</b> {breed.weight.imperial} lbs ({breed.weight.metric} kg)
      </p>
    ) : null;
  const renderHeight = (breed: DogBreedDetail | CatBreedDetail) =>
    breed.height ? (
      <p>
        <b>Height:</b> {breed.height.imperial} in ({breed.height.metric} cm)
      </p>
    ) : null;

  const mainImageUrl =
    (type === "dog" && (breed as DogBreedDetail).image?.url) ||
    gallery[0]?.url ||
    null;

  return (
    <main className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">{breed.name}</h1>
      {mainImageUrl && (
        <div className="relative w-full h-72 mb-6">
          <Image
            src={mainImageUrl}
            alt={breed.name}
            fill
            className="object-cover rounded-md"
            sizes="(max-width: 768px) 100vw, 500px"
            priority
          />
        </div>
      )}
      <div className="mb-6 space-y-1">
        {renderWeight(breed)}
        {renderHeight(breed)}
        {"temperament" in breed && breed.temperament && (
          <p>
            <b>Temperament:</b> {breed.temperament}
          </p>
        )}
        {"origin" in breed && breed.origin && (
          <p>
            <b>Origin:</b> {breed.origin}
          </p>
        )}
        {"life_span" in breed && breed.life_span && (
          <p>
            <b>Life Span:</b> {breed.life_span}
          </p>
        )}
        {"bred_for" in breed && (breed as DogBreedDetail).bred_for && (
          <p>
            <b>Bred For:</b> {(breed as DogBreedDetail).bred_for}
          </p>
        )}
        {"breed_group" in breed && (breed as DogBreedDetail).breed_group && (
          <p>
            <b>Breed Group:</b> {(breed as DogBreedDetail).breed_group}
          </p>
        )}
        {"description" in breed && breed.description && (
          <p className="mt-2">{breed.description}</p>
        )}
        {"wikipedia_url" in breed && breed.wikipedia_url && (
          <p className="mt-2">
            <a
              href={breed.wikipedia_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Wikipedia
            </a>
          </p>
        )}
      </div>
      <h2 className="text-2xl font-semibold mb-2">Gallery</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {gallery.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">
            No images found.
          </div>
        ) : (
          gallery.map((img) => (
            <div key={img.id} className="relative w-full h-64">
              <Image
                src={img.url}
                alt={breed!.name}
                fill
                className="object-cover rounded-md"
                sizes="(max-width: 768px) 100vw, 300px"
                priority={false}
              />
            </div>
          ))
        )}
      </div>
    </main>
  );
}
