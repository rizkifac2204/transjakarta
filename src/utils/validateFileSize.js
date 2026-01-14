function validateFileSize(file, maxBytes) {
  if (file.size > maxBytes) {
    const sizeInMB = (maxBytes / (1024 * 1024)).toFixed(2);
    return `Ukuran file maksimal ${sizeInMB}MB`;
  }
  return null;
}

export default validateFileSize;
