// hooks/useShare.ts
import { useCallback } from 'react';

type ShareOptions = {
  text?: string;
  url?: string;
  imageUrl?: string; // Instagram might use this in the future, as of 2021 it doesn't
};

const useSocialMediaShare = () => {
  const shareOnFacebook = useCallback(({ text, url }: ShareOptions) => {
    const link = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url || window.location.href)}&quote=${encodeURIComponent(text || '')}`;
    window.open(link, '_blank');
  }, []);

  const shareOnInstagram = useCallback(({ imageUrl }: ShareOptions) => {
    // As of 2021, there's no direct web link to share images on Instagram.
    // We can only guide users to open the app.
    alert("To share on Instagram, please save the image and upload it on the Instagram app.");
  }, []);

  const shareOnWhatsApp = useCallback(({ text, url }: ShareOptions) => {
    const link = `https://wa.me/?text=${encodeURIComponent(text || '')} ${encodeURIComponent(url || window.location.href)}`;
    window.open(link, '_blank');
  }, []);

  const shareOnTwitter = useCallback(({ text, url }: ShareOptions) => {
    const link = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text || '')}&url=${encodeURIComponent(url || window.location.href)}`;
    window.open(link, '_blank');
  }, []);

  return {
    shareOnFacebook,
    shareOnInstagram,
    shareOnWhatsApp,
    shareOnTwitter
  };
};

export default useSocialMediaShare;
