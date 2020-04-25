using System.ComponentModel.DataAnnotations;

namespace Tynder.UserSchema
{
    using PrimitiveValueTypes = System.Object;

    using PrimitiveValueTypeNames = System.Object;

    using OptionalPrimitiveValueTypeNames = System.Object;

    using PlaceholderTypeNames = System.Object;

    using OptionalPlaceholderTypeNames = System.Object;

    using ObjectAssertionMember = System.Object;

    using AdditionalPropsKey = System.Object;

    using AdditionalPropsMember = System.Object;

    using TypeAssertion = System.Object;

    using TypeAssertionMap = System.Object;


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
    }


    public class ErrorMessages 
    {
        public string invalidDefinition { get; set; }

        public string required { get; set; }

        public string typeUnmatched { get; set; }

        public string repeatQtyUnmatched { get; set; }

        public string sequenceUnmatched { get; set; }

        public string valueRangeUnmatched { get; set; }

        public string valuePatternUnmatched { get; set; }

        public string valueLengthUnmatched { get; set; }

        public string valueUnmatched { get; set; }
    }


    public class TypeAssertionErrorMessageConstraints 
    {
        public object minValue { get; set; }

        public object maxValue { get; set; }

        public object greaterThanValue { get; set; }

        public object lessThanValue { get; set; }

        public double? minLength { get; set; }

        public double? maxLength { get; set; }

        public double? min { get; set; }

        public double? max { get; set; }

        public string pattern { get; set; }
    }


    public class TypeAssertionErrorMessage 
    {
        [Required]
        public string code { get; set; }

        [Required]
        public string message { get; set; }

        [Required]
        public string dataPath { get; set; }

        [Required]
        public TypeAssertionErrorMessageConstraints constraints { get; set; }

        public object value { get; set; }
    }


    public class TypeAssertionBase 
    {
        public string messageId { get; set; }

        public string message { get; set; }

        public ErrorMessages messages { get; set; }

        public string name { get; set; }

        public string typeName { get; set; }

        public string docComment { get; set; }

        public string passThruCodeBlock { get; set; }

        public bool? noOutput { get; set; }
    }


    public class NeverTypeAssertion : TypeAssertionBase 
    {
        [Required]
        public string kind { get; set; }
    }


    public class AnyTypeAssertion : TypeAssertionBase 
    {
        [Required]
        public string kind { get; set; }
    }


    public class UnknownTypeAssertion : TypeAssertionBase 
    {
        [Required]
        public string kind { get; set; }
    }


    public class PrimitiveTypeAssertionConstraints 
    {
        public object minValue { get; set; }

        public object maxValue { get; set; }

        public object greaterThanValue { get; set; }

        public object lessThanValue { get; set; }

        public double? minLength { get; set; }

        public double? maxLength { get; set; }

        public object pattern { get; set; }
    }


    public class PrimitiveTypeAssertion : TypeAssertionBase, PrimitiveTypeAssertionConstraints 
    {
        [Required]
        public string kind { get; set; }

        [Required]
        public PrimitiveValueTypeNames primitiveName { get; set; }
    }


    public class PrimitiveValueTypeAssertion : TypeAssertionBase 
    {
        [Required]
        public string kind { get; set; }

        [Required]
        public PrimitiveValueTypes value { get; set; }
    }


    public class RepeatedAssertionConstraints 
    {
        [Required]
        public double? min { get; set; }

        [Required]
        public double? max { get; set; }
    }


    public class RepeatedAssertion : TypeAssertionBase, RepeatedAssertionConstraints 
    {
        [Required]
        public string kind { get; set; }

        [Required]
        public TypeAssertion repeated { get; set; }
    }


    public class SpreadAssertion : TypeAssertionBase, RepeatedAssertionConstraints 
    {
        [Required]
        public string kind { get; set; }

        [Required]
        public TypeAssertion spread { get; set; }
    }


    public class SequenceAssertion : TypeAssertionBase 
    {
        [Required]
        public string kind { get; set; }

        [Required]
        public TypeAssertion[] sequence { get; set; }
    }


    public class OneOfAssertion : TypeAssertionBase 
    {
        [Required]
        public string kind { get; set; }

        [Required]
        public TypeAssertion[] oneOf { get; set; }
    }


    public class OptionalAssertion : TypeAssertionBase 
    {
        [Required]
        public string kind { get; set; }

        [Required]
        public TypeAssertion optional { get; set; }
    }


    public class EnumAssertion : TypeAssertionBase 
    {
        [Required]
        public string kind { get; set; }

        [Required]
        public object[] values { get; set; }
    }


    public class ObjectAssertion : TypeAssertionBase 
    {
        [Required]
        public string kind { get; set; }

        [Required]
        public ObjectAssertionMember[] members { get; set; }

        public AdditionalPropsMember[] additionalProps { get; set; }

        public object[] baseTypes { get; set; }
    }


    public class AssertionSymlink : TypeAssertionBase 
    {
        [Required]
        public string kind { get; set; }

        [Required]
        public string symlinkTargetName { get; set; }
    }


    public class ValidationContext 
    {
        public bool? checkAll { get; set; }

        public bool? noAdditionalProps { get; set; }

        public ErrorMessages errorMessages { get; set; }

        [Required]
        public TypeAssertionErrorMessage[] errors { get; set; }

        [Required]
        public object[] typeStack { get; set; }

        public TypeAssertionMap schema { get; set; }
    }


    public class TypeAssertionSetValue 
    {
        [Required]
        public TypeAssertion ty { get; set; }

        public bool exported { get; set; }

        public bool resolved { get; set; }
    }


    public class SymbolResolverContext 
    {
        public double nestLevel { get; set; }

        [Required]
        public object[] symlinkStack { get; set; }
    }


    public class CodegenContext 
    {
        public double nestLevel { get; set; }

        public TypeAssertionMap schema { get; set; }
    }
}
