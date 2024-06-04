# adtools

![version badge](https://img.shields.io/badge/version-1.0.4-blue)

adtools is a TypeScript library that allows you to easily make ActiveDirectory calls from your application.

## Installation

Use npm to install adtools.

```bash
npm install @ilefa/adtools
```

## Usage

```ts
import {
    bind,
    find,
    findAt,
    findComputer,
    findComputersByOU,
    findGroup,
    findOU,
    findOUs,
    findUser
} from '@ilefa/adtools';

const baseDN = 'OU=Test,DC=ad,DC=example,DC=com';

const directory = await bind('ad.example.com', 'user@example.com', 'password', baseDN).catch(err => {
    console.log('Failed to bind to the domain:', err);
    return null;
});

if (!directory) return process.exit(-1);

// Perform an LDAP query
let results = await find(directory, '(&(objectClass=user)(cn=Example))');

// Perform an LDAP query with a custom base DN
let results = await findAt(directory, '(&(objectClass=user)(cn=Example))', baseDN);

// Find an OU by it's name
let ou = await findOU(directory, 'Test');

// Find all OUs (from root or from a custom base DN)
let ous = await findOUs(directory);
        = await findOUs(directory, baseDN);

// Find a domain user by their CN
let user = await findUser(directory, 'user');

// Find a group by it's CN
let group = await findGroup(directory, 'group');

// Find a computer by it's CN
let computer = await findComputer(directory, 'ComputerName');

// Find all computers in a target OU
let computers = await findComputersByOU(directory, baseDN);
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[GPL-3.0](https://choosealicense.com/licenses/gpl-3.0/)
