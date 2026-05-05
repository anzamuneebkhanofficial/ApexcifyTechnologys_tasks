export const getImageUrl = (path) => {
  if (!path || path.trim() === '') return null;
  if (path.startsWith('http')) return path;
  
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const serverUrl = baseUrl.replace('/api', '');
  
  // ensure no double slashes
  return `${serverUrl}${path.startsWith('/') ? path : '/' + path}`;
};
