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
            if ( xmlHttp.responseText.data && xmlHttp.responseText.data.insert_comptage_aggregate )
                console.log ( "[" + new Date ().toISOString () + "] Aggregations sended to Hasura (" + xmlHttp.responseText.data.insert_comptage_aggregate.affected_rows + " row(s) inserted)" );
            else
                console.log ( "[" + new Date ().toISOString () + "] ERROR - Failed to send aggreagations to Hasura - (status : " + xmlHttp.status + ") " + xmlHttp.responseText );
            return JSON.parse ( xmlHttp.responseText );
        }
        else {
            console.log ( "[" + new Date ().toISOString () + "] ERROR - Failed to send aggreagations to Hasura - (status : " + xmlHttp.status + ") " + xmlHttp.responseText );
            return xmlHttp;
        }
    }

    static GetPlaceId ( placeName ) {
        var xmlHttp = this.SendHasura (
            "{\"query\":\"query{place(where:{name:{_eq:\\\"" + placeName + "\\\"}}){name id}}\"}"
        );

        if ( xmlHttp.status == 200 ) {
            var response = JSON.parse ( xmlHttp.responseText );
            if ( response && response.data && response.data.place && response.data.place.length >= 1 ) {
                return response.data.place [ 0 ].id;
            }
            else {
                console.log ( "[" + new Date ().toISOString () + "] ERROR - Failed to get place " + placeId + " - " );
                console.log ( response.data );
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
                console.log ( "[" + new Date ().toISOString () + "] ERROR - Failed to create place - " );
                console.log ( response.data );
                return null;
            }
        }
        else {
            console.log ( "[" + new Date ().toISOString () + "] ERROR - Failed to create place - (status : " + xmlHttp.status + ") " + xmlHttp.responseText );
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

    static GetLaneId ( laneName, placeId ) {
        var xmlHttp = this.SendHasura (
            "{\"query\":\"query{lane(where:{name:{_eq:\\\"" + laneName + "\\\"},place_id:{_eq:\\\"" + placeId + "\\\"}}){name id place_id}}\"}"
        );

        if ( xmlHttp.status == 200 ) {
            var response = JSON.parse ( xmlHttp.responseText );
            if ( response && response.data && response.data.lane && response.data.lane.length >= 1 ) {
                return response.data.lane [ 0 ];
            }
            else {
                console.log ( "[" + new Date ().toISOString () + "] ERROR - Failed to get lane " + laneName + " in " + placeId + " - " );
                console.log ( response.data );
                return null;
            }
        }
        else {
            console.log ( "[" + new Date ().toISOString () + "] ERROR - Failed to get lane - (status : " + xmlHttp.status + ") " + xmlHttp.responseText );
            return null;
        }
    }

    static NewLane ( lane, placeId ) {
        var xmlHttp = this.SendHasura (
            "{\"query\":\"mutation{insert_lane(objects:[{name:\\\"" + lane.name + "\\\",color:\\\"" + lane.color + "\\\",place_id:\\\"" + placeId + "\\\"}]){affected_rows returning{ name id place_id }}}\"}"
        );

        if ( xmlHttp.status == 200 ) {
            var response = JSON.parse ( xmlHttp.responseText );
            if ( response && response.data && response.data.insert_lane && response.data.insert_lane.affected_rows == 1 ) {
                return response.data.insert_lane.returning [ 0 ];
            }
            else {
                console.log ( "[" + new Date ().toISOString () + "] ERROR - Failed to create lane - " );
                console.log ( response.data );
                return null;
            }
        }
        else {
            console.log ( "[" + new Date ().toISOString () + "] ERROR - Failed to create lane id - (status : " + xmlHttp.status + ") " + xmlHttp.responseText );
            return null;
        }
    }

    static GetOrCreateLaneId ( lane, placeId ) {
        var laneId = this.GetLaneId ( lane.name, placeId );

        if ( ! laneId ) {
            return this.NewLane ( lane, placeId );
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