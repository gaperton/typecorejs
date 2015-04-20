require( '../object+' );

describe( 'inheritance options', function(){
    it( 'immediate extend', function(){
        var A = Object.extend({
            value : 'some',

            initialize : function(){
                this.other = [];
            },

            properties : {
                readOnly : function(){
                    return 'ro';
                },

                writable : {
                    get : function(){
                        return this._writable || null;
                    },
                    set : function( value ){
                        this._writable = value;
                    }
                }
            }
        });
    });

    it( 'extend and late define', function(){
        var A = Object.extend();

        A.define({
            properties : {
                readOnly : function(){
                    return 'ro';
                },

                writable : {
                    get : function(){
                        return this._writable || null;
                    },
                    set : function( value ){
                        this._writable = value;
                    }
                }
            }
        });
    })
});
