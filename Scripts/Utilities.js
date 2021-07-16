const fs = require('fs')

class Utilities {

    static ReadJson ( fileName ) {
        var json = fs.readFileSync ( fileName, 'utf8' );
        return JSON.parse ( json );
    }

    static WriteJson ( json, fileName ) {
        fileName = fileName.replace ( ":", "_" );
        if ( typeof json === "string" || json instanceof String )
            fs.writeFileSync ( fileName, json );
        else
            fs.writeFileSync ( fileName, JSON.stringify ( json ) );
    }

    static async Wait ( ms ) {
        return new Promise ( ( resolve, reject ) => {
            setTimeout ( () => {
                resolve ( ms )
            }, ms );
        });
    }

}

module.exports = Utilities;