const httpntlm = require('httpntlm');

let HTTPFileReader = {
    readFromPath : (path, callback, onError)=>{
        httpntlm.get({
            url: path,
            username: 'tamernas',
            password: 'mak9Sail#',
        }, function (err, res){
            if(err) console.log(err);
            callback(res.body);
        });
    }
};

module.exports = HTTPFileReader;