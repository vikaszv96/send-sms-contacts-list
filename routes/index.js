var express = require('express');
var router = express.Router();
const Nexmo = require('nexmo')
const nexmo = new Nexmo({
  apiKey: '218f0b8c',
  apiSecret: '6fvbKyNeQ5QEU3se'
})/* GET home page. */



var list = [{
  'ID':1,
  'name' : 'Vikas Yadav',
  'mobile':'917987554794',
},
{
'ID':2,
'name' : 'Rajat Shukla',
'mobile':'7486903546',
},
{
'ID':3,
'name' : 'Munna Bhaiya',
'mobile':'9056284550',
},
{
'ID':4,
'name' : 'Guddu Pandit',
'mobile':'7780543209',
},
{
'ID':5,
'name' : 'Srivani Iyer',
'mobile':'8880976501',
},
{
'ID':6,
'name' : 'Kisan Network',
'mobile':'919810153260',
}];

var newAddedList = [];

router.get('/contactsList', function(req, res, next) {
  res.cookie("list", list);
  res.render('index', { element: list });
});

router.get('/contactsInfo/:ID', function(req, res, next) {
  list.forEach(element => {
    if(element.ID == req.params.ID)
    {
    return res.render('contactsInfo', { element: element });
    }
  });
});

router.get('/compose/:ID', function(req, res, next) {
  var random = Math.floor((Math.random() * 1000000) + 1);
  var s = new String(random);
  var i = 0;

  while(s.length != 6)
  {
    random = Math.floor((Math.random() * 1000000) + 1);
    s = new String(random);
    i++;
  }

console.log("random = " + random);

   res.render('compose', { random: random, Id:req.params.ID });
});

router.post('/sendSms/:ID/:ran',function(req, res, next) {

  var lists = req.cookies.list;
  var index = lists.findIndex(obj => obj.ID == req.params.ID);

console.log('lists[index].mobile = ' + lists[index].mobile);

var from = 'GrumpyText';
var to = lists[index].mobile;
var text = 'Hi. Your OTP is : '+ req.params.ran;

console.log(text);

nexmo.message.sendSms(from, to, text, function(err,success){
  if(err) {
    console.log("error = "+ err);
}
else  {
  console.log("SMS sent successfully!");

  var timeAndOTPArray = {
    "time" : new Date(),
    "OTP": req.params.ran
  }

  lists[index] = {"time": timeAndOTPArray.time, "OTP":timeAndOTPArray.OTP, ...list[index]};
  newAddedList.push(lists[index]);

  newAddedList.sort(function compare(a, b) {
    var dateA = new Date(a.time);
    var dateB = new Date(b.time);
    return dateB - dateA;
  });

console.log("newAddedList = "+ newAddedList);
  res.redirect('/alreadySentList');
}
});
});

router.get('/alreadySentList', function(req, res, next) {
   res.render('alreadySentList', { newAddedList: newAddedList});
})

module.exports = router;
