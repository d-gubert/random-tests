# NodeJS Array Performance Benchmarks

## Scripts

### 1. array-fixed-vs-or-vs-object.js - Small Static List Performance

Tests performance of checking a value against a small, known list of 4 content types.

**Implementations tested:**
- Array.includes() with array created inside function
- Array.includes() with array created outside function
- OR operators with string primitives (`!==` chain)
- Object property lookup

**How to run:**
```bash
node array-fixed-vs-or-vs-object.js
```

### 2. array-dynamic-vs-vm-vs-set.js - Large Dynamic List Performance

Tests performance of checking a value against a dynamically generated list of 200 elements.

**Implementations tested:**
- Array.includes() with dynamic array
- Compiled VM script with OR comparison chain
- Object property lookup
- Set.has() lookup

**How to run:**
```bash
node array-dynamic-vs-vm-vs-set.js
```

## Findings

### Small Static Lists (4 elements)

For small, known lists where values are determined at development time:

**Winner: OR operators with string primitives**

Performance results:
- OR operators: ~156M ops/sec (baseline)
- Array inside function: ~147M ops/sec (1.07x slower)
- Array outside function: ~94M ops/sec (1.66x slower)
- Object lookup: ~84M ops/sec (1.86x slower)

**Key insights:**
- Direct string comparisons with OR operators are highly optimized by V8's JIT compiler
- Creating arrays inside the function is faster than having them outside (some kind of optimization on V8?)
- Object lookups have overhead that isn't worth it for small datasets

### Large Dynamic Lists (200 elements)

For large lists where values are determined at runtime:

**Winner: Set.has() lookup**

Performance results:
- Set.has(): ~112M ops/sec (baseline)
- Object lookup: ~100M ops/sec (1.12x slower)
- Compiled OR chain: ~5.8M ops/sec (19.33x slower)
- Array.includes(): ~2.3M ops/sec (49.07x slower)

**Key insights:**
- Set.has() and Object lookup use hash tables (O(1) constant time)
- Array.includes() uses linear search (O(n)) and becomes extremely slow with large arrays
- Even dynamically compiling an OR chain is much slower than hash-based lookups (still has O(n) complexity)

