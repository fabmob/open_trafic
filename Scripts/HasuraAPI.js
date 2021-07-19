const XMLHttpRequest = require ( "xmlhttprequest" ).XMLHttpRequest;
const Environment = require ( "./Environment" );

class HasuraAPI {

    static InsertComptages ( json ) {
        var xmlHttp = new XMLHttpRequest ();
        xmlHttp.open ( "POST", Environment.HasuraUrl, false );
        xmlHttp.setRequestHeader ( "Content-Type", "application/json;charset=UTF-8" );
        xmlHttp.setRequestHeader ( "x-hasura-admin-secret", Environment.HasuraAdminSecret );
        xmlHttp.send (
            "{\"query\":\"mutation{insert_comptage_aggregate(objects:["
            + json
            + "]){affected_rows}}\"}"
        );

        if ( xmlHttp.status == 200 ) {
            console.log ( "[" + new Date ().toISOString () + "] Aggregations sended to Hasura\n" + xmlHttp.responseText );
            return JSON.parse ( xmlHttp.responseText );
        }
        else {
            console.log ( "[" + new Date ().toISOString () + "] ERROR - Failed to send aggreagations to Hasura - (status : " + xmlHttp.status + ") " + xmlHttp.responseText );
            return xmlHttp;
        }
    }

}

module.exports = HasuraAPI;