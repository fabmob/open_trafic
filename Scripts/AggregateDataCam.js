const { type } = require("os");
const Environment = require("./Environment");
const Utilities = require("./Utilities");
const Comptage = require("./Comptage");
const { isBuffer } = require("util");
const HasuraAPI = require("./HasuraAPI");

class AggregateDataCam {

    static Aggregate ( json, intervalle, fps ) {
        var startingTime = Date.parse ( json.dateStart ) / 1000;
        var endingTime = Date.parse ( json.dateEnd ) / 1000;

        if ( ! json.counterHistory || json.counterHistory.length == 0 ) {
            return null;
        }

        var firstFrame = json.counterHistory [ 0 ].frameId;
        var lastFrame = json.counterHistory [ json.counterHistory.length - 1 ].frameId;

        var placeId = HasuraAPI.GetOrCreatePlaceId ( Environment.PlaceName );

        // Get lines
        // var laneIds = Object.keys ( json.areas );
        var lanes = this.GetLaneIds ( json.areas, placeId );

        let count;
        if ( fps ) {
            count = lastFrame / (fps * intervalle);
        }
        else {
            count = (endingTime - startingTime) / intervalle;
        }

        var comptages = {};
        for ( let i = 0 ; i < lanes.length ; i++ ) {

            comptages [ lanes [ i ].originalId ] = [];
            for ( let j = 0 ; j < count ; j++ ) {
                let comptage = new Comptage ();
                comptage.start_time = Math.floor ( startingTime + intervalle * j );
                comptage.end_time = Math.floor ( startingTime + intervalle * ( j + 1 ) );

                let date = new Date ( comptage.start_time * 1000 ).toISOString ().split ( "T" );
                comptage.day = date [ 0 ];
                comptage.day_time = date [ 1 ];

                comptage.lane_id = lanes [ i ].id;
                comptage.place_id = placeId;
                comptages [ lanes [ i ].originalId ].push ( [] );
                comptages [ lanes [ i ].originalId ][ j ] = comptage;
            }
        }

        if ( json.counterHistory ) {
            for ( let i = 0 ; i < json.counterHistory.length ; i++ ) {
                let counterData = json.counterHistory [ i ];
                
                var timeSinceBegining;
                if ( fps ) {
                    timeSinceBegining = counterData.frameId / fps;
                }
                else {
                    timeSinceBegining = (Date.parse ( counterData.timestamp ) / 1000 - startingTime);
                }

                comptages [ counterData.area ][ Math.floor ( timeSinceBegining / intervalle ) ].Increment ( counterData.name );
            }
        }

        if ( ! Environment.SaveAggregate ) {
            console.log ( "[" + new Date ().toISOString () + "] Aggregation completed" );
        }
        else if ( comptages ) {
            let fileName = "./recordings/aggregated_counter_" + new Date ().toISOString () + ".json";
            Utilities.WriteJson ( comptages, fileName );
            console.log ( "[" + new Date ().toISOString () + "] Aggregated counters stored in file '" + fileName + "'" );
        }

        let flatArray = [];
        for ( let i = 0 ; i < lanes.length ; i++ ) {
            for ( let j = 0 ; j < count ; j++ ) {
                flatArray.push ( comptages [ lanes [ i ].originalId ][ j ] );
            }
        }

        return flatArray;
    }

    static GetLaneIds ( areas, placeId ) {
        var lanes = [];
        
        var ids = Object.keys ( areas );

        for ( let i = 0 ; i < ids.length ; i++ ) {
            var newlane = HasuraAPI.GetOrCreateLaneId ( areas [ ids [ i ] ], placeId );
            newlane.originalId = ids [ i ];
            lanes.push ( newlane );
        }

        return lanes;
    }

}

module.exports = AggregateDataCam;