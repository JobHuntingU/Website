
import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';

export const useContent = (pageName) => {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await apiClient.get('/api/content');
        // Filter for this page and transform to object { [key]: value }
        const pageData = data
          .filter(item => item.page_name === pageName)
          .reduce((acc, item) => {
            acc[item.content_key] = item.content_value;
            return acc;
          }, {});
        setContent(pageData);
      } catch (err) {
        console.error('Failed to fetch content:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [pageName]);

  const getContent = (key, defaultValue) => {
    return content[key] || defaultValue;
  };

  return { content, loading, getContent };
};
