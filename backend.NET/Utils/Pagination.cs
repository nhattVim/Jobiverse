namespace api.Utils
{
    public class Pagination
    {
        public int Page { get; set; }
        public int Limit { get; set; }
        public int Skip => (Page - 1) * Limit;

        public Pagination(int? page, int? limit, int defaultPage = 1, int defaultLimit = 10)
        {
            Page = page.HasValue && page.Value > 0 ? page.Value : defaultPage;
            Limit = limit.HasValue && limit.Value > 0 ? limit.Value : defaultLimit;
        }
    }

    public class PaginationMetadata
    {
        public int Total { get; set; }
        public int Page { get; set; }
        public int Limit { get; set; }
        public int TotalPages { get; set; }
        public bool HasNextPage { get; set; }
        public bool HasPrevPage { get; set; }

        public PaginationMetadata(int total, int page, int limit)
        {
            Total = total;
            Page = page;
            Limit = limit;
            TotalPages = (int)Math.Ceiling((double)total / limit);
            HasNextPage = page < TotalPages;
            HasPrevPage = page > 1;
        }
    }

    public class PaginatedResponse<T>
    {
        public IEnumerable<T> Data { get; set; }
        public PaginationMetadata Pagination { get; set; }

        public PaginatedResponse(IEnumerable<T> data, int total, Pagination pagination)
        {
            Data = data;
            Pagination = new PaginationMetadata(total, pagination.Page, pagination.Limit);
        }
    }
}
