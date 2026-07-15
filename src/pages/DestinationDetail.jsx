import { useParams, useNavigate, Link } from "react-router-dom";
import destinations from "../data/destinations";

export default function DestinationDetail() {
  const params = useParams();
  const id = params?.id;
  const navigate = useNavigate();
  const destination = destinations?.find?.((d) => d?.id === Number(id));

  if (!destination) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg mb-6">Destination not found</p>
        <Link to="/" className="text-primary font-semibold">← Back</Link>
      </div>
    );
  }

  const goRandom = () => {
    const others = destinations.filter((d) => d.id !== destination.id);
    const random = others[Math.floor(Math.random() * others.length)];
    if (random) navigate(`/destination/${random.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Link to="/" className="text-gray-500 hover:text-primary">← Back</Link>
      <h1 className="text-3xl font-bold mt-4">{destination.name}</h1>
      <p className="text-gray-500 mt-2">{destination.shortDescription}</p>
      <div className="flex flex-wrap gap-2 mt-4">
        {destination.famousFor?.map((f) => (
          <span key={f} className="bg-blue-50 dark:bg-blue-900/30 text-primary px-4 py-2 rounded-full text-sm">{f}</span>
        ))}
      </div>
      <button onClick={goRandom} className="mt-6 inline-flex items-center gap-2 text-gray-500 hover:text-primary font-medium text-sm cursor-pointer bg-transparent border-0">
        🎲 Show me another
      </button>
    </div>
  );
}
