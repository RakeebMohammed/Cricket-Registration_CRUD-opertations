var db=require('../config/connection')
const bcrypt=require('bcrypt') 
var objectid = require('objectid')
module.exports={
    doSignup:((userData)=>{
        return new Promise(async(resolve, reject) => {
            userData.password=await bcrypt.hash(userData.password,10)
            db.get().collection('logindetails').insertOne({name:userData.name,email:userData.email,password:userData.password})
            resolve()
            })
    
        })
       
    
    ,
   
    doLogin:((userData)=>{
        return new Promise(async(resolve, reject) => {
            let user=await db.get().collection('logindetails').findOne({email:userData.email})
        
  let response={};
 let loginStatus=false;
 if(user){
 bcrypt.compare(userData.password,user.password).then((result)=>{
    if(result){
        console.log("success");
        response.user=user
        console.log(response.user);
        response.result=true
        resolve(response)
    }
    else{
        console.log("failed");
        resolve({result:false})

    }
 })
 }
 else{
    console.log("failed");
    resolve({result:false})

 }   
        })
    }),

    registerPlayers:((userData)=>{
        return new Promise((resolve, reject) => {
            db.get().collection('players').insertOne(userData) .then((data)=>{
                console.log(data.insertedId)
            })
   resolve()
        })

    }),
    getAllusers:(()=>{
        return new Promise(async(resolve, reject) => {
          let allusers=await db.get().collection('players').find().toArray()
           
            resolve(allusers)
          })  
        })
,
deleteOne:((userId)=>{
return new Promise((resolve, reject) => {
    db.get().collection('players').deleteOne({_id:objectid(userId) }).then((data)=>{
        console.log(data);
        resolve(data)
    })

})
})
    ,
    editOne:((userId)=>{
        return new Promise(async(resolve, reject) => {
            let userDet=await db.get().collection('players').findOne({_id:objectid(userId)})
            resolve(userDet);
            console.log(userDet);
        })
    })
,
updateOne:((userId,editDet)=>{
    return new Promise((resolve, reject) => {
        db.get().collection('players').updateOne({_id:objectid(userId)},{$set:{fullname:editDet.fullname,
            age:editDet.age,category:editDet.category,played:editDet.played,favcricketer:editDet.favcricketer
 }})
 resolve()
    })

})

}

