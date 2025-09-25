export interface ShareResult {
  success: boolean;
  method?: 'whatsapp' | 'clipboard' | 'system_share';
  error?: string;
}

export const shareViaWebShare = async (text: string, title: string = 'Share'): Promise<ShareResult> => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: title,
        text: text,
      });
      return { success: true, method: 'system_share' };
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        return { success: false, error: 'Share cancelled', method: 'system_share' };
      }
      console.error('Web Share API failed:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Web Share API failed', method: 'system_share' };
    }
  }
  return { success: false, error: 'Web Share API not supported' };
};

export const copyToClipboard = async (text: string): Promise<ShareResult> => {
  try {
    await navigator.clipboard.writeText(text);
    return { success: true, method: 'clipboard' };
    } catch (error: unknown) {
      console.error('Failed to copy to clipboard:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Failed to copy to clipboard', method: 'clipboard' };
  }
};

export const shareWhatsAppDirect = (text: string): ShareResult => {
  const encodedText = encodeURIComponent(text);
  const whatsappUrl = `whatsapp://send?text=${encodedText}`;
  try {
    window.open(whatsappUrl, '_blank');
    return { success: true, method: 'whatsapp' };
    } catch (error: unknown) {
      console.error('Failed to open WhatsApp:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Failed to open WhatsApp', method: 'whatsapp' };
  }
};