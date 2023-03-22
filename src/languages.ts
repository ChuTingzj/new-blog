import { KNOWLEDGE_CLASS, KNOWN_CLASS_CODES } from './consts';
export { KNOWLEDGE_CLASS, KNOWN_CLASS_CODES };

export const langPathRegex = /\/([a-z]{2}-?[A-Z]{0,2})\//;

export function getClassFromURL(pathname: string) {
	const langCodeMatch = pathname.match(langPathRegex);
	const langCode = langCodeMatch ? langCodeMatch[1] : 'en';
	return langCode as (typeof KNOWN_CLASS_CODES)[number];
}
