var time=500//transition time in case of bar graph
var rows=[];//this stores all the data    
var daywise = [];//this stores all data in day wise view form,i.e like for each city, concentration of gas
var gaswise = [];//this stores all data in gas wise view form,i.e like ofr each gases concentration of city
var dates_all=[];//this contains all dates fro which we have data
var myVar=0// this is used to setinterval and clearinterval
var gbar // this this a big group tag for bar graph
var mak=[] // maximum of each city for each gas
var makgases = []
var attributes=['CO','NO2','NO','NOx','SO2']; // these are the gases which we are displaying
var attributes_units=['CO (ppb)','NO2 (ppm)','NO (ppm)','NOx (ppm)','SO2 (ppb)']
var places=['Taipei','New Taipei','Taoyuan','Hsinchu','Hsinchu City','Keelung','Yilan','Miaoli','Changhua','Nantou','Yunlin','Taichung','Chiayi','Chiayi City','Pingtung','Tainan','Kaohsiung','Hualien','Taitung','Penghu','Kinmen','Lianjiang','Tainan City','Kaohsiung City','Taichung City'];// these are the places in the map
var city_selected=0// default selected city
var gas_selected=0 //default selected gas
var selected_cities = ['Taipei','New Taipei','Taoyuan','Hsinchu','Hsinchu City']// default selected cities
var bubbles = [ 50, 100, 150, 200, 250]// position of bubbles
var zones = []// coloring the cities by their pollution level
var conc = ['ppb','ppm','ppm','ppm','ppb']
k=0
for(var i=0;i<places.length;i++)
{
    zones.push('rgb('+(255-k)+',0,0)')
    k+=10
}
//console.log(zones)

d3.csv("http://localhost:8000/final3.csv", function (d) {
        
    for(var i=0;i<places.length;i++)//separate index for each city
    daywise.push([])
    // daywise = new Array(places.length).fill([])
    mak = new Array(places.length).fill(0)
    // makgases = new Array(places.length).fill([])
    for(var j=0;j<places.length;j++)
    makgases.push([])
    for(var j=0;j<makgases.length;j++)
    {
        for(var k=0;k<attributes.length;k++)
        makgases[j].push(0)
    }
    //console.log(makgases)
    // gaswise = new Array(attributes.length).fill([])
    // console.log(d.length)
    // console.log(places.length)
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
            if(makgases[entry_place][j]<Number(d[i][at]))
                makgases[entry_place][j] = Number(d[i][at])
        }

        entry={
            time:entry_time,
            city:entry_place,
            attributes:entry_attributes,
            date:entry_date,
        }
        if(entry_place==0 && entry_time.hour==0){
            dates_all.push(entry_date);
        }
        rows.push({...entry})
    }

    
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
    }
    for(var i=0;i<attributes.length;i++)
        gaswise.push([])
    for(var j=0;j<attributes.length;j++)
        for(var i=0;i<365;i++)
            gaswise[j].push([])

    for(var i=0;i<daywise.length;i++)
    {
        for(var j=0;j<daywise[i].length;j++)
        {
            for(var k=0;k<attributes.length;k++)
            {
                gaswise[k][j].push(daywise[i][j][k])
            }
        }
    }
    console.log("daywise",daywise)    
    console.log("gaswise",gaswise)    
    myVar = setInterval("showTimeCity()",time);

})
$(document).ready(function(){
    // d3.selectAll('#bubble').attr('display','none');
    // myVar = setInterval("showTimeCity()",time);
    // showlineGraph(rows)
})
