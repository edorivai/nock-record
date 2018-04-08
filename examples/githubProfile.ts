import * as request from 'superagent';

export async function getGithubProfile(username: string) {
	const response = await request.get(`https://api.github.com/users/${username}`);

	const { url, name, location } = response.body;
	return { url, name, location };
}