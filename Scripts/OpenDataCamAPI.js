const XMLHttpRequest = require ( "xmlhttprequest" ).XMLHttpRequest;
const Environment = require ( "./Environment" );

class OpenDataCamAPI {

    static StatusUri = "/status";
    static GetAllRecordingsUri = "/recordings?offset={offset}&limit={limit}";
    static StartRecordingUri = "/recording/start";
    static StopRecordingUri = "/recording/stop";
    static GetCounterUri = "/recording/:id/counter";
    static DeleteRecordingUri = "/recording/:id"

    static GetStatus () {
        var xmlHttp = new XMLHttpRequest ();
        xmlHttp.open ( "GET", Environment.URI + this.StatusUri, false );
        xmlHttp.send ( null );
        if ( xmlHttp.status == 200 ) {
            return JSON.parse ( xmlHttp.responseText );
        }
        else {
            return null;
        }
    }

    static StartRecording () {
        var xmlHttp = new XMLHttpRequest ();
        xmlHttp.open ( "GET", Environment.URI + this.StartRecordingUri, false );
        xmlHttp.send ( null );
        if ( xmlHttp.status == 200 ) {
            console.log ( "[" + new Date ().toISOString () + "] Recording successfully started" );
        }
        else {
            console.log ( "[" + new Date ().toISOString () + "] ERROR - Cannot start recording" );
        }
        return xmlHttp.status;
    }

    static StopRecording () {
        var xmlHttp = new XMLHttpRequest ();
        xmlHttp.open ( "GET", Environment.URI + this.StopRecordingUri, false );
        xmlHttp.send ( null );
        if ( xmlHttp.status == 200 ) {
            console.log ( "[" + new Date ().toISOString () + "] Recording successfully stopped" );
        }
        else {
            console.log ( "[" + new Date ().toISOString () + "] ERROR - Cannot stop recording" );
        }
        return xmlHttp.status;
    }

    static GetCounter ( recId ) {
        var xmlHttp = new XMLHttpRequest ();
        xmlHttp.open ( "GET", Environment.URI + this.GetCounterUri.replace ( ":id", recId ), false );
        xmlHttp.send ( null );
        if ( xmlHttp.status == 200 ) {
            console.log ( "[" + new Date ().toISOString () + "] Recording counter successfully retreived" );
            return xmlHttp.responseText;
        }
        else {
            console.log ( "[" + new Date ().toISOString () + "] ERROR - Cannot retreive recording counter" );
            return null;
        }
    }

    static GetRecordingsCount () {
        var xmlHttp = new XMLHttpRequest ();
        xmlHttp.open ( "GET", Environment.URI + this.GetAllRecordingsUri, false );
        xmlHttp.send ( null );
        if ( xmlHttp.status == 200 ) {
            var total = JSON.parse ( xmlHttp.responseText ).total;
            console.log ( "[" + new Date ().toISOString () + "] Recordings count successfully retreived (" + total + " total recordings)" );
            return total;
        }
        else {
            console.log ( "[" + new Date ().toISOString () + "] ERROR - Cannot retreive recordings count" );
            return null;
        }
    }

    static DeleteOldRecordings ( beforeDays ) {
        var total = this.GetRecordingsCount ();
        var xmlHttp = new XMLHttpRequest ();
        xmlHttp.open ( "GET", Environment.URI + this.GetAllRecordingsUri.replace ( "{limit}", total ), false );
        xmlHttp.send ( null );
        if ( xmlHttp.status == 200 ) {
            var beforeDate = new Date ();
            beforeDate.setDate ( beforeDate.getDate () - beforeDays );
            
            // Delete all old recodings
            var recordings = JSON.parse ( xmlHttp.responseText ).recordings;
            var count = 0;
            var toDelete = [];
            for ( let i = 0 ; i < recordings.length ; i++ )
                if ( new Date ( recordings [ i ].dateStart ) < beforeDate ) {
                    toDelete.push ( recordings [ i ]._id );
                    count ++;
                }
            this.DeleteRecordings ( toDelete );

            console.log ( "[" + new Date ().toISOString () + "] " + count + " Recordings deleted" );
            return xmlHttp.responseText;
        }
        else {
            console.log ( "[" + new Date ().toISOString () + "] ERROR - Cannot retreive recording list" );
            return null;
        }
    }

    static async DeleteRecordings ( ids ) {
        var xmlHttp = new XMLHttpRequest ();
        for ( let i = 0 ; i < ids.length ; i++ ) {
            console.log ( "[" + new Date ().toISOString () + "] Prepare to delete recording : " + ids [ i ] + " number " + i );
            xmlHttp.open ( "DELETE", Environment.URI + this.DeleteRecordingUri.replace ( ":id", ids [ i ] ), false );
            xmlHttp.send ( null );
            if ( xmlHttp.status == 200 ) {
                console.log ( "[" + new Date ().toISOString () + "] Recording deleted : " + ids [ i ] + " number " + i );
            }
            else {
                console.log ( "[" + new Date ().toISOString () + "] ERROR - Cannot delete recording : " + ids [ i ] + " number " + i );
            }
        }
    }

}

module.exports = OpenDataCamAPI;