
class DateService {

    static getInstance(){
        return instance;
    }

    constructor() {

    }

    dateDiff (date1, date2){
        return (date1.getTime() - date2.getTime()) / 1000;
    }


    createDate(dateStr){
        let comps = dateStr.split(" ");
        let dateComps = comps[0].split("-");
        let timeComps = comps[1].split(":");

        return new Date(
            Number(dateComps[0]),
            Number(dateComps[1])-1,
            Number(dateComps[2]),
            Number(timeComps[0]),
            Number(timeComps[1]),
            Number(timeComps[2]),
        )
    }


}


module.exports = DateService;
const instance = new DateService();
