export interface StudentDocument {
  id: string;
  name: string;
  status: "uploaded" | "pending";
  fileName?: string;
  uploadedAt?: string;
}

export const STUDENT_DOCUMENTS_KEY = "scholar_finder_student_documents";

export const defaultStudentDocuments: StudentDocument[] = [
  {
    id: "ol-certificate",
    name: "O/L Certificate",
    status: "uploaded",
    fileName: "ol_certificate.pdf",
  },
  {
    id: "al-certificate",
    name: "A/L Certificate",
    status: "uploaded",
    fileName: "al_certificate.pdf",
  },
  {
    id: "nic-copy",
    name: "NIC Copy",
    status: "uploaded",
    fileName: "nic_copy.pdf",
  },
  {
    id: "ielts-certificate",
    name: "IELTS Certificate",
    status: "uploaded",
    fileName: "ielts_cert.pdf",
  },
  {
    id: "cv-resume",
    name: "CV / Resume",
    status: "pending",
  },
  {
    id: "personal-statement",
    name: "Personal Statement",
    status: "pending",
  },
];

export function getStoredStudentDocuments(): StudentDocument[] {
  if (typeof window === "undefined") {
    return defaultStudentDocuments;
  }

  const stored = window.localStorage.getItem(STUDENT_DOCUMENTS_KEY);
  if (!stored) {
    return defaultStudentDocuments;
  }

  try {
    const parsed = JSON.parse(stored) as StudentDocument[];
    const merged = [...parsed];

    defaultStudentDocuments.forEach((doc) => {
      if (!merged.some((storedDoc) => storedDoc.id === doc.id)) {
        merged.push(doc);
      }
    });

    return merged;
  } catch {
    return defaultStudentDocuments;
  }
}

export function saveStudentDocuments(documents: StudentDocument[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STUDENT_DOCUMENTS_KEY, JSON.stringify(documents));
}

export function getUploadedStudentDocuments() {
  return getStoredStudentDocuments().filter(
    (document) => document.status === "uploaded",
  );
}
