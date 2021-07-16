const RecordingCycle = require ( "./RecordingCycle" );
const AggregateDataCam = require ( "./AggregateDataCam" );
const CronJob = require ( "cron" ).CronJob;
const OpenDataCamAPI = require("./OpenDataCamAPI");

let deleteRecordingsBeforeDays = 7;

let cronHours = 0;
let cronMinutes = 0;
let cronSeconds = 0;
let intervalle = 15;
let fps = false;

if ( CronIntervalleFromArgs () )
    return;

function CronIntervalleFromArgs () {
    var args = process.argv.slice ( 2 );

    if ( args [ 0 ] == "-h" || args [ 0 ] == "--help" ) {
        console.log (
            "\nLes enregistrements effectués par OpenDataCam sont découpé en intervalle régulier (par défaut, si pas d'argument, toute les heures). Cela signifie qu'au bout de chaque intervalle, un nouveau comtage sera effectué.\n"
            + "\t-ch (or --cron-hours) [nombre d'heure entre chaque intervalle]\n"
            + "\t-cm (or --cron-minutes) [nombre de minutes entre chaque intervalle]\n"
            + "\t-cs (or --cron-seconds) [nombre de secondes entre chaque intervalle]\n"
            + "\nLe comptage aggrège les données (par défaut on aggrège le comptage par plage de 15 minutes) :\n"
            + "\t-i (or --intervalle) [plage d'aggregation en minutes]\n"
            + "\nS'il s'agit d'une vidéo, et non d'une caméra, il est important de donner le nombre d'image par secondes de celle-ci :\n"
            + "\t-fps [nombre d'image par secondes]\n"
            + "\nPour éviter de surcharger l'espace disque, les anciens enregistrements stockés dans OpenDataCam sont supprimés. On ne garde que les plus récents (par défaut ce ayant moins d'une semaine) :\n"
            + "\t-d (ou --delete-before-days) [nombre de jours]\n"
        );
        return true;
    }

    let counter = 0;
    while ( counter + 1 < args.length ) {
        var number = parseInt ( args [ counter + 1 ] );
        if ( isNaN ( number ) ) {
            counter ++;
            continue;
        }
        
        var number = args [ counter + 1 ]
        if ( args [ counter ] == "-ch" || args [ counter ] == "--cron-hours" ) {
            cronHours = number;
        }
        else if ( args [ counter ] == "-cm" || args [ counter ] == "--cron-minutes" ) {
            cronMinutes = number;
        }
        else if ( args [ counter ] == "-cs" || args [ counter ] == "--cron-seconds" ) {
            cronSeconds = number;
        }
        else if ( args [ counter ] == "-i" || args [ counter ] == "--intervalle" ) {
            intervalle = number;
        }
        else if ( args [ counter ] == "-d" || args [ counter ] == "--delete-before-days" ) {
            deleteRecordingsBeforeDays = number;
        }
        else if ( args [ counter ] == "-fps" ) {
            fps = number;
        }
        counter += 2;
    }
    
    if ( cronSeconds > 0 ) {
        if ( cronHours == 0 ) {
            cronHours = "*";
            if ( cronMinutes == 0 ) {
                cronMinutes = "*";
            }
        }
        cronSeconds = "*/" + cronSeconds;
    }
    if ( cronMinutes > 0 ) {
        if ( cronHours == 0 ) {
            cronHours = "*";
        }
        cronMinutes = "*/" + cronMinutes;
    }
    if ( cronHours > 0 ) {
        cronHours = "*/" + cronHours;
    }
    
    if ( cronHours == 0 && cronMinutes == 0 && cronSeconds == 0 ) {
        cronHours = "*/1";
    }

    return false;
}

async function OpenTrafficCycle () {
    var counter = await RecordingCycle.NewCycle ();
    if ( counter )
        AggregateDataCam.Aggregate ( counter, intervalle * 60, fps );
    
    // Delete old recordings
    OpenDataCamAPI.DeleteOldRecordings ( deleteRecordingsBeforeDays );
}

var job = new CronJob ( cronSeconds + " " + cronMinutes + " " + cronHours + " * * *", OpenTrafficCycle, null, true, "Europe/Paris" );

// Every hour
// var job = new CronJob ( "0 0 */1 * * *", OpenTrafficCycle, null, false, "Europe/Paris" );
// Every minute
// var job = new CronJob ( "0 /1 * * * *", OpenTrafficCycle, null, false, "Europe/Paris" );
// Every 20 seconds
// var job = new CronJob ( "*/20 * * * * *", OpenTrafficCycle, null, false, "Europe/Paris" );
job.start ();

// TODO job to ping an external serveur