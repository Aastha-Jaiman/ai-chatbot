const chunkText = (text, maxLength = 500, overlap = 100) => {
  if (!text) return [];

  // Normalize line endings and spaces
  const normalizedText = text.replace(/\s+/g, " ").trim();
  const chunks = [];
  let index = 0;

  while (index < normalizedText.length) {
    // Slice text to length
    let chunk = normalizedText.substring(index, index + maxLength);
    
    // Attempt to end on a space to avoid cutting words in half (if not at the end of the text)
    if (index + maxLength < normalizedText.length) {
      const lastSpaceIndex = chunk.lastIndexOf(" ");
      if (lastSpaceIndex > maxLength / 2) {
        chunk = chunk.substring(0, lastSpaceIndex);
      }
    }

    chunks.push(chunk.trim());
    index += chunk.length - overlap;

    // Safety check to prevent infinite loop if overlap is too large
    if (chunk.length <= overlap) {
      index += overlap;
    }
  }

  return chunks.filter((c) => c.length > 0);
};

module.exports = {
  chunkText,
};
