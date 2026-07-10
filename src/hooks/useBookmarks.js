import { useState, useEffect } from "react";

export default function useBookmarks() {
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem("travel-bookmarks");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem("travel-notes");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem("travel-bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem("travel-notes", JSON.stringify(notes));
  }, [notes]);

  const toggleBookmark = (id) => {
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  const updateNote = (id, text) => {
    setNotes((prev) => {
      if (!text.trim()) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: text };
    });
  };

  const getNote = (id) => notes[id] || "";

  const isBookmarked = (id) => bookmarks.includes(id);

  return { bookmarks, notes, toggleBookmark, updateNote, getNote, isBookmarked };
}
