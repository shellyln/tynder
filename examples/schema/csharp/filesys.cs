using System.ComponentModel.DataAnnotations;

namespace Tynder.UserSchema {
    public class ACL 
    {
        [Required]
        public string target { get; set; }
        [Required]
        public string value { get; set; }
    }

    /** Entry base */
    public class EntryBase 
    {
        /** Entry name */
        [Required]
        public string name { get; set; }
        /** ACL infos */
        [Required]
        public ACL[] acl { get; set; }
    }

    /** File entry */
    public class File : EntryBase 
    {
        /** Entry type */
        [Required]
        public string type { get; set; }
    }

    /** Folder entry */
    public class Folder : EntryBase 
    {
        /** Entry type */
        [Required]
        public string type { get; set; }
        /** Child entries */
        [Required]
        public Entry[] entries { get; set; }
    }

    /** Entry (union type) */
}
