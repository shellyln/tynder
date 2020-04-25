using System.ComponentModel.DataAnnotations;

namespace Tynder.UserSchema {
    public class A 
    {
        [Required]
        public NumberType numberTypeField { get; set; }
        public int integerTypeField { get; set; }
        public decimal bigIntTypeField { get; set; }
        [Required]
        public string stringTypeField { get; set; }
        public bool booleanTypeField { get; set; }
        [Required]
        public object nullTypeField { get; set; }
        [Required]
        public object undefinedTypeField { get; set; }
        [Required]
        public object anyTypeField { get; set; }
        [Required]
        public object unknownTypeField { get; set; }
        [Required]
        public object neverTypeField { get; set; }
        public double numberValueTypeField { get; set; }
        public int integerValueTypeField { get; set; }
        [Required]
        public object bigIntValueTypeField { get; set; }
        [Required]
        public string stringValueTypeField { get; set; }
        public bool booleanValueTypeField { get; set; }
    }

    public class B 
    {
        public NumberType numberTypeField { get; set; }
        public int? integerTypeField { get; set; }
        public decimal? bigIntTypeField { get; set; }
        public string stringTypeField { get; set; }
        public bool? booleanTypeField { get; set; }
        public object nullTypeField { get; set; }
        public object undefinedTypeField { get; set; }
        public object anyTypeField { get; set; }
        public object unknownTypeField { get; set; }
        public object neverTypeField { get; set; }
        public double? numberValueTypeField { get; set; }
        public int? integerValueTypeField { get; set; }
        public object bigIntValueTypeField { get; set; }
        public string stringValueTypeField { get; set; }
        public bool? booleanValueTypeField { get; set; }
    }

    public class C : A 
    {
    }

    public class D 
    {
        public NumberType numberTypeField { get; set; }
        public int? integerTypeField { get; set; }
        public decimal? bigIntTypeField { get; set; }
        public string stringTypeField { get; set; }
        public bool? booleanTypeField { get; set; }
        public object nullTypeField { get; set; }
        public object undefinedTypeField { get; set; }
        public object anyTypeField { get; set; }
        public object unknownTypeField { get; set; }
        public object neverTypeField { get; set; }
        public double? numberValueTypeField { get; set; }
        public int? integerValueTypeField { get; set; }
        public object bigIntValueTypeField { get; set; }
        public string stringValueTypeField { get; set; }
        public bool? booleanValueTypeField { get; set; }
    }

    public class E 
    {
    }

    public class Z1 
    {
        [Required]
        public object foo { get; set; }
        [Required]
        public object bar { get; set; }
        [Required]
        public object baz { get; set; }
    }

    public class ACL 
    {
        [Required]
        public string target { get; set; }
        [Required]
        public string value { get; set; }
    }

    public class Z2 
    {
        [Required]
        public object foo { get; set; }
        [Required]
        public object bar { get; set; }
        [Required]
        public object baz { get; set; }
    }

    public class Foo 
    {
        [Required]
        public string name { get; set; }
        [Required]
        public string email { get; set; }
    }

    public class Bar 
    {
        [Required]
        public Foo foo { get; set; }
    }

    public class User 
    {
        [Required]
        public object userName { get; set; }
        [Required]
        public object primaryEmail { get; set; }
        [Required]
        public object primaryAliasName { get; set; }
        [Required]
        public object[] aliasNames { get; set; }
    }

}
