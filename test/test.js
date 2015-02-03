var expect = require( 'chai' ).expect;

require( '../typecore' );

describe( 'Object.extend', function(){
    var X = Object.extend({
        a : 1,
        b : "ss"
    });

    var X1 = X.extend({
        initialize : function( a, b ){
            this.a = a;
            this.b = b;
        }
    });

    var X2 = X1.extend({
        c : true,
        a : 'x2',

        initialize : function(){
            this.b = 'nothing';
        }
    });

    it( 'creates empty object', function(){
        var x = new X();

        expect( x.a ).to.eql( 1 );
        expect( x.b ).to.eql( "ss" );
    });

    it( 'call initialize upon creation', function(){
        var x = new X1( 5, 5 );

        expect( x.a ).to.eql( 5 );
        expect( x.b ).to.eql( 5 );
    });

    it( 'override members on inheritance', function(){
        var x = new X2();

        expect( x.a ).to.eql( 'x2' );
        expect( x.b ).to.eql( 'nothing' );
        expect( x.c ).to.eql( true );
    });

    it( 'define native properties', function(){
        var Y = X2.extend({
            properties : {
                ro : function(){
                    return "ro";
                },

                rw : {
                    get : function(){
                        return this._rw - 1 ;
                    },

                    set : function( value ){
                        this._rw = value - 1;
                    }
                }
            }
        });

        var y = new Y();

        expect( y.ro ).to.eql( 'ro' );

        y.rw = 666;
        expect( y.rw ).to.eql( 664 );
    });

    it( 'mix in single object' );
    it( 'deeply mix plain JS objects' );
    it( 'mix in multiple objects' );
    it( 'mix in constructor functions' );
    it( 'mix in native properties' );
});

describe( 'Object methods definitions', function(){
    describe( 'Type specs', function(){
        it( 'simple method', function(){
            var x = {
                do1 : Function.takes().returns(),
                do2 : Function.takes().returns( Number ),
                do3 : Function.takes( Number ),
                do4 : Function.takes( String ).returns( Number ),
                do5 : Function.takes( String.or( Number ) ),
                do6 : Function.takes( String.or( Number ).or( null ) ),
                do7 : Function.takes( String, Number['?'] ),
                do8 : Function.takes( Object['*'], Object['!']['?'] ),
                do8 : Function.takes( Object.ANY, Object['?'] )
            };




            var x = new X();

            x.doSomething();
        })
    })
});
