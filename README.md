# trackerr-sqlite

trackerr-sqlite provides SQLite3 support for [trackerr](https://github.com/chidiwilliams/trackerr). It implements the `ExceptionStore` interface in [trackerr-abstract-exception-store](https://github.com/chidiwilliams/trackerr-abstract-exception-store).

## Usage

To create and use an SQLite store:

```js
import { Client } from 'trackerr';
import SQLiteStore from 'trackerr-sqlite';

const trackerr = new Client(new SQLiteStore('db.sql'));
```
