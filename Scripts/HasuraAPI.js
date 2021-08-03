const XMLHttpRequest = require ( "xmlhttprequest" ).XMLHttpRequest;
const Environment = require ( "./Environment" );

class HasuraAPI {

    static InsertComptages ( json ) {
        var xmlHttp = this.SendHasura (
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

    static GetPlaceId ( placeName ) {
        console.log (placeName);
        var xmlHttp = this.SendHasura (
            "{\"query\":\"query{place(where:{name:{_eq:\\\"" + placeName + "\\\"}}){name id}}\"}"
        );

        if ( xmlHttp.status == 200 ) {
            var response = JSON.parse ( xmlHttp.responseText );
            if ( response && response.data && response.data.place && response.data.place.length == 1 ) {
                return response.data.place [ 0 ].id;
            }
            else {
                return null;
            }
        }
        else {
            console.log ( "[" + new Date ().toISOString () + "] ERROR - Failed to get place id - (status : " + xmlHttp.status + ") " + xmlHttp.responseText );
            return null;
        }
    }

    static NewPlace ( placeName ) {
        var xmlHttp = this.SendHasura (
            "{\"query\":\"mutation{insert_place(objects:[{name:\\\"" + placeName + "\\\"}]){affected_rows returning{ name id }}}\"}"
        );

        if ( xmlHttp.status == 200 ) {
            var response = JSON.parse ( xmlHttp.responseText );
            if ( response && response.data && response.data.insert_place && response.data.insert_place.affected_rows == 1 ) {
                return response.data.insert_place.returning [ 0 ].id;
            }
            else {
                return null;
            }
        }
        else {
            console.log ( "[" + new Date ().toISOString () + "] ERROR - Failed to create place id - (status : " + xmlHttp.status + ") " + xmlHttp.responseText );
            return null;
        }
    }

    static GetOrCreatePlaceId ( placeName ) {
        var placeId = this.GetPlaceId ( placeName );

        if ( ! placeId ) {
            return this.NewPlace ( placeName );
        }
        return placeId;
    }

    static GetLaneId ( laneName ) {
        var xmlHttp = this.SendHasura (
            "{\"query\":\"query{lane(where:{name:{_eq:\\\"" + laneName + "\\\"}}){name id}}\"}"
        );

        if ( xmlHttp.status == 200 ) {
            var response = JSON.parse ( xmlHttp.responseText );
            if ( response && response.data && response.data.place && response.data.place.length == 1 ) {
                return response.data.place [ 0 ].id;
            }
            else {
                return null;
            }
        }
        else {
            console.log ( "[" + new Date ().toISOString () + "] ERROR - Failed to get place id - (status : " + xmlHttp.status + ") " + xmlHttp.responseText );
            return null;
        }
    }

    static NewLane ( lane ) {
        var xmlHttp = this.SendHasura (
            "{\"query\":\"mutation{insert_lane(objects:[{name:\\\"" + lane.name + "\\\",color:\\\"" + lane.color + "\\\"}]){affected_rows returning{ name id }}}\"}"
        );

        if ( xmlHttp.status == 200 ) {
            var response = JSON.parse ( xmlHttp.responseText );
            console.log ( response );
            if ( response && response.data && response.data.insert_place && response.data.insert_place.affected_rows == 1 ) {
                console.log ( response.data.insert_place.returning [ 0 ].id );
                return response.data.insert_place.returning [ 0 ].id;
            }
            else {
                return null;
            }
        }
        else {
            console.log ( "[" + new Date ().toISOString () + "] ERROR - Failed to get place id - (status : " + xmlHttp.status + ") " + xmlHttp.responseText );
            return null;
        }
    }

    static GetOrCreateLaneId ( lane ) {
        var laneId = this.GetLaneId ( lane.id );

        if ( ! laneId ) {
            return this.NewLane ( lane );
        }
        return laneId;
    }

    static SendHasura ( body ) {
        var xmlHttp = new XMLHttpRequest ();
        xmlHttp.open ( "POST", Environment.HasuraUrl, false );
        xmlHttp.setRequestHeader ( "Content-Type", "application/json;charset=UTF-8" );
        xmlHttp.setRequestHeader ( "x-hasura-admin-secret", Environment.HasuraAdminSecret );
        xmlHttp.send ( body );

        return xmlHttp;
    }

}

module.exports = HasuraAPI;