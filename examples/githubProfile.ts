import * as request from 'superagent';

export async function getGithubProfile(username: string) {
    try {
        const response = await request
            .get(`https://api.github.com/users/${username}`)
            .set('User-Agent', 'edorivai/nock-record example');

        const { url, name, location } = response.body;
        return { url, name, location };
    } catch {}
}
