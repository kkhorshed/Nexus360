# @nexus360/hooks

A collection of reusable React hooks for the Nexus360 platform.

## Available Hooks

### useAsync
A hook for handling asynchronous operations with loading, success, and error states.

```typescript
import { useAsync } from '@nexus360/hooks';

function MyComponent() {
  const { status, data, error, execute } = useAsync(async () => {
    const response = await fetchData();
    return response;
  });

  return (
    <div>
      {status === 'pending' && <div>Loading...</div>}
      {status === 'success' && <div>Data: {JSON.stringify(data)}</div>}
      {status === 'error' && <div>Error: {error.message}</div>}
      <button onClick={execute}>Fetch Data</button>
    </div>
  );
}
```

### useDebounce
A hook that delays the update of a value until a specified time has passed.

```typescript
import { useDebounce } from '@nexus360/hooks';

function SearchComponent() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  // Effect only runs when debouncedSearch changes
  useEffect(() => {
    // Perform search
  }, [debouncedSearch]);
}
```

### useLocalStorage
A hook that syncs state with localStorage.

```typescript
import { useLocalStorage } from '@nexus360/hooks';

function ThemeComponent() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Toggle Theme
    </button>
  );
}
```

## Installation

This package is part of the Nexus360 monorepo and should be installed via the workspace package manager.

```bash
pnpm add @nexus360/hooks
```

## Development

1. All hooks should be placed in their own files
2. Each hook should have proper TypeScript types
3. Include JSDoc comments for documentation
4. Export hooks from the main index.ts file
5. Follow the naming convention: use[HookName]

## Testing

Each hook should have its own test file using React Testing Library.

```bash
pnpm test
```

## Contributing

1. Create a new file for your hook in src/
2. Add proper types and documentation
3. Export the hook in src/index.ts
4. Add tests in __tests__ directory
5. Update this README with usage examples
