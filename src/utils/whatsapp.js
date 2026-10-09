// WhatsApp Automation Utility
export const WHATSAPP_PHONE = '918445848985';
export const DISPLAY_PHONE = '+91 84458 48985';

/**
 * Builds encoded WhatsApp link containing the girl's custom date plan
 */
export function buildWhatsAppLink({ recipientName = 'Pretty Girl', customDatePlan = '' }) {
  let message = `Hey! 💕 I said YES on your date proposal website! 🥰\n\n`;
  
  if (customDatePlan && customDatePlan.trim()) {
    message += `The date I'd love to go on with you:\n"${customDatePlan.trim()}" 🌷✨\n\n`;
  } else {
    message += `I'm up for anything fun with you! 🌷✨\n\n`;
  }
  
  message += `Can't wait for our date! You made my heart smile. 🥂💖`;

  const encodedMessage = encodeURIComponent(message);
  return `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodedMessage}`;
}

/**
 * Opens WhatsApp directly with the pre-filled custom message
 */
export function triggerWhatsAppMessage({ recipientName, customDatePlan }) {
  const url = buildWhatsAppLink({ recipientName, customDatePlan });
  try {
    window.open(url, '_blank');
  } catch (err) {
    console.warn('Could not launch WhatsApp URL:', err);
    window.location.href = url;
  }
}
