export const getSource = (url: string) => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname.replace('www.', '');
  } catch (error) {
    console.error("Invalid URL:", url, error);
    return "Unknown Source";
  }
}