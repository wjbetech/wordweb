// Fetch related words from Datamuse API
export async function searchDatamuse(term: string): Promise<any[]> {
  const res = await fetch(`https://api.datamuse.com/words?ml=${encodeURIComponent(term)}`);
  if (!res.ok) throw new Error("Failed to fetch from Datamuse API");
  return res.json();
}
