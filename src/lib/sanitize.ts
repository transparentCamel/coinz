/**
 * Server-side HTML sanitization utility
 * Sanitizes HTML content to prevent XSS attacks
 */

import sanitizeHtmlLib from 'sanitize-html';

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param dirty - The unsanitized HTML string
 * @returns Sanitized HTML string safe for rendering
 */
export function sanitizeHtml(dirty: string): string {
  return sanitizeHtmlLib(dirty, {
    allowedTags: [
      'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'code', 'pre'
    ],
    allowedAttributes: {
      'a': ['href', 'title', 'target'],
      'img': ['src', 'alt', 'title', 'width', 'height'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedSchemesByTag: {
      img: ['http', 'https', 'data'],
    },
  });
}

