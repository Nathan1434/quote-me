import Quote from '../types/quote';
import { API_URL } from '../utils/constants';

const formatQuote = (data: any) => ({
	_id: data._id,
	text: data.content,
	author: {
		name: data.author,
		slug: data.authorSlug,
	},
	tags: data.tags,
});

export async function getQuotes(opts?: { author?: string }) {
	try {
		const params = new URLSearchParams();
		if (opts?.author) params.append('author', opts.author);

		const urlWithParams = `${API_URL}/quotes?limit=5${params.toString() ? `&${params.toString()}` : ''}`;

		const response = await fetch(urlWithParams);
		const data = await response.json();

		return data.results.map(formatQuote);
	} catch (error) {
		console.error(error);
		throw new Error('Failed to fetch quotes');
	}
}

export async function getRandomQuote(opts?: { tag?: string }): Promise<Quote | null> {
	try {
		const params = new URLSearchParams();
		if (opts?.tag) params.append('tags', opts.tag);

		const urlWithParams = `${API_URL}/quotes/random${params.toString() ? `?${params.toString()}` : ''}`;

		const response = await fetch(urlWithParams);
		const data = await response.json();

		if (!data?.length) return null;

		return formatQuote(data[0]);
	} catch (error) {
		console.error(error);
		throw new Error('Failed to fetch random quote');
	}
}

export async function getTags() {
	try {
		const response = await fetch(`${API_URL}/tags`);
		const data = await response.json();

		const tags = data
			.filter((tag: any) => tag.quoteCount > 2)
			.map((tag: any) => ({ _id: tag._id, name: tag.name, slug: tag.slug }));

		return tags;
	} catch (error) {
		console.error(error);
		throw new Error('Failed to fetch tags');
	}
}
