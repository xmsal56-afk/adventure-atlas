import { useParams, useNavigate, Link } from "react-router-dom";
import destinations from "../data/destinations";
import SafeImage from "../components/SafeImage";

export default function DestinationDetail() {
  const params = useParams();
  const id = params?.id;
  const navigate = useNavigate();
  const destination = destinations?.find?.((d) => d?.id === Number(id));

  if (!destination) {
    return (
      <div className="text-center py-20">
        <Link to="/" className="text-primary font-semibold">← Back</Link>
      </div>
    );
  }

  const goRandom = () => {
    const others = destinations.filter((d) => d.id !== destination.id);
    const random = others[Math.floor(Math.random() * others.length)];
    if (random) navigate(`/destination/${random.id}`);
  };

  const { name, description, image, rating, region, country, bestTime, currency, language, famousFor, visaInfo, flightTimes } = destination;

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-1 text-gray-500 hover:text-primary mb-6 no-underline">← Back</Link>
      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="relative h-64 sm:h-80 md:h-96">
          <SafeImage src={image} alt={name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700">{region}</span>
              <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700">{country}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">{name}</h1>
          </div>
        </div>
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-accent text-xl">★</span>
            <span className="text-lg font-bold text-gray-900 dark:text-white">{rating}</span>
            <span className="text-gray-400 text-sm">/ 5.0</span>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-8">{description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <span className="text-sm text-gray-400 block">Best Time</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">{bestTime}</span>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <span className="text-sm text-gray-400 block">Currency</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">{currency}</span>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <span className="text-sm text-gray-400 block">Language</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">{language}</span>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <span className="text-sm text-gray-400 block">Region</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">{region}</span>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <span className="text-sm text-gray-400 block">Visa (US)</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">{visaInfo || "—"}</span>
            </div>
          </div>

          {famousFor && famousFor.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Famous For</h2>
              <div className="flex flex-wrap gap-2">
                {famousFor.map((f) => (
                  <span key={f} className="bg-blue-50 dark:bg-blue-900/30 text-primary font-medium px-4 py-2 rounded-full text-sm">{f}</span>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-700">
            <button onClick={goRandom}
              className="inline-flex items-center gap-2 text-gray-500 hover:text-primary font-medium text-sm cursor-pointer bg-transparent border-0">
              🎲 Show me another
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
