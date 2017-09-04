

const crypto = require('crypto');


const pubfun = {
    hashPW:function(pwd){
              return crypto.createHash('sha256').update(pwd).
                digest('base64').toString();
            },

    //验证是否有权限
    isPermission: function (req, res) {
        var ret = true;
        if(req.session.adminLoginname!=='admin')
        {
            ret = false;
        }
        return ret;
    }


};



module.exports=pubfun; 
