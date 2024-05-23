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

    // Funktio säätietojen hakemiseen 
    function haeSääData(kaupunki) {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${kaupunki}&lang=fi&appid=${apiKey}`;
        return $.ajax({     //jQuery AJAX pyyntö
            url: apiUrl,
            dataType: 'json'
        }).then(data => {
            return data;
        }).catch(() => {
            throw new Error("Paikkakuntaa ei löydy.");
        });
    }
    
    // Funktio säätietojen näyttämiseen
    function näytäSää(data) {
        const { name: kaupunki, main: { temp, humidity, feels_like }, weather: [{ description, id }], wind: { speed } } = data;

        $(".kortti").empty().css("display", "flex"); 

        
        const näytäKaupunki = $("<h1>").text(kaupunki).addClass("näytäKaupunki"); 
        const näytäEmoji = $("<p>").text(haeSääEmoji(id)).addClass("näytäEmoji").hide();
        const näytäLämpö = $("<p>").text(`${(temp - 273.15).toFixed(1)}°C`).addClass("näytäLämpö").addClass(temp - 273.15 < 0 ? "pakkanen" : "plussa").hide();
        const tuntuuKuin = $("<p>").text(`Tuntuu kuin: ${(feels_like - 273.15).toFixed(1)}°C`).addClass("tuntuuKuin").hide();
        const näytäTuuli = $("<p>").text(`Tuuli: ${speed.toFixed(0)} m/s`).addClass("näytäTuuli").hide();
        const näytäKosteus = $("<p>").text(`Kosteus: ${humidity}%`).addClass("näytäKosteus").hide();
        const näytäKuvaus = $("<p>").text(description).addClass("näytäKuvaus").hide(); 
        

        $(".kortti").append(näytäKaupunki, näytäEmoji, näytäLämpö, tuntuuKuin, näytäTuuli, näytäKosteus, näytäKuvaus);

        $(".kortti").show() ;

        // jQuery fadeIn asetukset
        näytäEmoji.delay(250).fadeIn(2000);
        näytäLämpö.delay(500).fadeIn(2000);
        tuntuuKuin.delay(750).fadeIn(2000).fadeOut(5000);
        näytäTuuli.delay(1000).fadeIn(2000).fadeOut(5000);
        näytäKosteus.delay(1250).fadeIn(2000).fadeOut(5000);
        näytäKuvaus.delay(1500).fadeIn(2000).fadeOut(5000);
        
    }
        // Sopivan sääemojin haku
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
        // Funktio virheen varalle
    function näytäVirhe(viesti) { 
        const virheNäyttö = $("<p>").text(viesti).addClass("virheNäyttö"); 
        $(".kortti").empty().css("display", "flex").append(virheNäyttö); 
    }
});
