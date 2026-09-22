import Type from "typebox";

export const ProjectQueryStringSchema = Type.String({ 
    description: 
`Inlcudes or excludes specified fields.

Mixing inclusion and exclusion will throw HTTP 400 Bad Request.`, 

    examples: ["name,visits", "!world_uuid,!last_scraped"], 
})