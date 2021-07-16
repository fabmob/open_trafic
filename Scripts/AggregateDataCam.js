const { type } = require("os");
const Utilities = require("./Utilities");

class AggregateDataCam {

    static Aggregate ( json, intervalle, fps ) {
        var startingTime = Date.parse ( json.dateStart );

        // Get lines
        var laneIds = Object.keys ( json.areas );
        var counterPerLane = {};
        for ( let i = 0 ; i < laneIds.length ; i++ ) {
            counterPerLane [ json.areas [ laneIds [ i ] ].name ] = {};
        }

        // Aggregate counters
        if ( json.counterHistory ) {
            for ( let i = 0 ; i < json.counterHistory.length ; i++ ) {
                let counterData = json.counterHistory [ i ];
                if ( counterPerLane [ json.areas [ counterData.area ].name ][ counterData.name ] == undefined ) {
                    counterPerLane [ json.areas [ counterData.area ].name ][ counterData.name ] = [];
                }
                var timeSinceBegining;
                if ( fps ) {
                    timeSinceBegining = counterData.frameId / fps;
                }
                else {
                    timeSinceBegining = (Date.parse ( counterData.timestamp ) - startingTime) / 1000;
                }

                while ( counterPerLane [ json.areas [ counterData.area ].name ][ counterData.name ].length < Math.ceil ( timeSinceBegining / intervalle ) ) {
                    counterPerLane [ json.areas [ counterData.area ].name ][ counterData.name ].push ( 0 );
                }
                counterPerLane [ json.areas [ counterData.area ].name ][ counterData.name ][ Math.floor ( timeSinceBegining / intervalle ) ] ++;
            }
        }

        if ( counterPerLane ) {
            let fileName = "./recordings/aggregated_counter_" + new Date ().toISOString () + ".json";
            Utilities.WriteJson ( counterPerLane, fileName );
            console.log ( "[" + new Date ().toISOString () + "] Aggregated counters stored in file '" + fileName + "'" );
        }

        return counterPerLane;
    }

}

module.exports = AggregateDataCam;