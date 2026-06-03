export const SAVED_SCHOLARSHIPS_KEY = "scholar_finder_saved_scholarships";

export type SavedScholarship = {
  id: number;
  title: string;
  provider: string;
  country: string;
  amount: string;
  scholarshipType: string;
  deadline: string;
  applyLink: string;
  description: string;
  imageUrl: string;
  matchPercentage?: number;
  matchedCriteria?: string[];
  unmatchedCriteria?: string[];
  savedAt: string;
};

export const getStoredSavedScholarships = (): SavedScholarship[] => {
  try {
    const saved = localStorage.getItem(SAVED_SCHOLARSHIPS_KEY);
    if (!saved) return [];

    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveStoredScholarships = (scholarships: SavedScholarship[]) => {
  localStorage.setItem(SAVED_SCHOLARSHIPS_KEY, JSON.stringify(scholarships));
};

export const saveScholarship = (
  scholarship: Omit<SavedScholarship, "savedAt">,
) => {
  const existing = getStoredSavedScholarships();
  const nextScholarship: SavedScholarship = {
    ...scholarship,
    savedAt: new Date().toISOString(),
  };
  const next = [
    nextScholarship,
    ...existing.filter((item) => item.id !== scholarship.id),
  ];

  saveStoredScholarships(next);
  return next;
};

export const removeSavedScholarship = (scholarshipId: number) => {
  const next = getStoredSavedScholarships().filter(
    (scholarship) => scholarship.id !== scholarshipId,
  );
  saveStoredScholarships(next);
  return next;
};

export const isScholarshipSaved = (scholarshipId: number) =>
  getStoredSavedScholarships().some(
    (scholarship) => scholarship.id === scholarshipId,
  );
