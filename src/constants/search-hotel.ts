const PERPAGE: number = 10;

export const buildSearchHotels = ({
    query = '*',
    page = 1,
    per_page = PERPAGE
}: {query?: string,
    page?: number,
    per_page?: number}) => {
    return {
        searches: [
            {
                collection: 'searchhoteles',
                query_by: "code,title",
                filter_by: 'type:=14 && active:=true',
                include_fields: 'code,title',
                q: query,
                page,
                per_page,
            },
        ],
    }
}
