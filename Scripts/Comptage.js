class Comptage {

    constructor () {
        this.start_time = 0;
        this.end_time = 0;

        this.day = 0;
        this.day_time = 0;
        
        this.lane_id = 0;
        this.place_id = 0;

        this.car_count = 0;
        this.truck_count = 0;
        this.bus_count = 0;
        this.motorbike_count = 0;
        this.bicycle_count = 0;
        this.person_count = 0;
    }

    Increment ( name ) {
        switch ( name ) {
            case "car" :
                this.car_count ++;
                break;
            case "truck" :
                this.truck_count ++;
                break;
            case "motorbike" :
                this.motorbike_count ++;
                break;
            case "bicycle" :
                this.bicycle_count ++;
                break;
            case "person" :
                this.person_count ++;
                break;
            case "bus" :
                this.bus_count ++;
                break;
        }
    }

    toString () {
        return "{start_time:\\\"" + new Date ( this.start_time * 1000 ).toISOString () +
            "\\\",end_time:\\\"" + new Date ( this.end_time * 1000 ).toISOString () +
            "\\\",day:\\\"" + this.day +
            "\\\",day_time:\\\"" + this.day_time +
            "\\\",lane_id:\\\"" + this.lane_id +
            "\\\",place_id:\\\"" + this.place_id +
            "\\\",car_count:" + this.car_count +
            ",truck_count:" + this.truck_count +
            ",bus_count:" + this.bus_count +
            ",motorbike_count:" + this.motorbike_count +
            ",bicycle_count:" + this.bicycle_count +
            ",person_count:" + this.person_count +
        "}"
    }
}

module.exports = Comptage;