require( '../object+' );

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

var B = Object.extend(),
    C = A.extend();

B.implement({

})
