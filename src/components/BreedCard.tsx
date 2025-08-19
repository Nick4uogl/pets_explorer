import Image from "next/image";

interface BreedCardProps {
  name: string;
  imageUrl: string;
}

export default function BreedCard({ name, imageUrl }: BreedCardProps) {
  return (
    <div className="bg-gray-100 min-h-[270px] rounded-lg shadow-md overflow-hidden flex flex-col items-center p-4 w-full">
      <div className="w-full h-48 relative mb-4">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover rounded-md"
          sizes="(max-width: 768px) 100vw, 300px"
          priority
        />
      </div>
      <h2 className="text-lg font-semibold text-center">{name}</h2>
    </div>
  );
}
