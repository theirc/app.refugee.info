import {Component} from 'react';

const GOOGLE_API_PREFIX = 'https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=-1&q=';

export default class News extends Component {
    constructor(language = 'en') {
        super();
        this.language = language;
    }

    async downloadNews() {
        const NEWS_THAT_MOVES = `https://newsthatmoves.org/${this.language}/feed/`;
        try {
            let feed = await fetch(GOOGLE_API_PREFIX + NEWS_THAT_MOVES);
            let json = await feed.json();

            return json.responseData;
        }
        catch (e) {}
    }
}