const SORTING_METHOD_LOOKUP = {
    ascending: {
        "default": { locked: -1, player_count: -1, votes: -1 }, // Online worlds first sorted by player count, then votes
        "votes": { votes: -1 },
        "visits": { visits: -1 },
        "recently_scraped": { last_scraped: -1 },
        "recently_created": { creation_date_unix_time: -1 }
    },
    descending: {
        "default": { locked: 1, player_count: 1, votes: 1 }, // Online worlds first sorted by player count, then votes
        "votes": { votes: 1 },
        "visits": { visits: 1 },
        "recently_scraped": { last_scraped: 1 },
        "recently_created": { creation_date_unix_time: 1 }
    },
}

export const getSortingMethod = (sortMethod, direction) => {
    const { ascending } = SORTING_METHOD_LOOKUP;
    const directionLookup = SORTING_METHOD_LOOKUP[direction] || ascending;
    return directionLookup[sortMethod] || directionLookup.default;
};

export const deRegexifyTheRegexSoTheUserDoesntDoMaliciousThings = input => input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');