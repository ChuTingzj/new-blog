export const SITE = {
	title: 'Record',
	description: 'Your website description.',
} as const;

export const OPEN_GRAPH = {
	image: {
		src: 'https://github.com/withastro/astro/blob/main/assets/social/banner-minimal.png?raw=true',
		alt:
			'astro logo on a starry expanse of space,' +
			' with a purple saturn-like planet floating in the right foreground',
	},
	twitter: 'astrodotbuild',
};

export const KNOWLEDGE_CLASS = {
	FrontEnd: 'fe',
	BackEnd: 'be',
} as const;
export const KNOWN_CLASS_CODES = Object.values(KNOWLEDGE_CLASS);

export const GITHUB_EDIT_URL = `https://github.com/ChuTingzj/new-blog/tree/master/src/content`;

export const COMMUNITY_INVITE_URL = ``;

// See "Algolia" section of the README for more information.
export const ALGOLIA = {
	indexName: 'XXXXXXXXXX',
	appId: 'XXXXXXXXXX',
	apiKey: 'XXXXXXXXXX',
};

export type Sidebar = Record<
	(typeof KNOWN_CLASS_CODES)[number],
	Record<string, { text: string; link: string }[]>
>;
export const SIDEBAR: Sidebar = {
	fe: {
		'FrontEnd': [
			{ text: 'Introduction', link: 'fe/introduction' },
			{ text: 'Browser', link: 'fe/browser' },
			{ text: 'Javascript', link: 'fe/js' },
			{ text: 'Typescript', link: 'fe/typescript' },
			{ text: 'Types', link: 'fe/types' },
			{ text: 'Tips', link: 'fe/tips' },
			{ text: 'Supreme', link: 'fe/supreme' },
			{ text: 'Svelte', link: 'fe/svelte' },
			{ text: 'Vue', link: 'fe/vue' },
			{ text: 'React', link: 'fe/react' },
			{ text: 'Solid', link: 'fe/solid' },
		],
	},
	be: {
		'BackEnd': [{ text: 'Introduction', link: 'be/introduction' }, { text: 'Docker', link: 'be/docker' }, { text: 'Nest', link: 'be/nestjs' }, { text: 'Rust', link: 'be/rust' }],

	}
};
