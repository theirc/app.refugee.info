import {Component} from 'react';

const GOOGLE_API_PREFIX = 'https://api.rss2json.com/v1/api.json';

export default class News extends Component {
    constructor(language = 'en') {
        super();
        this.language = language;
    }

    async downloadNews() {
        const NEWS_THAT_MOVES = `https://newsthatmoves.org/${this.language}/feed/`;
        try {
            const feed = await fetch(`${GOOGLE_API_PREFIX}?rss_url=${NEWS_THAT_MOVES}`);
            return JSON.parse(feed._bodyInit);
        }
        catch (e) {
        }
    }
}