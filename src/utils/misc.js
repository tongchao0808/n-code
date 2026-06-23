export function formatFileSize(sizeStr) {
  if (!sizeStr) {
    return "";
  }
  sizeStr = sizeStr.toString();
  const bytes = Number(sizeStr);

  if (bytes < 1024) {
    return `${bytes}b`;
  } else if (bytes < 1024 * 1024) {
    const kb = (bytes / 1024).toFixed(2);
    return `${kb}kb`;
  } else {
    const mb = (bytes / (1024 * 1024)).toFixed(2);
    return `${mb}mb`;
  }
}
