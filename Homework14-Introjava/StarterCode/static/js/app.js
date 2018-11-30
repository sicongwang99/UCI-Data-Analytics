// from data.js
var tableData = data;

// YOUR CODE HERE!
var country_list = [];
var shape_list = [];
for (var c = 0, cc=dataSet.length;c<cc;c++){
  country_list.push(dataSet[c].country);
  shape_list.push(dataSet[c].shape);
}

Array.prototype.unique = function(){
  var arr =[];
  for (var i = 0;i<this.length;i++){
    if(!arr.includes(this[i])){
      arr.push(this[i])
    }
  }
  console.log(arr)
  return arr
}

var uniqueCountries = country_list.unique();
var uniqueShapes = shape_list.unique();

var countryDropdown = document.querySelector("#country");
var shapeDropdown = document.querySelector("#shape")


function handleOption(array_list, dropdown){
  for(var i = 0;i<array_list.length;i++){
    $option = document.createElement("option")
    $option.innerText = array_list[i]
    , dropdown.appendChild($option)
  }
}

handleOption(uniqueCountries,countryDropdown);
handleOption(uniqueShapes,shapeDropdown)

// $("#country").on("change",function(){
//   var countries = this.value;
//   if (countries==="all"){
//     $(".task-list-row").hide().filter(function(){
//       return $(this).dataSet("country")!=countries
//     }).show();
//   }else{
//     $(".task-list-row").hide().filter(function(){
//       return $(this).dataSet("country")==countries;
//     }).show();
//   }
// })



function handleSubmit(event){
  event.preventDefault();
  var cityInput = document.querySelector("#city").value.trim()
  var stateInput = document.querySelector("#state").value.trim()
  var selectCountry =document.getElementById("country");
  var countryInput = selectCountry.options[selectCountry.selectedIndex].value
  var selectShape = document.getElementById("shape");
  var shapeInput = selectShape.options[selectShape.selectedIndex].value

  var filterData = dataSet.filter(function(search){
      var cityObject = search.city;
      var stateObject = search.state;
      var countryObject = search.country;
      var shapeObject = search.shape;
      
      if(cityInput===cityObject && stateInput===stateObject && countryInput===countryObject && shapeInput===shapeObject){
          return true;
      }
      return false;
  })
  console.log(filterData);
  renderSearchTable(filterData);
}

$searchBtn = document.querySelector("#search");
$searchBtn.addEventListener("click",handleSubmit);

function renderSearchTable(search){
  $tbody.innerHTML="";
    for(let i=0,ii=search.length;i<ii;i++){
        let $row = $tbody.insertRow();
        for (let r=0,rr=Object.keys(search[i]).length;r<rr;r++){
            let $cell = $row.insertCell()
            $cell.innerText=Object.values(search[i])[r];
        }
    }
}




let $tbody = document.querySelector("tbody"); 
// let filterData = dataSet;
// let maxEndNum = dataSet.length;
let startNum = 0;
let endNum = 51;
let pageNum = 1;
let pages_length = Math.round((dataSet.length)/50);
console.log(pages_length)

function renderTable(beginNum,stopNum){
    $tbody.innerHTML="";
    // maxEndNum=dataSet.length;
    for(let i=startNum,ii=endNum;i<ii;i++){
        let $row = $tbody.insertRow();
        for (let r=0,rr=Object.keys(dataSet[i]).length;r<rr;r++){
            let $cell = $row.insertCell()
            $cell.innerText=Object.values(dataSet[i])[r];
        }
    }
}
renderTable(startNum,endNum);

let $nextBtn=document.querySelector(".next")
$nextBtn.addEventListener("click",function handleNext(event){
    event.preventDefault();
    if (pageNum <pages_length){
        pageNum+=1;
        startNum+=50;
        endNum+=50;
        renderTable(startNum,endNum)
        if(pageNum>=2){
            $previousBtn.classList.remove('disabled');
            $previousBtn.innerHTML = "<a href=''>Previous 50 Results</a>"
        }
    }
    if(pageNum==pages_length){
        $nextBtn.classList.add("disabled")
        $nextBtn.innerHTML = "<a href=''>End of Results</a>";
    }
    
})
let $previousBtn = document.querySelector("#previous")
$previousBtn.addEventListener("click",function handlePrevious(event){
    event.preventDefault();
    if (pageNum>1){
        $previousBtn.classList.remove('disabled');
        $previousBtn.innerHTML = "<a href=''>Previous 50 Results</a>"
        pageNum-=1;
        startNum-=50;
        endNum-=50;
        renderTable(startNum,endNum)
        if (pageNum<=pages_length){
            $nextBtn.classList.remove("disabled")
            $nextBtn.innerHTML="<a href=''>Next 50 Results</a>"
        }
    }
})
let $lastBtn = document.querySelector(".end");
$lastBtn.addEventListener("click",function handleLast(event){
    event.preventDefault();
    endNum=dataSet.length;
    startNum=endNum-50;
    pageNum=pages_length;
    renderTable(startNum,endNum)
    $nextBtn.classList.add("diabled");
    $nextBtn.innerHTML = "<a href=''>End of Results</a>";
    $previousBtn.classList.remove("disabled")
    $previousBtn.innerHTML = "<a href=''>Previous 50 Results</a>"
})

