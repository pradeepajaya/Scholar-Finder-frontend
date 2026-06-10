export interface StudentDocument {
  id: string;
  name: string;
  status: "uploaded" | "pending";
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  fileDataUrl?: string;
  fileUrl?: string;
  uploadedAt?: string;
}

export const STUDENT_DOCUMENTS_KEY = "scholar_finder_student_documents";

function getStudentDocumentsStorageKey(studentId?: number | null) {
  return studentId && studentId > 0
    ? `${STUDENT_DOCUMENTS_KEY}_${studentId}`
    : null;
}

export const defaultStudentDocuments: StudentDocument[] = [
  {
    id: "ol-certificate",
    name: "O/L Certificate",
    status: "pending",
  },
  {
    id: "al-certificate",
    name: "A/L Certificate",
    status: "pending",
  },
  {
    id: "nic-copy",
    name: "NIC Copy",
    status: "pending",
  },
  {
    id: "ielts-certificate",
    name: "IELTS Certificate",
    status: "pending",
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

export function getStoredStudentDocuments(studentId?: number | null): StudentDocument[] {
  if (typeof window === "undefined") {
    return defaultStudentDocuments;
  }

  const storageKey = getStudentDocumentsStorageKey(studentId);
  if (!storageKey) {
    return defaultStudentDocuments;
  }

  const stored = window.localStorage.getItem(storageKey);
  if (!stored) {
    return defaultStudentDocuments;
  }

  try {
    const parsed = JSON.parse(stored) as StudentDocument[];
    return mergeStudentDocuments(parsed);
  } catch {
    return defaultStudentDocuments;
  }
}

export function mergeStudentDocuments(
  documents: StudentDocument[],
): StudentDocument[] {
  const merged = documents.map(normalizeStudentDocument);

  defaultStudentDocuments.forEach((doc) => {
    if (!merged.some((storedDoc) => storedDoc.id === doc.id)) {
      merged.push(doc);
    }
  });

  return merged;
}

export function saveStudentDocuments(
  documents: StudentDocument[],
  studentId?: number | null,
) {
  if (typeof window === "undefined") return true;

  try {
    const storageKey = getStudentDocumentsStorageKey(studentId);
    if (!storageKey) return true;

    window.localStorage.setItem(storageKey, JSON.stringify(documents));
    return true;
  } catch (error) {
    console.error("Failed to save student documents", error);
    return false;
  }
}

export function getUploadedStudentDocuments(studentId?: number | null) {
  return getStoredStudentDocuments(studentId).filter(
    (document) => document.status === "uploaded",
  );
}

export function normalizeStudentDocument(document: StudentDocument): StudentDocument {
  const hasStoredFile = Boolean(document.fileDataUrl || document.fileUrl);

  if (document.status === "uploaded" && !hasStoredFile) {
    return {
      ...document,
      status: "pending",
      fileName: undefined,
      fileType: undefined,
      fileSize: undefined,
      uploadedAt: undefined,
    };
  }

  return document;
}

export function readStudentDocumentFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Could not read the selected document."));
    };
    reader.onerror = () => {
      reject(reader.error ?? new Error("Could not read the selected document."));
    };
    reader.readAsDataURL(file);
  });
}

export function getStudentDocumentViewUrl(document: StudentDocument) {
  return document.fileUrl || document.fileDataUrl;
}

export function createStudentDocumentPreviewUrl(document: StudentDocument) {
  const viewUrl = getStudentDocumentViewUrl(document);
  if (!viewUrl) return null;
  if (!viewUrl.startsWith("data:")) return viewUrl;

  const commaIndex = viewUrl.indexOf(",");
  if (commaIndex === -1) return viewUrl;

  const metadata = viewUrl.slice(0, commaIndex);
  const data = viewUrl.slice(commaIndex + 1);
  const mimeType =
    metadata.match(/^data:([^;]+)/)?.[1] ||
    document.fileType ||
    "application/octet-stream";
  const decoded = metadata.includes(";base64") ? atob(data) : decodeURIComponent(data);
  const bytes = new Uint8Array(decoded.length);

  for (let index = 0; index < decoded.length; index += 1) {
    bytes[index] = decoded.charCodeAt(index);
  }

  return URL.createObjectURL(new Blob([bytes], { type: mimeType }));
}
