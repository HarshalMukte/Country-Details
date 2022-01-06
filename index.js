"use strict";

const container = document.querySelector("#container");
const countryNameDiv = document.querySelector("#country");
const inputVal = document.querySelector("#inputVal");
const loadAnimation = document.getElementById("loading");
const favIcon = document.querySelector("link[rel*=icon]");
const bodyBackground = document.querySelector(".backgroundImage");
const dropDownIcon = document.querySelector(".DropIcon");
const searchDiv = document.querySelector(".searchDiv");
let isTabletView = false;
let isDrop = false;

//for loading
let onLoading = () => {
  container.style.opacity = "0";
  searchDiv.style.opacity = "0";
  loadAnimation.style.opacity = "0.8";
  loadAnimation.style.display = "flex";

  setTimeout(() => {
    loadAnimation.style.opacity = "0";
  }, 1500);

  setTimeout(() => {
    loadAnimation.style.display = "none";
    container.style.opacity = "1";
    searchDiv.style.opacity = "1";
  }, 2000);
};

let dropIconFunction = () => {
  if (isDrop) {
    dropDownIcon.querySelector("i").classList.remove("fa-sort-down");
    dropDownIcon.querySelector("i").classList.add("fa-sort-up");
    countryNameDiv.classList.remove("active");
    container.classList.remove("blur");
    isDrop = false;
  } else {
    dropDownIcon.querySelector("i").classList.remove("fa-sort-up");
    dropDownIcon.querySelector("i").classList.add("fa-sort-down");
    countryNameDiv.classList.add("active");
    isTabletView ? container.classList.add("blur") : container.classList.remove("blur");
    isDrop = true;
  }
};

let getListValue = (e) => {
  let displayValue = e.getAttribute("data-value");
  //calling api based on selected country
  apis(displayValue);
  inputVal.value = displayValue;
};

// fetching data for geting data of all country
let nameApis = () => {
  countryNameDiv.innerHTML = "";
  //filtering the country name based on the name searched
  let findCountryName = countryNameApi.filter(
    (e) => e.toLowerCase().indexOf(inputVal.value.toLowerCase()) > -1
  );
  //checking if array is empty or not
  if (findCountryName.length === 0 || findCountryName.length < 1) {
    let listName = `<li class="No-data-list">No Data Found</li>`;
    return countryNameDiv.insertAdjacentHTML("beforeend", listName);
  } else {
    //printing the name of the country based on searched results
    let countryNames = findCountryName.map((e) => {
      let listName = `<li onclick = getListValue(this) data-value = "${e}">${e}</li>`;
      return countryNameDiv.insertAdjacentHTML("beforeend", listName);
    });
  }

  isDrop ? false : dropIconFunction();
};

// fetching data for the specific country
let apis = (displayValue) => {
  container.innerHTML = "";
  fetch(`https://restcountries.com/v3.1/name/${displayValue}`)
    .then((response) => response.json())
    .then((data) => {
      let [obj] = data;

      //putting values in html
      const htmlData = `
    <div class="box">
    <img src= "${obj.flags.png}"  alt="flag">
    <h1>${obj.name.common}</h1>
    <p>Capital: ${obj.capital}</p>
    <p>Currency: ${Object.values(obj.currencies)[0].name}</p>
    <p>Population: ${obj.population}</p>
    <p>Google Map: <a href="${
      obj.maps.googleMaps
    }" target="_blank">www.google.com/maps</a></p>
    </div>
    `;

      container.insertAdjacentHTML("afterbegin", htmlData);
      // to change favicon according to flag
      favIcon.href = obj.flags.svg;

      // to change title of body according to country name
      let titleName = document.querySelector("title");
      titleName.innerText = obj.name.common;

      //to chgange the body backgroung according to flag
      bodyBackground.style.background = `linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${obj.flags.svg})`;
    })
    .catch((error) =>{
      console.log(error);
      let htmlData = `<h1 style="color: #000; font-size: 40px; text-align: center;">Currently Servers are down</h1> 
                      <p style="font-size: 25px;">Please try again later...</p>`
      container.insertAdjacentHTML("afterbegin", htmlData);
      container.classList.remove("blur")
      container.style.flexDirection = "column";
      container.style.background = "#e1e1e1";
    }
    )
};

window.addEventListener("load", nameApis);
window.addEventListener("load", apis(inputVal.value));
// sel.addEventListener("change", apis);

// sel.addEventListener("change", onLoading);
window.addEventListener("load", onLoading);
inputVal.addEventListener("input", nameApis);
dropDownIcon.addEventListener("click", dropIconFunction);

//for media query view
function mediaFunction(x) {
  if (x.matches) {
    isTabletView = true;
    isDrop ? container.classList.add("blur") : container.classList.remove("blur");
  }else{
    isTabletView = false;
    container.classList.remove("blur")
  }
}
let requiredView = window.matchMedia("(max-width:768px)");
mediaFunction(requiredView)
requiredView.addListener(mediaFunction)
