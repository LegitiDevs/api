export function parseProject(projectString = "") {
    // Expects `field1,field2,!field3,!field4`
    const fields = projectString.split(",").filter(Boolean);
    
    if (fields.length === 0) return { _id: 0 };

    const hasExclusion = fields[0].startsWith("!");

    const project = Object.fromEntries(
        fields.map(field => {
            const isExclusion = field.startsWith("!");
            if (isExclusion !== hasExclusion) 
                throw new ApiError("Cannot combine exclusion and inclusion on projection.", 400);
            return isExclusion ? [field.slice(1), 0] : [field, 1];
        })
    );

    project._id = 0;
    return project;
}

const SORT_METHODS = {
    default: (d) => ({ locked: d, player_count: d, votes: d }),
    votes: (d) => ({ votes: d }),
    visits: (d) => ({ visits: d }),
    recently_scraped: (d) => ({ last_scraped: d }),
    recently_created: (d) => ({ creation_date_unix_seconds: d }),
};

export function parseSortBy(sortByString = "") {
    const hasPrefix = sortByString[0] === "+" || sortByString[0] === "-";
    const direction = !hasPrefix || sortByString[0] === "+" ? -1 : 1;
    const method = hasPrefix ? sortByString.slice(1) : sortByString;
    const methodFactory = SORT_METHODS[method] ?? SORT_METHODS.default;

    return methodFactory(direction);
}