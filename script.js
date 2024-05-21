$(document).ready(function() { 
    const apiKey = "2aed28d65691307452819aea8410a262";

    $(".sääLomake").on("submit", function(event) { 
        event.preventDefault();
        const kaupunki = $(".syötäKaupunki").val(); 
        if (kaupunki) {
            haeSääData(kaupunki)
                .then(data => näytäSää(data))
                .catch(error => {
                    console.error(error);
                    näytäVirhe(error.message);
                });
        } else {
            näytäVirhe("Syötä paikkakunta");
        }
    });

    function haeSääData(kaupunki) { 
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${kaupunki}&lang=fi&appid=${apiKey}`;
        return $.getJSON(apiUrl).fail(function() { 
            throw new Error("Paikkakuntaa ei löydy.");
        });
    }

    function näytäSää(data) {
        const { name: kaupunki, main: { temp, humidity, feels_like }, weather: [{ description, id }], wind: { speed } } = data;

        $(".kortti").empty().css("display", "flex"); 

        
        const näytäKaupunki = $("<h1>").text(kaupunki).addClass("näytäKaupunki"); 
        const näytäEmoji = $("<p>").text(haeSääEmoji(id)).addClass("näytäEmoji");
        const näytäLämpö = $("<p>").text(`${(temp - 273.15).toFixed(1)}°C`).addClass("näytäLämpö").addClass(temp - 273.15 < 0 ? "pakkanen" : "plussa");
        const tuntuuKuin = $("<p>").text(`Tuntuu kuin: ${(feels_like - 273.15).toFixed(1)}°C`).addClass("tuntuuKuin");
        const näytäTuuli = $("<p>").text(`Tuuli: ${speed.toFixed(0)} m/s`).addClass("näytäTuuli");
        const näytäKosteus = $("<p>").text(`Kosteus: ${humidity}%`).addClass("näytäKosteus");
        const näytäKuvaus = $("<p>").text(description).addClass("näytäKuvaus"); 
        

        $(".kortti").append(näytäKaupunki, näytäEmoji, näytäLämpö, tuntuuKuin, näytäTuuli, näytäKosteus, näytäKuvaus);
    }

    function haeSääEmoji(sääId) {
        switch(true) {
            case (sääId >= 200 && sääId < 300): return "⛈️";
            case (sääId >= 300 && sääId < 400): return "🌧️";
            case (sääId >= 500 && sääId < 600): return "🌧️";
            case (sääId >= 600 && sääId < 700): return "🌨️";
            case (sääId >= 700 && sääId < 800): return "🌫️";
            case (sääId === 800): return "☀️";
            case (sääId >= 801 && sääId < 810): return "☁️";
            default: return "❓";
        }
    }

    function näytäVirhe(viesti) { 
        const virheNäyttö = $("<p>").text(viesti).addClass("virheNäyttö"); 
        $(".kortti").empty().css("display", "flex").append(virheNäyttö); 
    }
});
