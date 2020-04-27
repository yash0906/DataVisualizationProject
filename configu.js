var time=100
var rows=[];    
var daywise = [];
var gaswise = [];
var myVar=0
var gbar
var mak=[]
var makgases = []
var attributes=['CO','NO2','NO','NOx','SO2'];
var places=['Taipei','New Taipei','Taoyuan','Hsinchu','Hsinchu City','Keelung','Yilan','Miaoli','Changhua','Nantou','Yunlin','Taichung','Chiayi','Chiayi City','Pingtung','Tainan','Kaohsiung','Hualien','Taitung','Penghu','Kinmen','Lianjiang'];
var city_selected=0
var gas_selected=0 
var selected_cities = ['Taipei','New Taipei','Taoyuan','Hsinchu','Hsinchu City']
var flag_bar = 0
var bubbles = [ 50, 100, 150, 200, 250]


d3.csv("http://localhost:8000/final.csv", function (d) {
        
    for(var i=0;i<places.length;i++)//separate index for each city
    daywise.push([])
    // daywise = new Array(places.length).fill([])
    mak = new Array(places.length).fill(0)
    makgases = new Array(attributes.length).fill(0)
    // gaswise = new Array(attributes.length).fill([])
    console.log(d.length)
    console.log(places.length)
    for(var i=0;i<d.length;i++){
        var entry={}
        
        //parsing for the time
        const separators=[':',' ','/']

        times=d[i].time.split(new RegExp(separators.join('|'), 'g'))
        entry_time={
            year: Number(times[0]), 
            month: Number(times[1]),
            day: Number(times[2]),
            hour: Number(times[3]),
        }

        entry_date= new Date(entry_time.year,entry_time.month-1,entry_time.day,entry_time.hour,0)

        //finding the city
        entry_place=places.indexOf(d[i].city)

        //the values of all the attributes
        entry_attributes=[]
        for(var j=0;j<attributes.length;j++){
            at=attributes[j]
            entry_attributes.push(Number(d[i][at]))
            if(makgases[j]<d[i][at])
                makgases[j] = Number(d[i][at])
        }

        entry={
            time:entry_time,
            city:entry_place,
            attributes:entry_attributes,
            date:entry_date,
        }
        rows.push({...entry})
    }

    var dayline=[]
    for(var i=0;i<rows.length;i+=24){
        var avg = new Array(attributes.length).fill(0)
        var city = rows[i].city
        // console.log(city)
        for(var j=i;j<i+24;j++)
        {
            // console.log(rows[j])
            avg = avg.map((val,idx) => val + parseFloat(rows[j].attributes[idx]))
        }
        // console.log(avg)
        avg = avg.map((val) => {if(mak[city]<val/24)mak[city]=val/24; return val/24})
        daywise[city].push(avg)
        dayline.push({
           attributes: avg,
            date:rows[i].date,
            city:rows[i].city,
        })
        // console.log(avg)
    }
    showlineGraph(rows)

    // for(var i=0;i<attributes.length;i++)
    //     gaswise.push([])
    // for(var j=0;j<attributes.length;j++)
    //     for(var i=0;i<365;i++)
    //         gaswise[j].push([])

    // for(var i=0;i<daywise.length;i++)
    // {
    //     for(var j=0;j<daywise[i].length;j++)
    //     {
    //         for(var k=0;k<attributes.length;k++)
    //         {
    //             gaswise[k][j].push(daywise[i][j][k])
    //         }
    //     }
    // }
    
})
$(document).ready(function(){
    myVar = setInterval("showTimeCity()",time);
})



function changeView(){
    var val  = document.getElementById('button').innerHTML;
    if(val =='City View'){ 
        clearInterval(myVar)
        document.getElementById('button').innerHTML = 'Gas View'
        myVar = setInterval("showTimeGas()",time);
        idx=-1
        flag_bar=1
    }
    else{
        document.getElementById('button').innerHTML = 'City View'
        clearInterval(myVar)
        myVar = setInterval("showTimeCity()",time)
        idx=-1
        flag_bar=0
    }
}

