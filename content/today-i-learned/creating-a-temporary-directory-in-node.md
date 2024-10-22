---
title: 'Creating a temporary directory in node'
date: '2024-10-21T22:39:10.432Z'
slug: 'creating-a-temporary-directory-in-node'
---

Somehow this set of APIs slipped under the radar in my 10+ years of writing Node.js code. 

I've been building a service that writes geospatial files to disk as it transforms them and discovered a 
set of native node APIs (that also exist in Deno) that allow you to create a temporary directory in the operating system's temporary directory folder. 

Here's the code snippet that creates a temporary directory with a prefix:

```typescript
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const createTempDirectory = (prefix = ""): string => {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
};
```

Lets break it down. 

1. `os.tmpdir()` returns the operating system's default directory for temporary files.
2. `path.join()` joins the operating system's temporary directory with the prefix you provide.
3. `fs.mkdtempSync()` creates a temporary directory with the prefix you provided and returns the path to the directory.

## Asynchronous approaches
There is also a couple of async options available in the `fs` module to create temporary directories.

### Callback Version

```typescript
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const createTempDirectory = (prefix = "", callback: (err: NodeJS.ErrnoException | null, folder: string) => void) => {
  fs.mkdtemp(path.join(os.tmpdir(), prefix), callback);
};
```

### Promise Version

```typescript
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const createTempDirectory = (prefix = ""): Promise<string> => {
  return fs.mkdtemp(path.join(os.tmpdir(), prefix));
};
```

## Automatic Cleanup

There is now an pathway in Javascript to automatically cleanup the temporary directory when you're done with it the handle using the [Explicit Resource Management](https://github.com/tc39/proposal-explicit-resource-management)
functionality landing in JS environments near you. When its settled and better documentation is available, I'll likely write a follow up post on how to use it.


## Non-Automatic Cleanup

For now, the cleanup of the temporary directory is left to the developer. You can use the `fs.rmdirSync` function to remove the directory when you're done with it.

```typescript
const tempDir = createTempDirectory("my-prefix");
// Do something with the directory
fs.rmdirSync(tempDir, { recursive: true });
// or to get something similar to the `rm -rf` command
fs.rmSync(tempDir, { recursive: true, force: true });
```