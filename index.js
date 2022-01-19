async function DataServer(url = 'http://localhost:1880/user') {
    var res = await fetch(url);
    var data = await res.json();
    data.forEach(item => {
        if (item.dateOfBirth > 2000) {
            item.PaymentSupport = 2000000;
        } else {
            item.PaymentSupport = 3000000;
        }
    });
    return data
}

async function GetData() {
    var data = await DataServer();
    RenderUI(data, () => true);
}
async function GetVaccinated() {
    var data = await DataServer();
    RenderUI(data, item => item.vaccinated);
}
async function GetDataByDateOfBirth(dateOfBirth) {
    var data = await DataServer();
    RenderUI(data, item => item.dateOfBirth == dateOfBirth);
}
var userAgeList = [];
function RenderUI(data, criterial) {
    var content = document.getElementById("content");
    content.innerHTML = "";
    data.forEach(item => {
        if (criterial(item)) {
            var userAge = new Date().getFullYear() - item.dateOfBirth
            SetAge(userAge);
            content.innerHTML += ` <div class="col-3 mt-3">   
                <div class="card">                       
                    <img class="card-img-top" src="${item.avatar}" 
                    alt="Card image" style="width:100%">                       
                        <div class="card-body">                          
                            <h4 class="card-title">${item.name}</h4>                      
                            <p class="card-text">Age: ${userAge}</p>               
                            <p class="card-text">Payment Support: ${item.PaymentSupport}</p>   
                            <a href="#" class="btn ${item.vaccinated ? "btn-success" : "btn-danger"}">                             
                             ${item.vaccinated ? "Vaccinated" : "Not vaccinated"}                       
                            </a>                 
                        </div>                 
                </div>    
            </div>            `
        }
    });
}
function SetAge(userAge) {
    userAgeList.includes(userAge) ? null : userAgeList.push(userAge)
    var AgeContent = document.getElementById("AgeContent");
    AgeContent.innerHTML = "";
    userAgeList.sort(function (a, b) { return a - b }).forEach(num => {
        AgeContent.innerHTML += `<a class="dropdown-item" href="#" onclick="GetDataByDateOfBirth(${new Date().getFullYear() - num})"> ${num}                </a>            `
    });
}

async function Report() {
    var data = await DataServer();
    var vaccinatedCost = await data.filter(item => !item.vaccinated).reduce((total, item) => total + item.PaymentSupport, 0);
    var notVaccinatedCost = await data.filter(item => !item.vaccinated).reduce((total, item) => total + item.PaymentSupport, 0);
    var TotalP = await data.reduce((total, item) => total + item.PaymentSupport, 0);
    document.getElementById("vaccinatedCost").innerText = "Chi phí hỗ trợ cho người đã tiêm phòng: " + vaccinatedCost;
    document.getElementById("notVaccinatedCost").innerText = "Chi phí hỗ trợ cho người chưa tiêm phòng: " + notVaccinatedCost;
    document.getElementById("Total").innerText = "Tổng chi phí hỗ trợ: " + TotalP;
    var costFlowAge = [];
    data.forEach(item => {
        if (!costFlowAge.includes(item.dateOfBirth)) {
            costFlowAge.push(item.dateOfBirth)
        }
    });
    var tableContent = document.getElementById("tableContent")
    tableContent.innerHTML = "";
    costFlowAge = costFlowAge.sort((a, b) => b - a);
    costFlowAge.forEach(async (item) => {
        var payment = await data.filter(n => n.dateOfBirth == item).reduce((total, item) => total + item.PaymentSupport, 0);
        tableContent.innerHTML += `<tr><td>${2022 - item}</td><td>${payment}</td></ >`
    });
}