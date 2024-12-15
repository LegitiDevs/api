const SORTING_METHOD_LOOKUP = {
    "default": { locked: -1, player_count: -1, votes: -1 }, // Online worlds first sorted by player count, then votes
    "votes": { votes: -1 },
    "visits": { visits: -1 },
    "recently_scraped": { last_scraped: -1 },
}

// ADD recently_added when creation_date_unix_time gets added.

export const getSortingMethod = (sort) => {
    if (!(sort in SORTING_METHOD_LOOKUP)) return SORTING_METHOD_LOOKUP["default"]
    return SORTING_METHOD_LOOKUP[sort]
}