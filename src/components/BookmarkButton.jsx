export default function BookmarkButton({ isBookmarked, onClick, large = false }) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`cursor-pointer transition-all duration-200 rounded-full flex items-center justify-center ${
        isBookmarked
          ? "bg-accent text-white hover:bg-accent-light"
          : "bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
      } ${large ? "w-12 h-12 text-xl" : "w-9 h-9 text-base"}`}
      title={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
    >
      {isBookmarked ? "★" : "☆"}
    </button>
  );
}
