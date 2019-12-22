
import {}           from '../types';
import { validate } from '../validator';
import { pick,
         merge }    from '../picker';
import { picked,
         partial,
         intersect,
         oneOf,
         subtract,
         primitive,
         primitiveValue,
         optional,
         repeated,
         sequenceOf,
         spread,
         objectType,
         derived,
         msg as $$,
         msgId as $ } from '../operators';



describe("operator", function() {
    it("operator-1", function() {
        const myType = oneOf(
            derived(
                objectType(
                    ['foo', 10],
                    ['qoo', $$({invalidValue: ''},
                            optional(20))],
                    ['zoo', $('msgid-myType-zoo',
                            optional('aaa'))],
                    ['www', sequenceOf(10, 20, spread(primitive('string'), {min: 3, max: 10}), 50)],
                ),
                objectType(
                    ['bar', optional(primitive('string'))],
                    ['bar2', primitive('string?')],
                    ['bar3', repeated('string', {min: 3, max: 10})],
                ),
                intersect(
                    objectType(
                        ['baz', 10],
                    ),
                    objectType(
                        ['baz', 10],
                    ),
                ),
                subtract(
                    objectType(
                        ['baz', 10],
                    ),
                    objectType(
                        ['baz', 10],
                    ),
                ),
            ),
            10, 20, 30,
            primitive('string'),
            primitiveValue(50),
        );

        /*
        console.log(JSON.stringify(myType, null, 2));

        const myType2 = picked(myType, 'foo', 'baz');
        console.log(JSON.stringify(myType2, null, 2));

        const myType3 = partial(myType);
        console.log(JSON.stringify(myType3, null, 2));

        expect(validate({
            aaaaaa: 'ppppppppppppp',
            foo: 10,
            www: [10, 20, 'a', 'b', 'c', 50],
            bar3: ['a', 'b', 'c'],
        }, myType)).toEqual({} as any);
        pick({}, myType2);
        merge({}, {});
        */

        expect(1).toEqual(1);
    });
});
