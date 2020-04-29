using System.ComponentModel.DataAnnotations;

namespace Tynder.UserSchema
{
    using NumberType = System.Object;


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
        public string foo { get; set; }

        [Required, MinLength(0)]
        public string bar { get; set; }

        [Required]
        public string baz { get; set; }
    }


    public class ACL 
    {
        [Required]
        public string target { get; set; }

        [Required, MinLength(0)]
        public string value { get; set; }
    }


    public class Z2 
    {
        [Required]
        public string foo { get; set; }

        [Required, MinLength(0)]
        public string bar { get; set; }

        [Required, MaxLength(10)]
        public string baz { get; set; }
    }


    public static class ErrorTypes
    {
        /** comment */
        public static double InvalidDefinition { get { return 1; } }

        /** comment */
        public static double Required { get { return 2; } }

        /** comment */
        public static double TypeUnmatched { get { return 3; } }

        /** comment */
        public static double RepeatQtyUnmatched { get { return 4; } }

        public static double SequenceUnmatched { get { return 5; } }

        public static double ValueRangeUnmatched { get { return 6; } }

        public static double ValuePatternUnmatched { get { return 7; } }

        public static double ValueLengthUnmatched { get { return 8; } }

        public static double ValueUnmatched { get { return 9; } }

        public static double Aaaaa { get { return 99; } }

        public static string Bbbbb { get { return "string bbbbb"; } }
    }


    public static class ErrorTypes2
    {
        public static double Aaaaa { get { return 99; } }
    }


    public static class ErrorTypes3
    {
        public static double Zzzzz { get { return 0; } }

        public static double Aaaaa { get { return 99; } }
    }


    public class Foo 
    {
        [Required, RegularExpression(@"^[A-Za-z]+$")]
        public string name { get; set; }

        [Required, RegularExpression(@"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$")]
        public string email { get; set; }
    }


    public class Bar 
    {
        [Required]
        public Foo foo { get; set; }
    }


    public class Baz 
    {
        [Required, Range(typeof(string), "a", "z")]
        public string aaa1 { get; set; }

        [Required, Range(typeof(string), "a", "z")]
        public string aaa2 { get; set; }

        [Required, Range(typeof(string), "", "z")]
        public string aaa3 { get; set; }

        [Required, Range(typeof(string), "a", "\U00010FFFF")]
        public string aaa4 { get; set; }

        [Range((int)-3, (int)5)]
        public int bbb1 { get; set; }

        [Range((int)-3, (int)5)]
        public int bbb2 { get; set; }

        [Range(Int32.MinValue, (int)-3)]
        public int bbb3 { get; set; }

        [Range((int)5, Int32.MaxValue)]
        public int bbb4 { get; set; }

        /** comment */
        [Range((double)-3, (double)5)]
        public double ccc1 { get; set; }

        /** comment */
        [Range((double)-3, (double)5)]
        public double ccc2 { get; set; }

        /** comment */
        [Range(Double.MinValue, (double)-3)]
        public double ccc3 { get; set; }

        /** comment */
        [Range((double)5, Double.MaxValue)]
        public double ccc4 { get; set; }

        [Required]
        public object[] ddd1 { get; set; }

        [Required]
        public object[] ddd2 { get; set; }

        [Required]
        public object[] ddd3 { get; set; }

        [Required]
        public object[] ddd4 { get; set; }

        [Required]
        public object[] ddd5 { get; set; }

        [Required]
        public object[] ddd6 { get; set; }

        [Required]
        public string[] eee1 { get; set; }

        [Required, MinLength(10)]
        public string[] eee2 { get; set; }

        [Required, MaxLength(20)]
        public string[] eee3 { get; set; }

        [Required, MinLength(10), MaxLength(20)]
        public string[] eee4 { get; set; }

        [Required]
        public object fff { get; set; }

        [Required]
        public Bar ggg1 { get; set; }

        [Required]
        public Bar[] ggg2 { get; set; }

        [Required]
        public Bar[][] ggg3 { get; set; }
    }


    public class User 
    {
        [Required, RegularExpression(@"^[A-Za-z]+$")]
        public string userName { get; set; }

        [Required, RegularExpression(@"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$")]
        public string primaryEmail { get; set; }

        [Required, RegularExpression(@"^[A-Za-z]+$")]
        public string primaryAliasName { get; set; }

        [Required]
        public string[] aliasNames { get; set; }
    }
}
