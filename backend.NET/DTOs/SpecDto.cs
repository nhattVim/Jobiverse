using System;

namespace api.DTOs;

public record SpecDto(
    string? _id,
    string? major,
    string? name,
    string? description
);
