// Luodaan muuttujat

const sääLomake = document.querySelector(".sääLomake");
const syötäKaupunki = document.querySelector(".syötäKaupunki");
const kortti = document.querySelector(".kortti");
const apiKey = "2aed28d65691307452819aea8410a262";

sääLomake.addEventListener("submit", async event => {

//Asetetaan lomake nollautumaan sivun päivityksessä
    event.preventDefault();

//Haetaan input kenttään kirjoitettu paikkakunta ja asetetaan varoitusteksti 
//jos paikkakuntaa ei ole kirjoitettu
    const kaupunki = syötäKaupunki.value;
    if (kaupunki) {
        try {
            const sääData = await haeSääData(kaupunki);
            näytäSää(sääData);

        }
        catch(error) {
            console.error(error);
            näytäVirhe(error);

        }

    }
    else {
        näytäVirhe("Syötä paikkakunta");
    }
});

// Määritetään funktio hakemaan säätiedot openweathermapin apista.
async function haeSääData(kaupunki) {
    const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${kaupunki}&lang=fi&appid=${apiKey}`;
    const response = await fetch(apiUrl);

// Varaudutaan mahdollisuuteen että kirjoitettua paikkakuntaa ei löydy tietokannasta.
    if(!response.ok){
        throw new Error("Paikkakuntaa ei löydy.") ;
    }
// Palautetaan saadut säätidot json muodossa
    return await response.json();


}

// Tehdään funktio säätietojen näyttämiseen
function näytäSää(data) {
    const { //Valitaan muuttujat jotka halutaan näyttää
            name: kaupunki,
            main: {temp, humidity, feels_like},
            weather:[{description, id}],
            wind: {speed} } = data;

    kortti.textContent = "";
    kortti.style.display = "flex";

// Luodaan HTML-elementit
    const näytäKaupunki = document.createElement("h1");
    const näytäLämpö = document.createElement("p");
    const tuntuuKuin = document.createElement("p");
    const näytäTuuli = document.createElement("p");
    const näytäKosteus = document.createElement("p");
    const näytäKuvaus = document.createElement("p");
    const näytäEmoji = document.createElement("p");
    
//Määritellään elementtien sisältö
    näytäKaupunki.textContent = kaupunki;
    näytäLämpö.textContent = `${(temp - 273.15).toFixed(1)}°C`;
    if (temp - 273.15 < 0) {
        näytäLämpö.classList.add("pakkanen"); }
        else {
            näytäLämpö.classList.add("plussa");
        }
    tuntuuKuin.textContent = `Tuntuu kuin: ${(feels_like - 273.15).toFixed(1)}°C`
    näytäTuuli.textContent = `Tuuli: ${speed.toFixed(0)} m/s`
    näytäKosteus.textContent = `Kosteus: ${humidity}%`;
    näytäKuvaus.textContent = description;
    näytäEmoji.textContent = haeSääEmoji(id);

// Lisätään luodut elementit sääkorttiin ja yhdistetään muotoilut CSS-tiedostosta.
    näytäKaupunki.classList.add("näytäKaupunki");
    näytäLämpö.classList.add("näytäLämpö");
    tuntuuKuin.classList.add("tuntuuKuin");
    näytäTuuli.classList.add("näytäTuuli");
    näytäKosteus.classList.add("näytäKosteus");
    näytäKuvaus.classList.add("näytäKuvaus");
    näytäEmoji.classList.add("näytäEmoji");

    kortti.appendChild(näytäKaupunki);
    kortti.appendChild(näytäLämpö);
    kortti.appendChild(tuntuuKuin);
    kortti.appendChild(näytäTuuli);
    kortti.appendChild(näytäKosteus);
    kortti.appendChild(näytäKuvaus);
    kortti.appendChild(näytäEmoji);
        
    
}
// Luodaan ja määritellään palautuva sääemoji sääIDn mukaisesti.
function haeSääEmoji (sääId) {

    switch(true){
        case (sääId >= 200 && sääId < 300 ):
            return "⛈️";
        case (sääId >= 300 && sääId < 400 ):
            return "🌧️";
        case (sääId >= 500 && sääId < 600 ):
            return "🌧️";
        case (sääId >= 600 && sääId < 700 ):
            return "🌨️";
        case (sääId >= 700 && sääId < 800 ):
            return "🌫️";
        case (sääId === 800):
            return "☀️";
        case (sääId >= 801 && sääId < 810 ):
            return "☁️";
        default:
            return "❓" ;
    }

}

// Luodaan oma funktio virheilmoitukselle joka tulee jos paikkakuntaa ei syötetä
function näytäVirhe(viesti) {

    const virheNäyttö = document.createElement("p") ;
    virheNäyttö.textContent = viesti;
    virheNäyttö.classList.add("virheNäyttö");

    kortti.textContent = "" ;
    kortti.style.display = "flex";
    kortti.appendChild(virheNäyttö);

}