import ActiveDirectory from 'activedirectory';
import { promisify } from 'util';

/**
 * Attempts to bind to ActiveDirectory with the specified
 * connection information, and returns an instance of
 * the ActiveDirectory connection if successful.
 * 
 * @param url the url of the active directory server
 * @param username the username to authentication with
 * @param password the password for the associated username
 * @param baseDN the base DN to search from
 * 
 * @throws if the connection fails
 * @throws if the authentication fails
 * 
 * @returns an instance of the ActiveDirectory connection
 */
export const bind = async (url: string, username: string, password: string, baseDN: string): Promise<ActiveDirectory> => {
    let ad = new ActiveDirectory({
        url, baseDN, username, password,
        attributes: {
            user: ['*'],
            group: ['*']
        }
    });

    return new Promise((res, rej) => {
        ad.authenticate(username, password, async (err, auth) => {
            if (err) return rej(err);
            if (!auth) return rej('Authentication failed');
            return res(ad);
        })  
    });
};

/**
 * Attempts to perform an LDAP query on the specified
 * ActiveDirectory connection.
 * 
 * @param directory the active directory instance
 * @param query the ldap query to execute
 * @param err an optional error handler
 * 
 * @returns the results of the query, if any
 */
export const find = async (directory: ActiveDirectory, query: string | {}, err?: (error: Error) => void) =>
    await promisify(directory.find.bind(directory))(query).catch(err || (() => null));

/**
 * Attempts to search ActiveDirectory for the specified
 * user, and returns their information if found.
 * 
 * @param directory the active directory instance
 * @param username the username to find
 * @param err an optional error handler
 * 
 * @throws if the user is not found
 * @returns the user's associated AD object, if found 
 */
export const findUser = async (directory: ActiveDirectory, username: string, err?: (error: Error) => void) =>
    await promisify(directory.findUser.bind(directory))(username).catch(err || (() => null));

/**
 * Attempts to search ActiveDirectory for the specified
 * group, and returns it's information if found.
 * 
 * @param directory the active directory instance
 * @param group the group to find
 * @param err an optional error handler
 * 
 * @throws if the group is not found
 * @returns the group's associated AD object, if found
 */
export const findGroup = async (directory: ActiveDirectory, group: string, err?: (error: Error) => void) =>
    await promisify(directory.findGroup.bind(directory))(group).catch(err || (() => null));

/**
 * Performs an LDAP query on the specified ActiveDirectory
 * in order to find a CN that matches the specified name.
 * 
 * @apiNote The LDAP query being used will only return
 * objects with type 'computer', so if another object
 * exists with the same name, it will only be returned
 * if it has the correct type.
 * 
 * @param directory the active directory instance
 * @param name the machine cn to find
 * @param err an optional error handler
 * 
 * @throws if the machine is not found
 * @returns the machine's associated AD object, if found
 */
export const findComputer = async (directory: ActiveDirectory, name: string, err?: (error: Error) => void) => {
    let results = await find(directory, `(&(objectClass=computer)(cn=${name}))`, err);
    if (!results) return null;
    return results.other[0];
}