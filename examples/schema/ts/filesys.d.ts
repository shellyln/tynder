interface ACL {
    target: string;
    value: string;
}

/** Entry base */
interface EntryBase {
    /** Entry name */
    name: string;
    /** ACL infos */
    acl: ACL[];
}

/** File entry */
interface File extends EntryBase {
    /** Entry type */
    type: 'file';
}

/** Folder entry */
interface Folder extends EntryBase {
    /** Entry type */
    type: 'folder';
    /** Child entries */
    entries: Entry[];
}

/** Entry (union type) */
type Entry = (File | Folder);

