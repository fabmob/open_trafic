const Environment = require("./Environment");
const OpenDataCamAPI = require ( "./OpenDataCamAPI" );
const Utilities = require("./Utilities");

class RecordingCycle {

    static async NewCycle () {
        console.log ( "[" + new Date ().toISOString () + "] New cycle" );
        // Get Status
        var status = OpenDataCamAPI.GetStatus ();
        if ( ! status || ! status.appState ) {
            console.log ( "[" + new Date ().toISOString () + "] ERROR - Cannot connect to Open Data Cam" );
            return;
        }
        if ( ! status.appState.recordingStatus.isRecording ) {
            console.log ( "[" + new Date ().toISOString () + "] Wasn't recording. Only start recording" );
            OpenDataCamAPI.StartRecording ();
            return;
        }
        
        
        var recId = status.appState.recordingStatus.recordingId;
        
        // Stop
        OpenDataCamAPI.StopRecording ();
        await Utilities.Wait ( 2000 );
        
        // Get
        var counter = OpenDataCamAPI.GetCounter ( recId );
        if ( ! Environment.SaveOpenDataCamRaw ) {
            console.log ( "[" + new Date ().toISOString () + "] Recording successfully retreived" );
        }
        else if ( counter ) {
            let fileName = "./recordings/recording_counter_" + new Date ().toISOString () + ".json";
            Utilities.WriteJson ( counter, fileName );
            console.log ( "[" + new Date ().toISOString () + "] Recording stored in file '" + fileName + "'" );
        }

        // Start
        OpenDataCamAPI.StartRecording ();

        return JSON.parse ( counter );
    }
}

module.exports = RecordingCycle;