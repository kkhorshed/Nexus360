/**
 * Extracts initials from a full name
 * @param name Full name to extract initials from
 * @returns Uppercase initials (e.g. "John Doe" -> "JD")
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

/**
 * Formats a phone number to a consistent format
 * @param phone Phone number to format
 * @returns Formatted phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as XXX-XXX-XXXX
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  return phone; // Return original if not 10 digits
};

/**
 * Creates a full name from first and last name
 * @param firstName First name
 * @param lastName Last name
 * @returns Full name
 */
export const getFullName = (firstName: string, lastName: string): string => {
  return `${firstName} ${lastName}`.trim();
};
